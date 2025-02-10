const mongoose = require("mongoose");
const BaseError = require("../../../errors/base.error");
const {Model} = require("../../../common/constants/models.constants");
const {getModelsHelper} = require("../../../helpers/admin-panel/get-models.helper");
const {addTranslations} = require("../../../helpers/admin-panel/translate.helper");
const populateModelData = require("../../../helpers/admin-panel/populate.helper");
const fs = require("fs");
const generateUniqueSlug = require("../../../helpers/admin-panel/unique-slug.helper");

class AddModelsService {
  constructor() {
    this.Model = Model;
  }

  async addModel(modelName, modelData) {
    const dynamicModel = getModelsHelper(modelName);

    if (!modelData.modelId) {
      if (modelData?.slug) {
        await this.checkSlugExists(dynamicModel, modelData.slug);
      }
      return await this.handleNewModel(dynamicModel, modelName, modelData);
    }

    return await this.handleExistingModel(dynamicModel, modelName, modelData);
  }

  async checkSlugExists(dynamicModel, slug) {
    const isSlugExists = await dynamicModel.findOne({slug}).lean();
    if (isSlugExists) {
      throw BaseError.BadRequest("Slug already exists");
    }
  }

  async handleNewModel(dynamicModel, modelName, modelData) {
    const isLanguageExists = await dynamicModel.find().lean();
    const isDefault = modelName.trim() === "language" && !isLanguageExists.length;

    let newData = await this.addingModelData(dynamicModel, modelData, modelName, isDefault);

    if (this.Model[modelName].populate) {
      newData = await populateModelData(dynamicModel, newData._id, this.Model[modelName].populate);
    }

    if (this.Model[modelName].translate) {
      newData.translates = [await addTranslations(modelName, newData._id, modelData.translate)];
    }

    return newData;
  }

  async handleExistingModel(dynamicModel, modelName, modelData) {
    if (!mongoose.Types.ObjectId.isValid(modelData.modelId)) {
      throw BaseError.BadRequest("Invalid modelId");
    }

    const existingModel = await dynamicModel.findById(modelData.modelId);

    if (!existingModel) {
      throw BaseError.NotFound("Model doesn't exist");
    }

    let newData = existingModel.toObject();

    if (this.Model[modelName].populate) {
      newData = await populateModelData(dynamicModel, modelData.modelId, this.Model[modelName].populate);
    }

    if (this.Model[modelName].translate) {
      newData.translates = [await addTranslations(modelName, modelData.modelId, modelData.translate)];
    }

    return newData;
  }

  async addingModelData(dynamicModel, modelData, modelName, isDefault = false) {
    modelData.img = await this.validateAndFormatImages(modelData.img);

    if (typeof isDefault !== "undefined") {
      modelData.isDefault = isDefault;
    }

    if (modelName === this.Model.employee.ref && !modelData.slug) {
      modelData.slug = generateUniqueSlug(`${modelData.firstName}`,  `${modelData.surName}`, `${modelData.lastName}`);
    }

    const savedDocument = new dynamicModel({...modelData, img: modelData.img || []});
    await savedDocument.save();

    const savedDocumentObject = savedDocument.toObject();
    delete savedDocumentObject.updatedAt;
    delete savedDocumentObject.__v;

    return savedDocumentObject;
  }

  async validateAndFormatImages(img) {
    if (img && !Array.isArray(img)) {
      if (fs.existsSync(img)) {
        return [img];
      } else {
        throw BaseError.BadRequest("Image doesn't exist");
      }
    }

    
    if (Array.isArray(img) && img.length) {
      for (const imgPath of img) {
        if (!fs.existsSync(imgPath)) {
          throw BaseError.BadRequest(`Image doesn't exist: ${imgPath}`);
        }
      }
    }
    return img;
  }
}

module.exports = AddModelsService;