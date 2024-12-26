const mongoose = require("mongoose");

const {Model} = require("../../common/constants/models.constants");

const {updateTranslations} = require("../../helpers/translate.helper");

const {getModelsHelper} = require("../../helpers/get-models.helper");

const BaseError = require("../../errors/base.error");

const populateModelData = require("../../helpers/populate.helper");


class UpdateModelsService {
  constructor() {
    this.Model = Model;
  }

  async updateModel(modelName, modelId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      throw BaseError.BadRequest('Invalid modelId');
    }
    let newData;
    const dynamicModel = getModelsHelper(modelName);
    const existingModel = await dynamicModel.findById(modelId);

    if (!existingModel) {
      throw BaseError.BadRequest("Model doesn't exist");
    }

    if (modelName.trim() === 'language' && updateData.isDefault) {
      const isDefaultLanguageExists = await dynamicModel.find({isDefault: true});
      if (isDefaultLanguageExists.length) {
        for (const element of isDefaultLanguageExists) {
          element.isDefault = false;
          await element.save();
        }
      }
    }
    newData = await dynamicModel.findOneAndUpdate({
        _id: modelId
      },
      {
        $set: updateData
      },
      {
        new: true
      }
    );
    newData = newData.toObject();
    delete newData.__v;
    // Update translations
    if (this.Model[modelName].populate) {
      newData = await populateModelData(dynamicModel, modelId, this.Model[modelName].populate);
    }

    if (updateData.translate) {
      const translations = await updateTranslations(modelName, modelId, updateData.translate);
      newData.translates = translations;
  
    }
    return newData;
  }
}


module.exports = UpdateModelsService;