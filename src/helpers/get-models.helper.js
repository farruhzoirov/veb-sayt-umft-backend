const universitySchema = require('../models/data/university.model');
const universityTranslateSchema = require('../models/translate/university.model');

const categorySchema = require('../models/data/category.model');
const categoryTranslateSchema = require('../models/translate/category.model');



const eventsSchema = require('../models/data/events.model');
const eventsTranslateSchema = require('../models/translate/events.model');

const facultySchema = require('../models/data/faculty.model');
const facultyTranslateSchema = require('../models/translate/faculty.model');

const newsSchema = require('../models/data/news.model');
const newsTranslateSchema = require('../models/translate/news.model');

const pageSchema = require('../models/data/page.model');
const pageTranslateSchema = require('../models/translate/page.model');

const partnerSchema = require('../models/data/partners.model');
const partnerTranslateSchema = require('../models/translate/partners.model');

const specialistInfoSchema = require('../models/data/specialists-info.model');
const specialistInfoTranslateSchema = require('../models/translate/specialists-info.model');

const userSchema = require('../models/user/user.model');

const languageSchema = require('../models/settings/language.model');

const degreeTranslateSchema = require('../models/translate/degrees.model');
const degreeSchema = require('../models/data/degrees.model');

const levelSchema = require('../models/data/levels.model');
const levelTranslateSchema = require('../models/translate/levels.model');

// Formats
const formatSchema = require('../models/data/format.model');
const formatTranslateSchema = require('../models/translate/formats.model');

// Topics
const topicSchema = require('../models/data/topics.model');
const topicTranslateSchema = require('../models/translate/topics.model');

const messengerSchema = require('../models/data/messenger.model');
const messengerTranslateSchema = require('../models/translate/messenger.model');


const {Model, TranslateModel} = require("../common/constants/models.constants")


function getModelsHelper(modelKey) {
  switch (modelKey) {
    case Model.university.ref:
      return universitySchema;
    case Model.category.ref:
      return categorySchema;
    // case Model.direction.ref:
    //     return directionSchema;
    case Model.events.ref:
      return eventsSchema;
    // case Model.faculty.ref:
    //     return facultySchema;
    case Model.news.ref:
      return newsSchema;
    case Model.page.ref:
      return pageSchema;
    case Model.partners.ref:
      return partnerSchema;
    case Model.specialistInfo.ref:
      return specialistInfoSchema;
    case Model.user.ref:
      return userSchema;
    case Model.language.ref:
      return languageSchema;
    case Model.degree.ref:
      return degreeSchema;
    case Model.level.ref:
      return levelSchema;
    case Model.format.ref:
      return formatSchema;
    case Model.topic.ref:
      return topicSchema;
    case Model.messenger.ref:
      return messengerSchema;
    default:
      throw new Error(`Model "${modelKey}" not found.`);
  }
}

function getModelsTranslateHelper(modelKey) {
  switch (modelKey) {
    case TranslateModel.university.ref:
      return universityTranslateSchema;
    case TranslateModel.category.ref:
      return categoryTranslateSchema;
    // case TranslateModel.direction.ref:
    //     return directionTranslateSchema;
    case TranslateModel.events.ref:
      return eventsTranslateSchema;
    // case TranslateModel.faculty.ref:
    //     return facultyTranslateSchema;
    case TranslateModel.news.ref:
      return newsTranslateSchema;
    case TranslateModel.page.ref:
      return pageTranslateSchema;
    case TranslateModel.partners.ref:
      return partnerTranslateSchema;
    case TranslateModel.specialistInfo.ref:
      return specialistInfoTranslateSchema;
    case TranslateModel.format.ref:
      return formatTranslateSchema;
    case TranslateModel.degree.ref:
      return degreeTranslateSchema;
    case TranslateModel.level.ref:
      return levelTranslateSchema;
    case TranslateModel.topic.ref:
      return topicTranslateSchema;
    case TranslateModel.messenger.ref:
      return topicTranslateSchema;
    default:
      throw new Error(`Translation model "${modelKey}" not found.`);
  }
}

async function getModel(req) {
  const model = req.params ? req.params.model : {};
  if (!Model.hasOwnProperty(model)) {
    throw new Error('Model with that name"' + model + '" not found.');
  }
  return Model[model].ref;
}


module.exports = {
  getModel,
  getModelsHelper,
  getModelsTranslateHelper,
};
