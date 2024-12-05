const {Model} = require("../../common/constants/models.constants");
const {getModelsHelper} = require("../../helpers/get-models.helper");
const BaseError = require("../../errors/base.error");
const mongoose = require("mongoose");


class patchModelService {
    constructor() {
        this.Model = Model
    }
    async patchModel(modelName, modelId, patchModelData) {
        const dynamicModel = getModelsHelper(modelName);

        if (!mongoose.Types.ObjectId.isValid(modelId)) {
            throw BaseError.BadRequest('Invalid modelId');
        }
        const patchData = await dynamicModel.findOneAndUpdate(
            {
                _id: modelId
            }, {
                $set: {
                    status: patchModelData.status
                }
            }, {
                new: true
            }
        )
        if (!patchData) {
            throw BaseError.BadRequest(`Error in updating status for ${modelName} with ID ${modelId}`);
        }
        return patchData.toObject();
    }
}

module.exports = patchModelService;