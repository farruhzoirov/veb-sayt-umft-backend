const mongoose = require("mongoose");
const {
    getModelsHelper,
    getModelsTranslateHelper,
    getModel,
} = require("../../../helpers/admin-panel/get-models.helper");

const {Model, TranslateModel} = require("../../../common/constants/models.constants");
const {getPopulates} = require("../../../helpers/admin-panel/get-populates.helper");
const BaseError = require("../../../errors/base.error");

class GetModelService {
    constructor() {
        this.Model = Model;
        this.TranslateModel = TranslateModel;
    }

    async getModelById(req, res) {
        const model = await getModel(req);
        if (!model) {
            return res.status(404).json({
                ok: false,
                message: "Model not found",
            });
        }
        const dynamicModel = getModelsHelper(model);
        const _id = req.params.id || null;
        if (!_id) {
            throw BaseError.BadRequest("Id is required");
        }
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(500).json({
                ok: false,
                message: "id is not valid",
            });
        }
        const populateOptions = this.Model[model].populate || [];
        const data =
            (await dynamicModel.findById(_id).select("-updatedAt -__v").lean()) || {};
        if (!Object.keys(data).length) {
            throw BaseError.NotFound("model not found");
        }

        if (this.Model[model].translate) {
            let transModel = this.TranslateModel[model].ref;
            const dynamicTranslateModel = getModelsTranslateHelper(transModel);
            await Promise.all(
                [data].map(async (el) => {
                    await Promise.all(
                        populateOptions.map(async (elem) => {
                            el[elem] = await getPopulates(elem, el[elem]);
                        })
                    );
                    if (el.prices && Array.isArray(el.prices)) {
                        for (const price of data.prices) {
                            if (price.format) {
                                price.format = await getPopulates('format', price.format);
                            }
                        }
                    }

                    if (model === this.Model.employee.ref) {
                        for (const socialLink of data.socialLinks) {
                            socialLink.messenger = await getPopulates("messenger", socialLink.messenger);
                        }
                    }

                    el.translates = await dynamicTranslateModel.find({[model]: el._id,})
                        .select("-updatedAt -__v")
                        .lean();
                })
            );
        }
        return res.status(200).json(data);
    }
}

module.exports = GetModelService;
