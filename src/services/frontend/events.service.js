const getDefaultLanguageHelper = require("../../helpers/frontend/get-default-language.helper");
const {getModelsHelper, getModelsTranslateHelper} = require("../../helpers/admin-panel/get-models.helper");
const Language = require("../../models/settings/language.model");
const BaseError = require("../../errors/base.error");
const mongoose = require("mongoose");
const {Model, TranslateModel} = require("../../common/constants/models.constants");
const {getPopulates} = require("../../helpers/admin-panel/get-populates.helper");

class EventsService {
  constructor() {
    this.Model = Model
    this.TranslateModel = TranslateModel
  }

  async getEventsForFront(req) {
    const defaultLanguage = await getDefaultLanguageHelper();
    const currentModel = this.Model.events.ref;
    const dynamicModel = getModelsHelper(currentModel);
    let eventsList;

    // Payload preparation
    const payload = {
      eventsCategory: req.body?.eventsCategory
    }

    const queryParameters = {
      limit: req.query?.limit ? parseInt(req.query.limit, 10) : 30,
      page: req.query?.page ? parseInt(req.query.page, 10) : 1,
      skip: (req.query?.limit ? parseInt(req.query.limit, 10) : 10) * ((req.query.page ? parseInt(req.query.page, 10) : 1) - 1),
      selectFields: req.query?.select || '',
      requestedLanguage: req.query?.language || defaultLanguage.slug,
    };

    const selectedLanguage = await Language.findOne({
      slug: queryParameters.requestedLanguage,
    }).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    if (!payload.eventsCategory || Array.isArray(payload.eventsCategory) && !payload.eventsCategory?.length) {
      eventsList = await dynamicModel
          .find({status: 1})
          .sort({_id: -1})
          .select(queryParameters.selectFields ? queryParameters.selectFields : `-__v  -updatedAt -active -status`)
          .limit(queryParameters.limit)
          .skip(queryParameters.skip)
          .lean();
    }

    if (Array.isArray(payload.eventsCategory) && payload.eventsCategory.length && payload.eventsCategory.every(mongoose.Types.ObjectId.isValid)) {
      eventsList = await dynamicModel
          .find({status: 1, eventsCategory: {$in: payload.eventsCategory}})
          .sort({_id: -1})
          .select(queryParameters.selectFields ? queryParameters.selectFields : `-__v  -updatedAt -active -status`)
          .limit(queryParameters.limit)
          .skip(queryParameters.skip)
          .lean();
    }

    if (this.Model[currentModel].translate) {
      const translateModelName = this.TranslateModel[currentModel].ref;
      const dynamicTranslateModel = getModelsTranslateHelper(translateModelName);
      const populateOptions = this.Model.events.populate;
      eventsList = await Promise.all(
          eventsList.map(async modelItem => {
            const translationData = await dynamicTranslateModel.findOne({
              [currentModel]: modelItem._id,
              [this.Model.language.ref]: selectedLanguage._id,
            }).select(queryParameters.selectFields ? queryParameters.selectFields : `-${currentModel} -__v -language  -updatedAt`).lean();

            await Promise.all(populateOptions.map(async (item) => {
              modelItem[item] = await getPopulates(item, modelItem[item], selectedLanguage);
            }));

            return {...modelItem, ...translationData || {}};
          })
      );
    }
    eventsList = eventsList.filter((item) => item.name);
    const total = await dynamicModel.countDocuments({status: 1});

    const paginationInfo = {
      total: total,
      limit: queryParameters.limit,
      page: queryParameters.page,
      pages: Math.ceil(total / queryParameters.limit),
    };

    return {data: eventsList, pagination: paginationInfo};
  }
}


module.exports = EventsService;