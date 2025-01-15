const {Model, TranslateModel} = require("../../common/constants/models.constants")
const mongoose = require("mongoose");
const {getModelsTranslateHelper, getModelsHelper} = require("./get-models.helper");
const BaseError = require("../../errors/base.error");

async function getPopulates(model, _id, language) {
    let modelForPopulate = Model[model].ref
    const dynamicModel = getModelsHelper(modelForPopulate);
    let data = [];
    if (Array.isArray(_id)) {
        for (const id of _id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw BaseError.BadRequest("Model id is not valid. in getting populates");
            }
            const newData = await dynamicModel.findById(id).select("-__v -createdAt -updatedAt").lean() || {};

            if (Model[model].translate) {
                let transModel = TranslateModel[model].ref
                const dynamicTranslateModel = getModelsTranslateHelper(transModel)
                newData.translates = await dynamicTranslateModel.find({[model]: [id]}).select("-__v -createdAt -updatedAt").lean()
            }
            data.push(newData);
        }

        return data
    }

    data = await dynamicModel.findById(_id).select("-__v -createdAt -updatedAt -status").lean() || {}
    if (Model[model].translate) {
        let transModel = TranslateModel[model].ref
        const dynamicTranslateModel = getModelsTranslateHelper(transModel);

        if (language) {
            const modelTranslateByLanguage = await dynamicTranslateModel.findOne({
                [model]: _id,
                "language": language._id
            }).select(`-__v -createdAt -updatedAt -status -language`).lean();
            return {...data, ...modelTranslateByLanguage || {}}
        }

        data.translates = await dynamicTranslateModel.find({
            [model]: _id,
        }).select("-__v").lean();
        return data
    }
}

module.exports = {
    getPopulates
}