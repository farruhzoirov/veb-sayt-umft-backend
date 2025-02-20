const universitySchema = require("../../models/data/university.model");
const universityTranslateSchema = require("../../models/translate/university.model");

const categorySchema = require("../../models/data/category.model");
const categoryTranslateSchema = require("../../models/translate/category.model");

const eventsSchema = require("../../models/data/events.model");
const eventsTranslateSchema = require("../../models/translate/events.model");

const departmentSchema = require("../../models/data/department.model");
const departmentTranslateSchema = require("../../models/translate/department.model");

const newsSchema = require("../../models/data/news.model");
const newsTranslateSchema = require("../../models/translate/news.model");

const pageSchema = require("../../models/data/page.model");
const pageTranslateSchema = require("../../models/translate/page.model");

const partnerSchema = require("../../models/data/partners.model");
const partnerTranslateSchema = require("../../models/translate/partners.model");

const userSchema = require("../../models/user/user.model");

const languageSchema = require("../../models/settings/language.model");

const degreeTranslateSchema = require("../../models/translate/degrees.model");
const degreeSchema = require("../../models/data/degrees.model");

const levelSchema = require("../../models/data/levels.model");

// Formats
const formatSchema = require("../../models/data/format.model");
const formatTranslateSchema = require("../../models/translate/formats.model");

// Topics
const topicSchema = require("../../models/data/topics.model");
const topicTranslateSchema = require("../../models/translate/topics.model");

const themeSchema = require("../../models/data/themes.model");
const themeTranslateSchema = require("../../models/translate/themes.model");

const messengerSchema = require("../../models/data/messenger.model");
const messengerTranslateSchema = require("../../models/translate/messenger.model");

const eventsCategorySchema = require("../../models/data/events-category.model");
const eventsCategoryTranslateSchema = require("../../models/translate/events-category.model");

const specialtySchema = require("../../models/specialty/specialty.model");
const specialtyTranslateSchema = require("../../models/translate/specialty.model");

const socialsSchema = require("../../models/socials/socials.model");

const contactsSchema = require("../../models/data/contacts.model");

const employeeSchema = require("../../models/data/employee.model");
const employeeTranslateSchema = require("../../models/translate/employee.model");

const licenceSchema = require("../../models/data/licence.model");

const socialSchema = require("../../models/socials/socials.model");
const socialTranslateSchema = require("../../models/translate/socials.model");


// Album based
const photoAlbumSchema = require("../../models/data/photo-album.model");
const photoAlbumTranslateSchema = require("../../models/translate/photo-album.model");

const videoAlbumSchema = require("../../models/data/video-album.model");
const videoAlbumTranslateSchema = require("../../models/translate/video-album.model");

const photoAlbumCategorySchema = require('../../models/data/photo-album-category.model');
const photoAlbumCategoryTranslateSchema = require('../../models/translate/photo-album-category.model');
const videoAlbumCategorySchema = require('../../models/data/video-album-category.model');
const videoAlbumCategoryTranslateSchema = require('../../models/translate/video-album-category.model');

const {
  Model,
  TranslateModel,
} = require("../../common/constants/models.constants");

function getModelsHelper(modelKey) {
  switch (modelKey) {
    case Model.university.ref:
      return universitySchema;
    case Model.category.ref:
      return categorySchema;
    case Model.events.ref:
      return eventsSchema;
    case Model.news.ref:
      return newsSchema;
    case Model.page.ref:
      return pageSchema;
    case Model.partner.ref:
      return partnerSchema;
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
    case Model.theme.ref:
      return themeSchema;
    case Model.messenger.ref:
      return messengerSchema;
    case Model.eventsCategory.ref:
      return eventsCategorySchema;
    case Model.department.ref:
      return departmentSchema;
    case Model.specialty.ref:
      return specialtySchema;
    case Model.employee.ref:
      return employeeSchema;
    case Model.socials.ref:
      return socialsSchema;
    case Model.contact.ref:
      return contactsSchema;
    case Model.licence.ref:
      return licenceSchema;
    case Model.social.ref:
      return socialSchema;
    case Model.photoAlbum.ref:
      return photoAlbumSchema;
    case Model.videoAlbum.ref:
      return videoAlbumSchema;
    case Model.photoAlbumCategory.ref:
      return photoAlbumCategorySchema;
    case Model.videoAlbumCategory.ref:
      return videoAlbumCategorySchema;
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
    case TranslateModel.events.ref:
      return eventsTranslateSchema;
    case TranslateModel.news.ref:
      return newsTranslateSchema;
    case TranslateModel.page.ref:
      return pageTranslateSchema;
    case TranslateModel.partner.ref:
      return partnerTranslateSchema;
    case TranslateModel.format.ref:
      return formatTranslateSchema;
    case TranslateModel.degree.ref:
      return degreeTranslateSchema;
    case TranslateModel.topic.ref:
      return topicTranslateSchema;
    case TranslateModel.theme.ref:
      return themeTranslateSchema
    case TranslateModel.eventsCategory.ref:
      return eventsCategoryTranslateSchema;
    case TranslateModel.department.ref:
      return departmentTranslateSchema;
    case TranslateModel.specialty.ref:
      return specialtyTranslateSchema;
    case TranslateModel.messenger.ref:
      return messengerTranslateSchema;
    case TranslateModel.employee.ref:
      return employeeTranslateSchema;
    case TranslateModel.social.ref:
      return socialTranslateSchema
    case TranslateModel.photoAlbum.ref:
      return photoAlbumTranslateSchema;
    case TranslateModel.videoAlbum.ref:
      return videoAlbumTranslateSchema;
    case TranslateModel.photoAlbumCategory.ref:
      return photoAlbumCategoryTranslateSchema;
    case TranslateModel.videoAlbumCategory.ref:
      return videoAlbumCategoryTranslateSchema;
    default:
      throw new Error(`Translation model "${modelKey}" not found.`);
  }
}

async function getModel(req) {
  const model = req.params ? req.params.model : {};
  console.log(req.params)
  console.log(model)
  if (!Model.hasOwnProperty(model)) {
    throw new Error('Model with that name" ' + model + '" not found.');
  }
  return Model[model].ref;
}

module.exports = {
  getModel,
  getModelsHelper,
  getModelsTranslateHelper,
};
