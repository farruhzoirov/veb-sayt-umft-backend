const universitySchema = require('../models/data/university');
const universityTranslateSchema = require('../models/translate/university');
const categorySchema = require('../models/data/category');
const categoryTranslateSchema = require('../models/translate/category');
const directionSchema = require('../models/data/directions');
const directionTranslateSchema = require('../models/translate/directions');
const eventsSchema = require('../models/data/events');
const eventsTranslateSchema = require('../models/translate/events');
const facultySchema = require('../models/data/faculty');
const facultyTranslateSchema = require('../models/translate/faculty');
const newsSchema = require('../models/data/news');
const newsTranslateSchema = require('../models/translate/news');
const pageSchema = require('../models/data/page');
const pageTranslateSchema = require('../models/translate/page');
const partnerSchema = require('../models/data/partners');
const partnerTranslateSchema = require('../models/translate/partners');
const specialistInfoSchema = require('../models/data/specialists-info');
const specialistInfoTranslateSchema = require('../models/translate/specialists-info');
const userSchema = require('../models/user');
const languageSchema = require('../models/settings/language');
const degreeTranslateSchema = require('../models/translate/degrees');
const degreeSchema = require('../models/data/degrees');
const levelSchema = require('../models/data/levels');
const levelTranslateSchema = require('../models/translate/levels');

// Formats
const formatSchema = require('../models/data/format');
const formatTranslateSchema = require('../models/translate/formats');

// Topics

const topicSchema = require('../models/data/topics');
const topicTranslateSchema = require('../models/translate/topics');

const { Model, TranslateModel } = require("../common/constants/models")

function getModelsHelper(modelKey) {
    switch (modelKey) {
        case Model.university.ref:
            return universitySchema;
        case Model.category.ref:
            return categorySchema;
        case Model.direction.ref:
            return directionSchema;
        case Model.events.ref:
            return eventsSchema;
        case Model.faculty.ref:
            return facultySchema;
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
        case TranslateModel.direction.ref:
            return directionTranslateSchema;
        case TranslateModel.events.ref:
            return eventsTranslateSchema;
        case TranslateModel.faculty.ref:
            return facultyTranslateSchema;
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
        default:
            throw new Error(`Translation model "${modelKey}" not found.`);
    }
}

async function getModel(req, res) {
    let model = req.params.model || null;
    if (!model) {
        return res.json({
            msg: "model not exists"
        })
    }
    if (!Model.hasOwnProperty(model)) {
        return false;
    }
    return Model[model].ref;
}

module.exports = {
    getModel,
    getModelsHelper,
    getModelsTranslateHelper,
};
