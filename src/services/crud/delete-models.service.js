const mongoose = require("mongoose");
const {getModelsHelper, getModelsTranslateHelper} = require("../../helpers/get-models.helper");
const {Model, TranslateModel} = require("../../common/constants/models.constants");
const BaseError = require("../../errors/base.error");

const deleteFilesHelper = require("../../helpers/delete-files.helper");

class DeleteModelsService {
    constructor() {
        this.Model = Model
        this.TranslateModel = TranslateModel
    }

    async deleteModel(modelId, modelName) {
        const dynamicModel = getModelsHelper(modelName)
        if (!mongoose.Types.ObjectId.isValid(modelId)) {
            throw BaseError.BadRequest('Invalid modelId');
        }
        const data = await dynamicModel.findById(modelId);
        if (!data) {
            throw BaseError.NotFound("Model doesn't exist");
        }
        if (data.img && Array.isArray(data.img)) {
            await deleteFilesHelper(data.img);
        } else if (data.file && Array.isArray(data.file)) {
            await deleteFilesHelper(data.file);
        } else {
            throw BaseError.BadRequest('No images found to delete for model:', modelId);
        }
        await dynamicModel.findByIdAndDelete(modelId);
        if (this.Model[modelName].translate) {
            let transModel = this.TranslateModel[modelName].ref;
            const dynamicTranslateModel = getModelsTranslateHelper(transModel)
            await dynamicTranslateModel.deleteMany({[modelName]: modelId});
        }
    }
}

module.exports = DeleteModelsService;