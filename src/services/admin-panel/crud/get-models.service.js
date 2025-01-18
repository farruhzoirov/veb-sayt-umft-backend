const {
  getModelsHelper,
  getModelsTranslateHelper,
  getModel,
} = require("../../../helpers/admin-panel/get-models.helper");
const {
  Model,
  TranslateModel,
} = require("../../../common/constants/models.constants");
const {getPopulates} = require("../../../helpers/admin-panel/get-populates.helper");
const {buildQuery} = require("../../../helpers/admin-panel/filter.helper");

class GetModelsService {
  constructor() {
    this.Model = Model;
    this.TranslateModel = TranslateModel;
  }

  async getAll(req, res, modelName) {
    const dynamicModel = getModelsHelper(modelName);

    let page = req.query.page || 1;
    let limit = req.query.limit || 20;
    let select = req.query.select || [];
    let sort = req.query.sort ? JSON.parse(req.query.sort) : {_id: -1};
    let search = req.query.search;

    const skip = (page - 1) * limit;

    const query = buildQuery(modelName, search);
    const populateOptions = this.Model[modelName].populate || [];
    if (this.Model[modelName].translate) {
      return this.getAllWithTranslate(modelName, page, query, select, skip, limit, sort, populateOptions, res);
    } else {
      return this.getAllWithoutTranslate(dynamicModel, page, query, select, skip, limit, sort, populateOptions, res);
    }
  }

  async getAllWithTranslate(modelName, page, query, select, skip, limit, sort, populateOptions, res) {
    const translateModel = this.TranslateModel[modelName].ref;
    const dynamicTranslateModel = getModelsTranslateHelper(translateModel);
    const dynamicModel = getModelsHelper(modelName);

    //const matchingTranslates = await dynamicTranslateModel.find(query);
    //const matchingIds = await matchingTranslates.map((t) => t[model]);
    const matchingIds = await dynamicTranslateModel.distinct(modelName, query);
    const modelDatas = await dynamicModel
        .find({_id: {$in: matchingIds}})
        .select(select.toString() + "-updatedAt -__v")
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .lean() || [];

    const populatedData = await Promise.all(
        modelDatas.map(async (data) => {
          await Promise.all(
              populateOptions.map(async (elem) => {
                data[elem] = await getPopulates(elem, data[elem]);
              })
          );

          if (data.prices && Array.isArray(data.prices)) {
            for (const price of data.prices) {
              if (price.format) {
                price.format = await getPopulates('format', price.format);
              }
            }
          }
          if (modelName === this.Model.employee.ref) {
            for (const socialLink of data.socialLinks) {
              socialLink.messenger = await getPopulates("messenger", socialLink.messenger);
            }
          }
          data.translates = await dynamicTranslateModel
              .find({
                [modelName]: data._id,
              })
              .select(select.length ? select + "-updatedAt -__v" : [] + "-updatedAt -__v")
              .lean();
          return data;
        })
    );

    const count = await dynamicModel.countDocuments();
    return res.json({
      data: populatedData,
      count,
      page: Number(page),
      limit: Number(limit),
    });
  }

  async getAllWithoutTranslate(dynamicModel, page, query, select, skip, limit, sort, populateOptions, res) {
    const modelData = await dynamicModel.find(query).select(select.toString()).skip(skip).limit(limit).sort(sort).lean() || [];

    const populatedData = await Promise.all(
        modelData.map(async (data) => {
          await Promise.all(
              populateOptions.map(async (elem) => {
                data[elem] = await getPopulates(elem, data[elem]);
              })
          );
          return data;
        })
    );
    const count = await dynamicModel.countDocuments();
    return res.json({
      modelData: populatedData,
      count,
      page: Number(page),
      limit: Number(limit),
    });
  }
}

module.exports = GetModelsService;
