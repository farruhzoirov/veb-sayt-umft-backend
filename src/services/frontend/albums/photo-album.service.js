const getDefaultLanguageHelper = require("../../../helpers/frontend/get-default-language.helper");
const {getModelsHelper, getModelsTranslateHelper} = require("../../../helpers/admin-panel/get-models.helper");
const Language = require("../../../models/settings/language.model");
const BaseError = require("../../../errors/base.error");
const {Model, TranslateModel} = require("../../../common/constants/models.constants");

const PhotoAlbumCategory = require("../../../models/data/photo-album-category.model");

class PhotoAlbumService {
  constructor() {
    this.Model = Model
    this.TranslateModel = TranslateModel
  }

  async getPhotoAlbumsForFront(req) {
    const defaultLanguage = await getDefaultLanguageHelper();
    const currentModel = this.Model.photoAlbum.ref;
    const dynamicModel = getModelsHelper(currentModel);
    let photoAlbumList;

    const queryParameters = {
      limit: Math.max(1, parseInt(req.query?.limit, 10) || 30),
      page: Math.max(1, parseInt(req.query?.page, 10) || 1),
      skip: (parseInt(req.query?.limit, 10) || 10) * ((parseInt(req.query.page, 10) || 1) - 1),
      selectFields: req.query?.select || '',
      requestedLanguage: req.query?.language || defaultLanguage.slug,
      photoAlbumCategory: req.query.photoAlbumCategory ? JSON.parse(req.query?.photoAlbumCategory) : null,
    };

    const selectedLanguage = await Language.findOne({slug: queryParameters.requestedLanguage}).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    if (queryParameters.photoAlbumCategory && !Array.isArray(queryParameters.photoAlbumCategory)) {
      return [];
    }

    let photoAlbumCategoryIds = [];
    if (queryParameters.category) {
      const photoAlbumCategories = queryParameters.photoAlbumCategory;
      photoAlbumCategoryIds = await PhotoAlbumCategory.find({slug: {$in: photoAlbumCategories}}).distinct('_id').lean();
    }
    const filter = {status: 1};

    if (photoAlbumCategoryIds.length) {
      filter.photoAlbumCategory = {$in: photoAlbumCategoryIds};
    }

    photoAlbumList = await dynamicModel
        .find(filter)
        .sort({_id: -1})
        .limit(queryParameters.limit)
        .skip(queryParameters.skip)
        .select('-__v')
        .lean()

    if (this.Model[currentModel].translate) {
      const translateModelName = this.TranslateModel[currentModel].ref;
      const dynamicTranslateModel = getModelsTranslateHelper(translateModelName);

      photoAlbumList = await Promise.all(
          photoAlbumList.map(async modelItem => {
            const translationData = await dynamicTranslateModel.findOne({
              [currentModel]: modelItem._id,
              [this.Model.language.ref]: selectedLanguage._id,
            }).select(`-${currentModel} -__v -language  -updatedAt`).lean();
            return {...modelItem, ...(translationData || {})};
          })
      );
    }
    photoAlbumList = photoAlbumList.filter((item) => item.name);
    const total = await dynamicModel.countDocuments(filter);
    return {
      data: photoAlbumList,
      pagination: {
        total,
        limit: queryParameters.limit,
        page: queryParameters.page,
        pages: Math.ceil(total / queryParameters.limit),
      },
    };
  }
}


module.exports = PhotoAlbumService;