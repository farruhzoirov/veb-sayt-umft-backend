const {getModelsHelper, getModelsTranslateHelper, getModel} = require("../../helpers/get-models.helper");
const {Model, TranslateModel} = require("../../common/constants/models.constants");
const {getPopulates} = require("../../helpers/get-populates.helper");
const {buildQuery} = require("../../helpers/filter.helper");

class GetModelsService {
  constructor() {
    this.Model = Model;
    this.TranslateModel = TranslateModel;
  }

  async getAll(req, res, model) {
    const dynamicModel = getModelsHelper(model);

    let page = req.query.page || 1;
    let limit = req.query.limit || 20;
    let select = req.query.select || [];
    let sort = (req.query.sort) ? JSON.parse(req.query.sort) : {_id: -1};
    let search = req.query.search;

    const skip = (page - 1) * limit;

    const query = buildQuery(model, search);
    const populateOptions = this.Model[model].populate || [];

    if (this.Model[model].translate) {
      return this.getAllWithTranslate(model, page, query, select, skip, limit, sort, populateOptions, res);
    } else {
      return this.getAllWithoutTranslate(dynamicModel, page, query, select, skip, limit, sort, populateOptions, res);
    }
  }

  async getAllWithTranslate(model, page, query, select, skip, limit, sort, populateOptions, res) {
    const translateModel = this.TranslateModel[model].ref;

    const dynamicTranslateModel = getModelsTranslateHelper(translateModel);
    const dynamicModel = getModelsHelper(model);

    //const matchingTranslates = await dynamicTranslateModel.find(query);
    //const matchingIds = await matchingTranslates.map((t) => t[model]);
    const matchingIds = await dynamicTranslateModel.distinct(model, query);

    const modelDatas = await dynamicModel
      .find({_id: {$in: matchingIds}})
      .select(select.toString() + " -createdAt -updatedAt -__v")
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean() || [];

    const populatedData = await Promise.all(modelDatas.map(async data => {
      await Promise.all(populateOptions.map(async elem => {
        data[elem] = await getPopulates(elem, data[elem]);
      }));
      data.translates = await dynamicTranslateModel.find({
        [model]: data._id
      })
        .select(select.length ? select + " -createdAt -updatedAt -__v" : [] + " -createdAt -updatedAt -__v")
        .lean();
      return data;
    }));
    const count = modelDatas.length;
    return res.json({
      data: populatedData,
      count,
      page: Number(page),
      limit: Number(limit)
    });
  }

  async getAllWithoutTranslate(dynamicModel, page, query, select, skip, limit, sort, populateOptions, res) {
    const modelData = await dynamicModel
      .find(query)
      .select(select.toString())
      .populate(populateOptions)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean() || [];

    const count = await dynamicModel.countDocuments();
    return res.json({
      modelData,
      count,
      page: Number(page),
      limit: Number(limit)
    });
  }
}

module.exports = GetModelsService;