const mongoose = require("mongoose");
const BaseError = require('../../errors/base.error');
const {Model} = require("../../common/constants/models.constants");
const {getModelsHelper} = require("../../helpers/get-models.helper");
const {addTranslations} = require("../../helpers/translate.helper");
const populateModelData = require("../../helpers/populate.helper");

class AddModelsService {
  constructor() {
    this.Model = Model
  }

  async addModel(modelName, modelData) {
    const dynamicModel = getModelsHelper(modelName);

    const isSlugExists = await dynamicModel.findOne({slug: modelData.slug}).lean();

    if (isSlugExists) {
      throw BaseError.BadRequest('Slug already exists');
    }

    let newData;

    if (!modelData.modelId) {
      const languageExists = await dynamicModel.findOne();

      if (modelName.trim() === 'language' && !modelData.isDefault) {
        if (!languageExists.length) {
          newData = await this.addingModelData(dynamicModel, modelData, true);
          return newData;
        }
        const isDefaultLanguageExists = await dynamicModel.findOne({isDefault: true}).lean();
        if (isDefaultLanguageExists && modelData.isDefault) {
          throw BaseError.BadRequest('Default language already exists.');
        }
        newData = await this.addingModelData(dynamicModel, modelData);
        return newData;
      }

      if (modelName.trim() === 'language' && !languageExists.length && modelData.isDefault) {
        newData = await this.addingModelData(dynamicModel, modelData, true);
        return newData;
      }

      newData = await this.addingModelData(dynamicModel, modelData);

      if (this.Model[modelName].translate) {
        newData.translates = [await addTranslations(modelName, newData._id, modelData.translate)];
      }

      if (this.Model[modelName].populate) {
        newData = await populateModelData(dynamicModel, newData._id, this.Model[modelName].populate);
      }

      return newData;
    }

    if (!mongoose.Types.ObjectId.isValid(modelData.modelId)) {
      throw BaseError.BadRequest('Invalid modelId');
    }

    const existingModel = await dynamicModel.findById(modelData.modelId);

    if (!existingModel) {
      throw BaseError.NotFound("Model doesn't exist");
    }
    newData = existingModel;

    if (this.Model[modelName].translate) {
      newData.translates = [await addTranslations(modelName, modelData.modelId, modelData.translate)];
    }

    if (this.Model[modelName].populate) {
      newData = await populateModelData(modelName, modelData.modelId, this.Model[modelName].populate);
    }

    return newData;
  }

  async addingModelData(dynamicModel, modelData, isDefault = false) {
    const savedDocument = await new dynamicModel({
      ...modelData,
      isDefault: isDefault,
      img: modelData.img ? [modelData.img] : [],
    }).save();
    return savedDocument.toObject();
  }
}

module.exports = AddModelsService;

