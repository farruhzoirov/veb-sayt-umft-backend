const mongoose = require("mongoose");
const {getModelsHelper, getModelsTranslateHelper, getModel} = require("../../helpers/get-models.helper");

const {Model, TranslateModel} = require("../../common/constants/models.constants");
const {getPopulates} = require("../../helpers/get-populates.helper");

class GetModelService {
  constructor() {
    this.Model = Model;
    this.TranslateModel = TranslateModel;
  }

  async getModelById(req, res) {
    const model = await getModel(req);
    if (!model) {
      return res.status(404).json({
        ok: false,
        message: "Model not found"
      });
    }
    const dynamicModel = getModelsHelper(model);
    const _id = req.params.id || null
    const populateOptions = this.Model[model].populate || [];
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(500).json({
        ok: false,
        message: 'id is not valid'
      });
    }
    const data = await dynamicModel.findById(_id).select("-createdAt -updatedAt -__v").lean() || {}
    if (this.Model[model].translate) {
      let transModel = this.TranslateModel[model].ref
      const dynamicTranslateModel = getModelsTranslateHelper(transModel);
      await Promise.all([data].map(async el => {
        await Promise.all(populateOptions.map(async elem => {
          el[elem] = await getPopulates(elem, el[elem]);
        }));
        el.translates = await dynamicTranslateModel.find({
          [model]: el._id
        })
          .select("-createdAt -updatedAt -__v")
          .lean();
      }));
    }
    return res.status(200).json(data);
  }
}


module.exports = GetModelService;