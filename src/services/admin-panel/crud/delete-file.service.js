const deleteFilesHelper = require('../../../helpers/admin-panel/delete-files.helper');
const { Model } = require("../../../common/constants/models.constants");
const { getModelsHelper } = require("../../../helpers/admin-panel/get-models.helper");
const mongoose = require("mongoose");

class deleteFileService {
    constructor() {
        this.Model = Model;
    }

    async deleteFile(req) {
        const modelId = req.body.modelId || '';
        const filePath = req.body.filePath;
        const modelName = req.body.modelName;

        if (!filePath || !modelName) {
            throw new Error('File path and model name are required.');
        }

        await deleteFilesHelper(filePath);

        if (modelId && mongoose.Types.ObjectId.isValid(modelId) && this.Model.hasOwnProperty(modelName)) {
            const dynamicModel = await getModelsHelper(modelName);
            const findModelById = await dynamicModel.findById(modelId);

            if (!findModelById) {
                throw new Error(`Model with ID ${modelId} not found.`);
            }

            let updatedImg = findModelById.img;

            if (Array.isArray(updatedImg)) {
                updatedImg = updatedImg.filter(imgPath => imgPath !== filePath);
            }
            findModelById.img = updatedImg;
            await findModelById.save();
        }
    }
}

module.exports = deleteFileService;
