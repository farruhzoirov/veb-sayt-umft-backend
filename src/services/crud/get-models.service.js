const { getModelsHelper, getModelsTranslateHelper, getModel } = require("../../helpers/get-models.helper");
const { Model, TranslateModel } = require("../../common/constants/models.constants");
const { populateGet } = require("../../helpers/get-populates.helper");
const { buildTextSearchQuery, buildQuery} = require("../../helpers/filter.helper");

class GetModelsService {
    constructor() {
        this.Model = Model;
        this.TranslateModel = TranslateModel;
    }
    async getAll(req, res) {
        const model = await getModel(req);
        if (!model) {
            return res.status(404).send({
                message: "Model not found"
            });
        }
        const dynamicModel = getModelsHelper(model);
        let page = req.query.page || 1;
        let limit = req.query.limit || 20;
        let select = req.query.select || [];
        let sort = (req.query.sort) ? JSON.parse(req.query.sort) : {
            _id: -1
        }
        let search = req.query.search;
        let searchField = req.query.searchField;
        const skip = (page - 1) * limit;
        const query = buildQuery(model, { ...req.query, search, searchField });
        const populateOptions = this.Model[model].populate || [];
        if (this.Model[model].translate) {
            return this.getAllWithTranslate(model, page, query, select, skip, limit, sort, populateOptions, res);
        } else {
            return this.getAllWithoutTranslate(dynamicModel, page, query, select, skip, limit, sort, populateOptions, res);
        }
    }

    async getAllWithTranslate(model, page, query, select, skip, limit, sort, populateOptions, res) {
        const transModel = this.TranslateModel[model].ref;
        const dynamicTranslateModel = getModelsTranslateHelper(transModel);
        const dynamicModel = getModelsHelper(model);
        const matchingTranslates = await dynamicTranslateModel.find(query).lean();
        const matchingIds = matchingTranslates.map(t => t[model]);
        const data = await dynamicModel
            .find({ _id: { $in: matchingIds } })
            .select(select.toString())
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .lean() || [];
        const populatedData = await Promise.all(data.map(async el => {
            await Promise.all(populateOptions.map(async elem => {
                el[elem] = await populateGet(elem, el[elem]);
            }));
            el.translates = await dynamicTranslateModel.find({ [model]: el._id }).select(select.length ? select : []).lean();
            return el;
        }));
        const count = await dynamicModel.countDocuments({ _id: { $in: matchingIds }, ...query });
        return res.json({
            data: populatedData,
            count,
            page: Number(page),
            limit: Number(limit)
        });
    }

    async getAllWithoutTranslate(dynamicModel, page, query, select, skip, limit, sort, populateOptions, res) {
        const data = await dynamicModel
            .find(query)
            .select(select.toString())
            .populate(populateOptions)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .lean() || [];
        const count = await dynamicModel.countDocuments(query);
        return res.json({
            data,
            count,
            page: Number(page),
            limit: Number(limit)
        });
    }
}

module.exports = GetModelsService;