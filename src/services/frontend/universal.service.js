const News = require('../../models/data/news.model');
const NewsTranslate = require('../../models/translate/news.model');
const Language = require('../../models/settings/language.model');

const {Model, TranslateModel} = require('../../common/constants/models.constants');

// For Getting default language helper
const getDefaultLanguageHelper = require('../../helpers/frontend/get-default-language.helper');
const BaseError = require("../../errors/base.error");
const {getModel, getModelsHelper, getModelsTranslateHelper} = require("../../helpers/get-models.helper");

class UniversalService {
    constructor() {
        this.Model = Model
        this.TranslateModel = TranslateModel
    }

    async getModelsListForFront(req) {
        const defaultLanguage = await getDefaultLanguageHelper();
        const currentModel = await getModel(req);
        const dynamicModel = getModelsHelper(currentModel);

        // Payload preparation
        const queryParameters = {
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 30,
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            skip: (req.query.limit ? parseInt(req.query.limit, 10) : 10) * ((req.query.page ? parseInt(req.query.page, 10) : 1) - 1),
            selectFields: req.query.select || '',
            requestedLanguage: req.query.language || defaultLanguage.slug,
        };

        const selectedLanguage = await Language.findOne({
            slug: queryParameters.requestedLanguage,
        }).lean();

        let modelsList = await dynamicModel
            .find({status: 1})
            .sort({_id: -1})
            .select(queryParameters.selectFields)
            .limit(queryParameters.limit)
            .skip(queryParameters.skip)
            .lean();

        if (this.Model[currentModel].translate) {
            const translateModelName = this.TranslateModel[currentModel].ref;
            const dynamicTranslateModel = getModelsTranslateHelper(translateModelName);

            modelsList = await Promise.all(
                modelsList.map(async modelItem => {
                    const translationData = await dynamicTranslateModel
                        .findOne({
                            [currentModel]: modelItem._id,
                            [this.Model.language.ref]: selectedLanguage._id,
                        })
                        .select(queryParameters.selectFields ? queryParameters.selectFields : `-${currentModel} -__v -language`)
                        .lean();
                    return {...modelItem, ...translationData || {}};
                })
            );
        }

        // Filter models with a valid title or name
        modelsList = modelsList.filter(modelItem => modelItem.title || modelItem.name);

        // Pagination data
        const totalModels = await dynamicModel.countDocuments({status: 1});
        const paginationInfo = {
            total: totalModels,
            limit: queryParameters.limit,
            page: queryParameters.page,
            pages: Math.ceil(totalModels / queryParameters.limit),
        };

        return {modelsList, pagination: paginationInfo, language: selectedLanguage._id};
    }


    async getOneModelDataForFront(req) {
        const defaultLanguage = await getDefaultLanguageHelper();
        const currentModel = await getModel(req);
        const dynamicModel = getModelsHelper(currentModel);

        const queryParameters = {
            slug: req.params.slug,
            language: req.query.language || defaultLanguage.slug
        }

        if (!queryParameters.slug) {
            throw BaseError.BadRequest('Slug is required');
        }

        const findDynamicModelBySlug = await dynamicModel.findOne({slug: queryParameters.slug}).lean();

        if (!findDynamicModelBySlug) {
            throw BaseError.NotFound('News not found');
        }

        const findLanguageBySlug = await Language.findOne({
            slug: queryParameters.language
        }).lean();

        if (this.Model[currentModel].translate) {
            const translateModelName = this.TranslateModel[currentModel].ref;
            const dynamicTranslateModel = getModelsTranslateHelper(translateModelName);

            const oneDynamicModelTranslate = await dynamicTranslateModel.findOne({
                [this.Model[currentModel].ref]: findDynamicModelBySlug._id,
                [this.Model.language.ref]: findLanguageBySlug._id
            }).select(queryParameters.select ? queryParameters.select : `-${currentModel} -__v -language`).lean();
            return {...findDynamicModelBySlug, ...oneDynamicModelTranslate || {}};
        }
    }
}

module.exports = UniversalService;