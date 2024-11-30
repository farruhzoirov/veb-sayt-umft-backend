const mongoose = require("mongoose");
const { getModelsHelper, getModelsTranslateHelper, getModel } = require("../../helpers/get-models.helper");

const { Model, TranslateModel } = require("../../common/constants/models.constants");
const { populateGet } = require("../../helpers/get-populates.helper");

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
                message: "Model not found"
            });
        }
        let language = req.query.language
        const dynamicModel = getModelsHelper(model);
        const _id = req.params.id || null
        let select = req.query.select || [];
        const populateOptions = this.Model[model].populate || [];
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(500).json({
                ok: false,
                message: 'id is not valid'
            });
        }
        const data = await dynamicModel.findById(_id).select(select).lean() || {}
        if (this.Model[model].translate) {
            let transModel = this.TranslateModel[model].ref
            const dynamicTranslateModel = getModelsTranslateHelper(transModel);
            await Promise.all([data].map(async el => {
                await Promise.all(populateOptions.map(async elem => {
                    el[elem] = await populateGet(elem, el[elem]);
                }));
                el.translates = await dynamicTranslateModel.findOne({ [model]: el._id, language }).select(select.length ? select : "name description language").lean();
                return el;
            }));
        }

        return res.status(200).json(
            data
        );
    }
}



module.exports = GetModelService;