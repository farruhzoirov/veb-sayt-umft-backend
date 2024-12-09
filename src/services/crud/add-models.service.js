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

    let newData;

    if (!modelData.modelId) {
      const isSlugExists = await dynamicModel.findOne({slug: modelData.slug}).lean();

      if (isSlugExists) {
        throw BaseError.BadRequest('Slug already exists');
      }

      const isLanguageExists = await dynamicModel.find().lean();

      if (modelName.trim() === 'language') {
        if (!isLanguageExists.length) {
          newData = await this.addingModelData(dynamicModel, modelData, true);
          return newData;
        }
        newData = await this.addingModelData(dynamicModel, modelData);
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

    newData = existingModel.toObject();

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
      ...(typeof isDefault !== 'undefined' && {isDefault}),
      img: modelData.img ? [modelData.img] : [],
    });
    await savedDocument.save();
    const savedDocumentObject = savedDocument.toObject();
    delete savedDocumentObject.createdAt;
    delete savedDocumentObject.updatedAt;
    delete savedDocumentObject.__v;
    return savedDocumentObject;
  }
}

module.exports = AddModelsService;

