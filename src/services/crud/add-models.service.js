const mongoose = require("mongoose");
const BaseError = require("../../errors/base.error");
const { Model } = require("../../common/constants/models.constants");
const { getModelsHelper } = require("../../helpers/get-models.helper");
const { addTranslations } = require("../../helpers/translate.helper");
const populateModelData = require("../../helpers/populate.helper");
const fs = require("fs");
const { log } = require("console");

class AddModelsService {
  constructor() {
    this.Model = Model;
  }

  async addModel(modelName, modelData) {
    const dynamicModel = getModelsHelper(modelName);

    let newData;

    if (!modelData.modelId) {
      const isSlugExists = await dynamicModel
        .findOne({ slug: modelData.slug })
        .lean();

      if (isSlugExists) {
        throw BaseError.BadRequest("Slug already exists");
      }

      const isLanguageExists = await dynamicModel.find().lean();

      if (modelName.trim() === "language") {
        if (!isLanguageExists.length) {
          newData = await this.addingModelData(dynamicModel, modelData, true);
          return newData;
        }
        newData = await this.addingModelData(dynamicModel, modelData);
        return newData;
      }

      if (modelName.trim() === "level") {
        newData = await this.addingModelData(dynamicModel, modelData, true);
        return newData;
      }

      newData = await this.addingModelData(dynamicModel, modelData);
      console.log(newData);

      if (this.Model[modelName].populate) {
        newData = await populateModelData(
          dynamicModel,
          newData._id,
          this.Model[modelName].populate
        );
      }

      if (this.Model[modelName].translate) {
        console.log("adding translates");
        newData.translates = [
          await addTranslations(modelName, newData._id, modelData.translate),
        ];
      }

      return newData;
    }

    if (!mongoose.Types.ObjectId.isValid(modelData.modelId)) {
      throw BaseError.BadRequest("Invalid modelId");
    }

    const existingModel = await dynamicModel.findById(modelData.modelId);

    if (!existingModel) {
      throw BaseError.NotFound("Model doesn't exist");
    }

    newData = existingModel.toObject();

    if (this.Model[modelName].populate) {
      newData = await populateModelData(
        dynamicModel,
        modelData.modelId,
        this.Model[modelName].populate
      );
    }

    if (this.Model[modelName].translate) {
      newData.translates = [
        await addTranslations(
          modelName,
          modelData.modelId,
          modelData.translate
        ),
      ];
    }

    return newData;
  }

  async addingModelData(dynamicModel, modelData, isDefault = false) {
    try {
      if (modelData.img && !Array.isArray(modelData.img)) {
        if (fs.existsSync(modelData.img)) {
          modelData.img = [modelData.img];
        } else {
          throw BaseError.BadRequest("Image doesn't exist");
        }
      }

      if (Array.isArray(modelData.img) && modelData.img.length) {
        for (const imgPath of modelData.img) {
          if (!fs.existsSync(imgPath)) {
            throw BaseError.BadRequest(`Image doesn't exist: ${imgPath}`);
          }
        }
      }

      const savedDocument = new dynamicModel({
        ...modelData,
        ...(typeof isDefault !== "undefined" && { isDefault }),
        img: modelData.img || [],
      });

      await savedDocument.save();
      const savedDocumentObject = savedDocument.toObject();
      delete savedDocumentObject.updatedAt;
      delete savedDocumentObject.__v;

      return savedDocumentObject;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AddModelsService;
