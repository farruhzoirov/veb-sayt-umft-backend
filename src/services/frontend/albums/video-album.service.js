const getDefaultLanguageHelper = require("../../../helpers/frontend/get-default-language.helper");
const {getModelsHelper, getModelsTranslateHelper} = require("../../../helpers/admin-panel/get-models.helper");
const Language = require("../../../models/settings/language.model");
const BaseError = require("../../../errors/base.error");
const {Model, TranslateModel} = require("../../../common/constants/models.constants");

const VideoAlbumCategory = require("../../../models/data/video-album-category.model");

class VideoAlbumService {
  constructor() {
    this.Model = Model
    this.TranslateModel = TranslateModel
  }

  async getVideoAlbumsForFront(req) {
    const defaultLanguage = await getDefaultLanguageHelper();
    const currentModel = this.Model.videoAlbum.ref;
    const dynamicModel = getModelsHelper(currentModel);
    let videoAlbumList;
    let queryParameters;
    try {
      queryParameters = {
        limit: Math.max(1, parseInt(req.query?.limit, 10) || 30),
        page: Math.max(1, parseInt(req.query?.page, 10) || 1),
        skip: (parseInt(req.query?.limit, 10) || 10) * ((parseInt(req.query.page, 10) || 1) - 1),
        selectFields: req.query?.select || "",
        requestedLanguage: req.query?.language || defaultLanguage.slug,
        videoAlbumCategory: req.query?.videoAlbumCategory || null,
      };
    } catch (err) {
      throw BaseError.BadRequest('Error parsing queryParameter');
    }

    const selectedLanguage = await Language.findOne({slug: queryParameters.requestedLanguage}).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }


    let videoAlbumCategoryIds = [];
    if (queryParameters.videoAlbumCategory) {
      const videoAlbumCategories = [queryParameters.videoAlbumCategory];
      videoAlbumCategoryIds = await VideoAlbumCategory.find({slug: {$in: videoAlbumCategories}}).distinct('_id').lean();
    }
    const filter = {status: 1};

    if (videoAlbumCategoryIds.length) {
      filter.photoAlbumCategory = {$in: photoAlbumCategoryIds};
    }

    videoAlbumList = await dynamicModel
        .find(filter)
        .sort({_id: -1})
        .limit(queryParameters.limit)
        .skip(queryParameters.skip)
        .select('-__v')
        .lean()

    if (this.Model[currentModel].translate) {
      const translateModelName = this.TranslateModel[currentModel].ref;
      const dynamicTranslateModel = getModelsTranslateHelper(translateModelName);

      videoAlbumList = await Promise.all(
          videoAlbumList.map(async modelItem => {
            const translationData = await dynamicTranslateModel.findOne({
              [currentModel]: modelItem._id,
              [this.Model.language.ref]: selectedLanguage._id,
            }).select(`-${currentModel} -__v -language  -updatedAt`).lean();
            return {...modelItem, ...(translationData || {})};
          })
      );
    }
    videoAlbumList = videoAlbumList.filter((item) => item.name);
    const total = await dynamicModel.countDocuments(filter);
    return {
      data: videoAlbumList,
      pagination: {
        total,
        limit: queryParameters.limit,
        page: queryParameters.page,
        pages: Math.ceil(total / queryParameters.limit),
      },
    };
  }
}


module.exports = VideoAlbumService;