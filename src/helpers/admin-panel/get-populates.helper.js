  const {Model, TranslateModel} = require("../../common/constants/models.constants");
const mongoose = require("mongoose");
const {getModelsTranslateHelper, getModelsHelper} = require("./get-models.helper");
const BaseError = require("../../errors/base.error");

async function getPopulates(model, _id, language) {
  try {
    const modelInfo = Model[model];
    if (!modelInfo) throw BaseError.BadRequest("Invalid model type.");

    const dynamicModel = getModelsHelper(modelInfo.ref);
    const isArray = Array.isArray(_id);

    // Validate IDs
    const ids = isArray ? _id : [_id];
    // ids.forEach(id => {
    //   if (!mongoose.Types.ObjectId.isValid(id)) {
    //     throw BaseError.BadRequest("Invalid model ID in getting populates.");
    //   }
    // });

    // Fetch data
    const fetchData = async (id) => {
      const data = await dynamicModel.findById(id).select("-__v -createdAt -updatedAt").lean() || {};

      if (modelInfo.translate) {
        const translateModel = TranslateModel[model].ref;
        const dynamicTranslateModel = getModelsTranslateHelper(translateModel);

        if (language) {
          const translation = await dynamicTranslateModel.findOne({
            [model]: id,
            language: language._id
          }).select("-__v -createdAt -updatedAt -status -language -_id").lean();
          return {...data, ...translation};
        } else {
          data.translates = await dynamicTranslateModel.find({[model]: id}).select("-__v").lean();
        }
      }
      return data;
    };

    if (isArray) {
      return await Promise.all(ids.map(fetchData));
    } else {
      return await fetchData(_id);
    }

  } catch (error) {
    console.error("Error in getPopulates:", error.message);
    throw error;
  }
}

module.exports = {
  getPopulates
};
