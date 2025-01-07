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
        this.validateObjectId(modelId);

        const dynamicModel = getModelsHelper(modelName);
        const existingModel = await this.findModelById(dynamicModel, modelId);

        if (modelName.trim() === "language") {
            await this.handleDefaultLanguage(dynamicModel, updateData.isDefault);
        }

        if (modelName.trim() === "specialty") {
            this.validateSpecialtyPrices(existingModel.prices, updateData.prices);
        }

        let updatedModel = await this.updateModelHelper(dynamicModel, modelId, updateData);

        updatedModel = await this.prepareFinalModelData(
            updatedModel,
            modelName,
            modelId,
            updateData
        );

        return updatedModel;
    }

    validateObjectId(modelId) {
        if (!mongoose.Types.ObjectId.isValid(modelId)) {
            throw BaseError.BadRequest("Invalid modelId");
        }
    }

    async findModelById(dynamicModel, modelId) {
        const model = await dynamicModel.findById(modelId);
        if (!model) {
            throw BaseError.BadRequest("Model doesn't exist");
        }
        return model;
    }

    async handleDefaultLanguage(dynamicModel, isDefault) {
        if (!isDefault) return;

        const defaultLanguages = await dynamicModel.find({isDefault: true});
        if (defaultLanguages.length) {
            for (const language of defaultLanguages) {
                language.isDefault = false;
                await language.save();
            }
        }
    }

    validateSpecialtyPrices(existingPrices, newPrices) {
        for (const newPrice of newPrices) {
            const isDuplicate = existingPrices.some(
                (price) => price.format === newPrice.format
            );
            if (isDuplicate) {
                throw BaseError.BadRequest(`Price already exists for ${newPrice.format} format`);
            }
        }
    }

    async updateModelHelper(dynamicModel, modelId, updateData) {
        return dynamicModel.findOneAndUpdate(
            {_id: modelId},
            {$set: updateData},
            {new: true}
        );
    }

    async prepareFinalModelData(model, modelName, modelId, updateData) {
        let modelData = model.toObject();
        delete modelData.__v;

        if (this.Model[modelName].populate) {
            modelData = await populateModelData(
                getModelsHelper(modelName),
                modelId,
                this.Model[modelName].populate
            );
        }

        if (updateData.translate) {
            const translations = await updateTranslations(
                modelName,
                modelId,
                updateData.translate
            );
            modelData.translates = translations;
        }

        return modelData;
    }
}

module.exports = UpdateModelsService;
