const News = require('../../models/data/news.model');
const NewsTranslate = require('../../models/translate/news.model');
const Language = require('../../models/settings/language.model');

const {Model} = require('../../common/constants/models.constants');
// For Getting default language helper
const getDefaultLanguageHelper = require('../../helpers/frontend/get-default-language.helper');
const BaseError = require("../../errors/base.error");

class NewsService {
    constructor() {
        this.Model = Model
    }

    async getNewsForFront(req) {
        const defaultLanguage = await getDefaultLanguageHelper();
        // Payload
        const payload = {
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 30,
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            skip: (req.query.limit ? parseInt(req.query.limit, 10) : 10) * ((req.query.page ? parseInt(req.query.page, 10) : 1) - 1),
            select: req.query.select || '',
            language: req.query.language || defaultLanguage.slug
        };


        const findLanguageBySlug = await Language.findOne({
            slug: payload.language
        }).lean();

        let newsList = await News.find({status: 1}).sort({_id: -1}).select(payload.select).limit(payload.limit).skip(payload.skip).lean();

        newsList = await Promise.all(
            newsList.map(async item => {
                let newsTranslate = await NewsTranslate.findOne({
                    [this.Model.news.ref]: item._id,
                    [this.Model.language.ref]: findLanguageBySlug._id
                })
                    .select(payload.select ? payload.select : "-news -__v -language").lean();
                return {...item, ...newsTranslate || {}};
            })
        );

        newsList = newsList.filter(item => item.title);

        const count = await News.countDocuments({status: 1});
        const pagination = {
            total: count,
            limit: payload.limit,
            page: payload.page,
            pages: Math.ceil(count / payload.limit)
        }
        return {newsList, pagination, language: findLanguageBySlug._id};
    }

    async getOneNewsForFront(req) {
        const defaultLanguage = await getDefaultLanguageHelper();

        const payload = {
            slug: req.params.slug,
            language: req.query.language || defaultLanguage.slug
        }

        if (!payload.slug) {
            throw BaseError.BadRequest('Slug is required');
        }

        const findNewsBySlug = await News.findOne({slug: payload.slug}).lean();

        if (!findNewsBySlug) {
            throw BaseError.NotFound('News not found');
        }

        const findLanguageBySlug = await Language.findOne({
            slug: payload.language
        }).lean();

        const oneNewsTranslate = await NewsTranslate.findOne({
            [this.Model.news.ref]: findNewsBySlug._id,
            [this.Model.language.ref]: findLanguageBySlug._id
        }).select(payload.select ? payload.select : "-news -__v -language").lean();

        return {...findNewsBySlug, ...oneNewsTranslate || {}};
    }
}

module.exports = NewsService;