const getDefaultLanguageHelper = require("../../helpers/frontend/get-default-language.helper");
const {getModelsHelper, getModelsTranslateHelper} = require("../../helpers/admin-panel/get-models.helper");
const Language = require("../../models/settings/language.model");
const BaseError = require("../../errors/base.error");
const {Model, TranslateModel} = require("../../common/constants/models.constants");

const Category = require("../../models/data/category.model");

class NewsService {
  constructor() {
    this.Model = Model
    this.TranslateModel = TranslateModel
  }

  async getNewsForFront(req) {
    const defaultLanguage = await getDefaultLanguageHelper();
    const currentModel = this.Model.news.ref;
    const dynamicModel = getModelsHelper(currentModel);
    let newsList;

    // Query preparation
    const queryParameters = {
      limit: req.query?.limit ? parseInt(req.query.limit, 10) : 30,
      page: req.query?.page ? parseInt(req.query.page, 10) : 1,
      skip: (req.query?.limit ? parseInt(req.query.limit, 10) : 10) * ((req.query.page ? parseInt(req.query.page, 10) : 1) - 1),
      selectFields: req.query?.select || '',
      requestedLanguage: req.query?.language || defaultLanguage.slug,
      category: req.query?.category,
    };

    const selectedLanguage = await Language.findOne({
      slug: queryParameters.requestedLanguage,
    }).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    if (queryParameters.category &&
        typeof (queryParameters.category) !== 'string' ||
        !Array.isArray(queryParameters.category)
    ) {
      throw BaseError.BadRequest("Category must be string or an array");
    }

    if (!queryParameters.category.length && !Array.isArray(queryParameters.category)) {
      newsList = await dynamicModel
          .find({status: 1})
          .sort({_id: -1})
          .select(queryParameters.selectFields ? queryParameters.selectFields : `-__v  -updatedAt -active -status`)
          .limit(queryParameters.limit)
          .skip(queryParameters.skip)
          .lean();
    }

    if (Array.isArray(queryParameters.category) || queryParameters.category?.length) {
      const categories = Array.isArray(queryParameters.category)
          ? queryParameters.category
          : [queryParameters.category];

      const categoriesId = await Category.find({slug: {$in: categories}}).distinct("_id").lean();

      newsList = await dynamicModel
          .find({status: 1, category: {$in: categoriesId}})
          .sort({_id: -1})
          .select(queryParameters.selectFields ? queryParameters.selectFields : `-__v  -updatedAt -active -status`)
          .limit(queryParameters.limit)
          .skip(queryParameters.skip)
          .lean();
    }

    if (this.Model[currentModel].translate) {
      const translateModelName = this.TranslateModel[currentModel].ref;
      const dynamicTranslateModel = getModelsTranslateHelper(translateModelName);

      newsList = await Promise.all(
          newsList.map(async modelItem => {
            const translationData = await dynamicTranslateModel.findOne({
              [currentModel]: modelItem._id,
              [this.Model.language.ref]: selectedLanguage._id,
            }).select(queryParameters.selectFields ? queryParameters.selectFields : `-${currentModel} -__v -language  -updatedAt`).lean();

            return {...modelItem, ...translationData || {}};
          })
      );
    }
    newsList = newsList.filter((item) => item.title);
    const total = await dynamicModel.countDocuments({status: 1});

    const paginationInfo = {
      total: total,
      limit: queryParameters.limit,
      page: queryParameters.page,
      pages: Math.ceil(total / queryParameters.limit),
    };

    return {data: newsList, pagination: paginationInfo};
  }
}


module.exports = NewsService;