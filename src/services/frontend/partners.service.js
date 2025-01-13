const getDefaultLanguageHelper = require("../../helpers/frontend/get-default-language.helper");
const Language = require("../../models/settings/language.model");

const Partners = require("../../models/data/partners.model");
const PartnersTranslate = require("../../models/translate/partners.model");
const {Model} = require("../../common/constants/models.constants");
const BaseError = require("../../errors/base.error");
const News = require("../../models/data/news.model");
const NewsTranslate = require("../../models/translate/news.model");

class PartnersService {
    constructor() {
        this.Model = Model
    }
     async getPartners(req) {
         const defaultLanguage = await getDefaultLanguageHelper();
         // Payload
         const payload = {
             limit: req.query.limit ? parseInt(req.query.limit, 10) : 30,
             page: req.query.page ? parseInt(req.query.page, 10) : 1,
             skip: (req.query.limit ? parseInt(req.query.limit, 10) : 10) * ((req.query.page ? parseInt(req.query.page, 10) : 1) - 1),
             select: req.query.select || '',
             language: req.query.language || defaultLanguage.slug
         };

         // if (!payload.language && this.Model.partner.translate) {
         //     const defaultLanguage = await getDefaultLanguageHelper();
         //     payload.language = defaultLanguage._id;
         // }

         const findLanguageBySlug = await Language.findOne({
             slug: payload.language
         }).lean();

         // if (payload.language && findLanguageBySlug) {
         //     payload.language = findLanguageBySlug._id;
         // }

         let partnersList = await Partners.find({status: 1}).sort({_id: -1}).select(payload.select).limit(payload.limit).skip(payload.skip).lean();
         console.log(payload.language)
         partnersList = await Promise.all(
             partnersList.map(async item => {
                 let newsTranslate = await PartnersTranslate.findOne({
                     [this.Model.partner.ref]: item._id,
                     [this.Model.language.ref]: findLanguageBySlug._id
                 })
                     .select(payload.select ? payload.select : "-partner -__v -language").lean();
                 return {...item, ...newsTranslate || {}};
             })
         );
         // Getting only there is a title
         console.log(partnersList)
         partnersList = partnersList.filter(item => item.name);

         const count = await Partners.countDocuments({status: 1});

         const pagination = {
             total: count,
             limit: payload.limit,
             page: payload.page,
             pages: Math.ceil(count / payload.limit)
         }
         return {partnersList, pagination, language: findLanguageBySlug._id};
     }



    async getOnePartnerForFront(req) {
        const defaultLanguage = await getDefaultLanguageHelper();

        const payload = {
            slug: req.params.slug,
            language: req.query.language || defaultLanguage.slug
        }

        if (!payload.slug) {
            throw BaseError.BadRequest('Slug is required');
        }

        const findPartnerBySlug = await News.findOne({slug: payload.slug}).lean();

        if (!findPartnerBySlug) {
            throw BaseError.NotFound('News not found');
        }

        const findLanguageBySlug = await Language.findOne({
            slug: payload.language
        }).lean();

        const oneNewsTranslate = await NewsTranslate.findOne({
            [this.Model.news.ref]: findPartnerBySlug._id,
            [this.Model.language.ref]: findLanguageBySlug._id
        }).select(payload.select ? payload.select : "-partner -__v -language").lean();

        return {...findPartnerBySlug, ...oneNewsTranslate || {}};
    }
}

module.exports = PartnersService;