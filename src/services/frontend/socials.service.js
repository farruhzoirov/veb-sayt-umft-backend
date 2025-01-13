const getDefaultLanguageHelper = require("../../helpers/frontend/get-default-language.helper");
const Language = require("../../models/settings/language.model");

const Social = require("../../models/socials/socials.model");
const SocialsTranslate = require("../../models/translate/socials.model");
const {Model} = require("../../common/constants/models.constants");
const BaseError = require("../../errors/base.error");


class SocialsService {
    constructor() {
        this.Model = Model
    }
    async getSocialsForFront(req) {
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

        let socialsList = await Social.find({status: 1}).sort({_id: -1}).select(payload.select).limit(payload.limit).skip(payload.skip).lean();
        socialsList = await Promise.all(
            socialsList.map(async item => {
                let newsTranslate = await SocialsTranslate.findOne({
                    [this.Model.social.ref]: item._id,
                    [this.Model.language.ref]: findLanguageBySlug._id
                })
                    .select(payload.select ? payload.select : "-social -__v -language").lean();
                return {...item, ...newsTranslate || {}};
            })
        );
        // Getting only there is a title
        socialsList = socialsList.filter(item => item.title);

        const count = await Social.countDocuments({status: 1});

        const pagination = {
            total: count,
            limit: payload.limit,
            page: payload.page,
            pages: Math.ceil(count / payload.limit)
        }
        return {socialsList, pagination, language: findLanguageBySlug._id};
    }



    async getOneSocialForFront(req) {
        const defaultLanguage = await getDefaultLanguageHelper();

        const payload = {
            slug: req.params.slug,
            language: req.query.language || defaultLanguage.slug
        }

        if (!payload.slug) {
            throw BaseError.BadRequest('Slug is required');
        }

        const findSocialBySlug = await Social.findOne({slug: payload.slug}).lean();

        if (!findSocialBySlug) {
            throw BaseError.NotFound('News not found');
        }

        const findLanguageBySlug = await Language.findOne({
            slug: payload.language
        }).lean();

        const oneSocialTranslate = await SocialsTranslate.findOne({
            [this.Model.social.ref]: findSocialBySlug._id,
            [this.Model.language.ref]: findLanguageBySlug._id
        }).select(payload.select ? payload.select : "-social -__v -language").lean();

        return {...findSocialBySlug, ...oneSocialTranslate || {}};
    }
}

module.exports = SocialsService;