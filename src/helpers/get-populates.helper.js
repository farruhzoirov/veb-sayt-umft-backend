const {Model, TranslateModel} = require("../common/constants/models.constants")
const mongoose = require("mongoose");
const {getModelsTranslateHelper, getModelsHelper} = require("./get-models.helper");
const BaseError = require("../errors/base.error");

async function getPopulates(model, _id) {
  let modelForPopulate = Model[model].ref
  const dynamicModel = getModelsHelper(modelForPopulate);

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw BaseError.BadRequest("Model id is not valid. in getting populates");
  }

  const data = await dynamicModel.findById(_id).select("-createdAt -updatedAt -__v").lean() || {}
  if (Model[model].translate) {
    let transModel = TranslateModel[model].ref
    const dynamicTranslateModel = getModelsTranslateHelper(transModel)
    data.translates = await dynamicTranslateModel.find({[model]: _id}).select("-createdAt -updatedAt -__v").lean()
  }
  return data
}

module.exports = {
  getPopulates
}