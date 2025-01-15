const Messenger = require("../../models/data/messenger.model");
const Social = require("../../models/socials/socials.model");
const SocialTranslate = require("../../models/translate/socials.model");
const BaseError = require("../../errors/base.error");
const {getPopulates} = require("../../helpers/admin-panel/get-populates.helper");
const {Model, TranslateModel} = require("../../common/constants/models.constants");
const getDefaultLanguageHelper = require("../../helpers/frontend/get-default-language.helper");
const Language = require("../../models/settings/language.model");
const {getModelsTranslateHelper} = require("../../helpers/admin-panel/get-models.helper");

class SocialService {
    constructor() {
        this.Model = Model
        this.TranslateModel = TranslateModel
    }

    async getSocialsForFront(req) {
        const {slugs} = req.body;
        const defaultLanguage = await getDefaultLanguageHelper();
        const queryParameters = {
            selectFields: req.query.select || '',
            requestedLanguage: req.query.language || defaultLanguage.slug
        }

        if (!Array.isArray(slugs) || slugs.length === 0) {
            throw BaseError.BadRequest("Slug must be an non-empty array");
        }

        const selectedLanguage = await Language.findOne({
            slug: queryParameters.requestedLanguage,
        }).lean();

        if (!selectedLanguage) {
            throw BaseError.BadRequest("Language doesn't exists which matches to this slug");
        }

        console.log(slugs);
        const messengers = await Messenger.find({slug: { $in: slugs }}, "_id");

        if (!messengers.length) {
            return []
        }

        const messengerIds = messengers.map((messenger) => messenger._id);

        let socials = await Social.find({messenger: {$in: messengerIds}}).select("-__v -createdAt -updatedAt");

        const populateOptions = this.Model.social.populate || []
        const SocialTranslate = getModelsTranslateHelper(this.TranslateModel.social.ref);
        socials = await Promise.all(
            socials.map(async socialItem => {
                const translationData = await SocialTranslate.findOne({
                    [this.Model.social.ref]: socialItem._id,
                    [this.Model.language.ref]: selectedLanguage._id,
                })
                    .select(queryParameters.selectFields ? queryParameters.selectFields : `-${this.Model.social.ref} -__v -language -createdAt -updatedAt`)
                    .lean();

                await Promise.all(
                    populateOptions.map(async (item) => {
                        socialItem[item] = await getPopulates(item, socialItem[item], selectedLanguage);
                    })
                );
                return {...socialItem, ...translationData || {}};
            })
        );
        return {data: socials};
    }
}

module.exports = SocialService