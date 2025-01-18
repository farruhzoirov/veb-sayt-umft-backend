const {Model} = require("../../../common/constants/models.constants");
const {getModelsHelper} = require("../../../helpers/admin-panel/get-models.helper");
const BaseError = require("../../../errors/base.error");
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
      throw BaseError.BadRequest(`${modelName} not found with this id:  ${modelId}`);
    }

    return patchData.toObject();
  }
}

module.exports = patchModelService;