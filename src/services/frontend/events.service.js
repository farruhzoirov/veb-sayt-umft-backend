const getDefaultLanguageHelper = require("../../helpers/frontend/get-default-language.helper");
const {getModelsHelper, getModelsTranslateHelper} = require("../../helpers/admin-panel/get-models.helper");
const Language = require("../../models/settings/language.model");
const BaseError = require("../../errors/base.error");
const mongoose = require("mongoose");
const {Model, TranslateModel} = require("../../common/constants/models.constants");
const {getPopulates} = require("../../helpers/admin-panel/get-populates.helper");

const EventsCategory = require("../../models/data/events-category.model");

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

    const queryParameters = {
      limit: Math.max(1, parseInt(req.query?.limit, 10) || 30),
      page: Math.max(1, parseInt(req.query?.page, 10) || 1),
      skip: (parseInt(req.query?.limit, 10) || 10) * ((parseInt(req.query?.page, 10) || 1) - 1),
      selectFields: req.query?.select || '',
      requestedLanguage: req.query?.language || defaultLanguage.slug,
      eventsCategory: req.query?.eventsCategory
    };

    const selectedLanguage = await Language.findOne({slug: queryParameters.requestedLanguage}).lean();

    if (!selectedLanguage) {
      throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
    }

    if (queryParameters.category && !Array.isArray(queryParameters.category)) {
      throw BaseError.BadRequest("EventsCategory must be  an array");
    }

    let eventsCategoryIds = [];
    if (queryParameters.eventsCategory) {
      const eventsCategory = queryParameters.eventsCategory;
      eventsCategoryIds = await EventsCategory.find({slug: {$in: eventsCategory}}).distinct('_id').lean();
    }
    const filter = {status: 1};

    if (eventsCategoryIds.length) {
      filter.eventsCategory = {$in: eventsCategoryIds};
    }

    eventsList = await dynamicModel
        .find(filter)
        .sort({_id: -1})
        .select(queryParameters.selectFields ? queryParameters.selectFields : `-__v  -updatedAt -active -status`)
        .skip(queryParameters.skip)
        .limit(queryParameters.limit)
        .lean();

    if (this.Model[currentModel].translate) {
      const translateModelName = this.TranslateModel[currentModel].ref;
      const dynamicTranslateModel = getModelsTranslateHelper(translateModelName);
      const populateOptions = this.Model.events.populate;
      eventsList = await Promise.all(
          eventsList.map(async modelItem => {
            const translationData = await dynamicTranslateModel.findOne({
              [currentModel]: modelItem._id,
              [this.Model.language.ref]: selectedLanguage._id,
            }).select(`-${currentModel} -__v -language  -updatedAt`).lean();
            await Promise.all(populateOptions.map(async (item) => {
              modelItem[item] = await getPopulates(item, modelItem[item], selectedLanguage);
            }));
            return {...modelItem, ...translationData || {}};
          })
      );
    }
    eventsList = eventsList.filter((item) => item.name);
    const total = await dynamicModel.countDocuments({status: 1});

    return {
      data: eventsList,
      pagination: {
        total,
        limit: queryParameters.limit,
        page: queryParameters.page,
        pages: Math.ceil(total / queryParameters.limit),
      },
    };
  }
}


module.exports = EventsService;