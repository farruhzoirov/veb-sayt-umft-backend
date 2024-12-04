const mongoose = require("mongoose");

const BaseError = require('../../errors/base.error');
// Static Models' names
const { Model } = require("../../common/constants/models.constants");

const { getModelsHelper } = require("../../helpers/get-models.helper");

const { addTranslations } = require("../../helpers/translate.helper");
const populateModelData = require("../../helpers/populate.helper");

class AddModelsService {
    constructor() {
        this.Model = Model
    }
    async addModel(modelName, modelData) {
        const dynamicModel = getModelsHelper(modelName);
        const isSlugExists = await dynamicModel.findOne({ slug: modelData.slug });
        if (isSlugExists) {
            throw BaseError.BadRequest('Slug already exists');
        }
        let newData;
        if (!modelData.modelId) {
            if (modelName.trim() === 'language') {
                const languageExists = await dynamicModel.find();
                if (!languageExists.length) {
                    newData = await this.addingNewData(dynamicModel, modelData, true);
                    return newData;
                }
                newData = await this.addingNewData(dynamicModel, modelData, false);
                return newData;
            }
            newData = await this.addingNewData(dynamicModel, modelData, false);
            if (this.Model[modelName].translate) {
                newData.translates = await addTranslations(modelName, newData._id, modelData.translate);
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

        if (this.Model[modelName]?.translate) {
            newData.translates = await addTranslations(modelName, modelData.modelId, modelData.translate);
        }
        if (this.Model[modelName]?.populate) {
            newData = await populateModelData(modelName, modelData.modelId, this.Model[modelName].populate);
        }
        return newData;
    }

    async addingNewData(dynamicModel, modelData, isDefault) {
        return new dynamicModel({
            ...modelData,
            isDefault: !!`${isDefault}`,
            img: modelData.img ? [modelData.img] : [],
        }).save();
    }
}


module.exports = AddModelsService;

