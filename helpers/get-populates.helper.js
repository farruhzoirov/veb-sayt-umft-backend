const { Model, TranslateModel } = require("../common/constants/models")
const {Types} = require("mongoose");
const {getModelsTranslateHelper, getModelsHelper} = require("./get-models.helper");

async function  populateGet(model, _id) {
    console.log(model, _id)
    let modelForPopulate = Model[model].ref
    const dynamicModel = getModelsHelper(modelForPopulate)
    if (!Types.ObjectId.isValid(_id))
        return {
        message: 'id is not valid'
    }
    const data = await dynamicModel.findById(_id).select("name").lean() || {}
    if (Model[model].translate) {
        let transModel = TranslateModel[model].ref
        const dynamicTranslateModel = getModelsTranslateHelper(transModel)
        data.translates = await dynamicTranslateModel.find({[model]: _id}).select("name").lean()
    }
    return data
}

module.exports = {
    populateGet
}