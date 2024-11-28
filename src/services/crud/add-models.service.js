const {Model, TranslateModel} = require("../../common/constants/models.constants");
const {
    getModelsHelper,
    getModelsTranslateHelper,
    getModel,
} = require("../../helpers/get-models.helper");

const {populateGet} = require("../../helpers/get-populates.helper");
const mongoose = require("mongoose");

class AddModelsService {
    constructor() {
        this.Model = Model
        this.TranslateModel = TranslateModel
    }

    async addModel(req, res) {
        try {
            const model = await getModel(req);
            if (!model) {
                return res.status(404).json({
                    ok: false,
                    message: "Model not found"
                });
            }
            const {modelId} = req.body;
            const dynamicModel = getModelsHelper(model);
            if (!modelId) {
                try {
                    const data = await new dynamicModel({
                        ...req.body,
                        img: [req.body.file],
                    }).save();
                    if (this.Model[model].translate) {
                        await this.addTranslations(req, res, model, modelId);
                    }
                    if (this.Model[model].populate) {
                        await this.populateModelData(model, modelId);
                    }

                    return res.status(201).json({
                        ok: true,
                        message: "Model Created successfully",
                        newData: newData
                    });
                } catch (error) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error adding model"
                    });
                }

            }
            if (!mongoose.Types.ObjectId.isValid(modelId)) {
                return res.status(400).json({
                    ok: false,
                    message: "Invalid modelId"
                });
            }
            const existingModel = await dynamicModel.findById(modelId);
            if (!existingModel) {
                return res.status(404).json({
                    ok: false,
                    message: "Model doesn't  exists"
                });
            }
            if (this.Model[model].translate) {
                await this.addTranslations(req, res, model, modelId);
            }
            if (this.Model[model].populate) {
                await this.populateModelData(model, modelId);
            }
            const updatedData = await this.populateModelData(model, modelId);
            return res.status(200).json({
                ok: true,
                message: "Model Created successfully",
            });
        } catch (error) {
            console.error("Error:", error?.message);
            return res.status(500).json({
                ok: false,
                message: "There is issue with creating model"
            });
        }
    }

    async addTranslations(req, res, model, modelId) {
        const transModel = this.TranslateModel[model].ref;
        if (this.Model[model].translate && req.body.translate && transModel && req.body.translate.language) {
            const dynamicTranslateModel = getModelsTranslateHelper(transModel);
            const existingTranslation = await dynamicTranslateModel.findOne({
                [model]: modelId,
                language: req.body.translate.language,
            });
            if (!existingTranslation) {
                const newTranslation = new dynamicTranslateModel({
                    [model]: modelId,
                    ...req.body.translate,
                });
                await newTranslation.save();
            }
            return res.status(400).json({
                ok: false,
                message: "Model exists in this language (You can update this using put api)"
            })
        } else {
            return res.status(400).json({
                ok: false,
                message: "Error adding translation"
            })
        }
    }

    async populateModelData(model, modelId) {
        const dynamicModel = getModelsHelper(model);
        let newData = await dynamicModel.findById(modelId).lean();
        const transModel = this.TranslateModel[model].ref;
        if (this.Model[model].translate && transModel) {
            const dynamicTranslateModel = getModelsTranslateHelper(transModel);
            const translations = await dynamicTranslateModel.find({[model]: modelId}).lean();
            newData.translates = translations || [];
        }
        if (this.Model[model].populate) {
            await Promise.all(
                this.Model[model].populate.map(async (field) => {
                    newData[field] = await populateGet(field, newData[field]);
                })
            );
        }
        return newData;
    }
}

module.exports = AddModelsService;