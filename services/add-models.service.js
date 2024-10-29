const {Model, TranslateModel} = require("../common/constants/models");
const {
    getModelsHelper,
    getModelsTranslateHelper,
    getModel,
} = require("../helpers/get-models.helper");

const {populateGet} = require("../helpers/get-populates.helper");
const mongoose = require("mongoose");

class AddModelsService {
    constructor() {
        this.Model = Model;
        this.TranslateModel = TranslateModel;
    }
    /**
     * Adds a new model or updates an existing model with translations.
     */
    async addModel(req, res) {
        try {
            const model = await getModel(req, res);
            console.log("Req body", req.body)
            if (!model) {
                return res.status(404).json({message: "Model not found"});
            }
            const { modelId } = req.body;
            const dynamicModel = getModelsHelper(model);
            let files = req.files || [];
            let imagePaths = (files.image || []).map((file) => file.path);
            // ------------------  Case 1: If no modelId is provided, create a new model -----------------
            if (!modelId) {
                try {
                    const data = await new dynamicModel({
                        ...req.body,
                        img: imagePaths,
                    }).save();
                    await this.addTranslations(req, res, model, data._id); // Add translations if needed
                    // const newData = await this.populateModelData(model, data._id);
                    await this.populateModelData(model, data._id);
                    return res.status(201).json({
                        ok: true,
                        message: "Model Created successfully",
                        // newData: newData
                    });
                } catch (error) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error adding model"
                    });
                }

            }
            // **Case 2:** If modelId is provided, validate it and add translations
            if (!mongoose.Types.ObjectId.isValid(modelId)) {
                return res.status(400).json({message: "Invalid modelId"});
            }

            const existingModel = await dynamicModel.findById(modelId);
            if (!existingModel) {
                return res.status(404).json({
                    message: "Model not found"
                });
            }
            await this.addTranslations(req, res, model, modelId); // Add translations
            // const updatedData = await this.populateModelData(model, modelId);
            await this.populateModelData(model, modelId);
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

    /**
     *  ------------------- Adds translations to the model if applicable. ------------------
     */
    async addTranslations(req, res, model, modelId) {
        const transModel = this.TranslateModel[model].ref;
        if (this.Model[model].translate && req.body.translate && transModel) {
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
            } else {
                await dynamicTranslateModel.updateOne(
                    {[model]: modelId, language: req.body.translate.language},
                    {$set: { ...req.body.translate }}
                );
            }
        }
    }
    /**
     * Populates the model with any required fields and translations.
     */

    async populateModelData(model, modelId) {
        const dynamicModel = getModelsHelper(model);
        let newData = await dynamicModel.findById(modelId).lean();

        const transModel = this.TranslateModel[model]?.ref;
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