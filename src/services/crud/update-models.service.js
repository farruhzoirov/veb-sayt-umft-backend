const mongoose = require("mongoose");
const fs = require('fs').promises;

const {Model, TranslateModel} = require("../../common/constants/models.constants");

const {
    getModelsHelper,
    getModelsTranslateHelper,
    getModel,
} = require("../../helpers/get-models.helper");

const {populateGet} = require("../../helpers/get-populates.helper");


class UpdateModelsService {
    constructor() {
        this.Model = Model;
        this.TranslateModel = TranslateModel;
    }

    /** ------------------
     * Updates an existing model and its translations using PUT method.
     * Replaces the entire document with the new data.
     ----------------- **/
    async putModel(req, res) {
        return this.updateModel(req, res, 'PUT');
    }

    async patchModel(req, res) {
        return this.updateModel(req, res, 'PATCH');
    }

    /**
     * Core update logic for both PUT and PATCH methods.
     */
    async updateModel(req, res, method) {
        try {
            const model = await getModel(req);
            if (!model) {
                return res.status(404).json({
                    ok: false,
                    message: "Model not found"
                });
            }
            const {modelId} = req.params;
            if (!mongoose.Types.ObjectId.isValid(modelId)) {
                return res.status(400).json({message: "Invalid modelId"});
            }
            const dynamicModel = getModelsHelper(model);
            const existingModel = await dynamicModel.findById(modelId);
            if (!existingModel) {
                return res.status(404).json({message: "Model not found"});
            }
            let updateData = {...req.body};
            if (req.files && req.files.image) {
                let newImagePaths = (req.files.image || []).map((file) => file.path);
                if (existingModel.img && existingModel.img.length) {
                    await this.deletePreviousImages(existingModel.img);
                }
                updateData.img = newImagePaths;
            }
            await dynamicModel.findByIdAndUpdate(
                modelId,
                method === 'PUT' ? updateData : { $set: updateData },
                {
                    new: true
                }
            );
            // Update translations
            if (req.body.translate) {
                await this.updateTranslations(req, res, model, modelId, method);
            }
            const updatedData = await this.populateModelData(model, modelId);
            return res.status(200).json({
                ok: true,
                message: "Updated successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({message: error.message});
        }
    }

    /**
     * Deletes previous images from the server.
     */
    async deletePreviousImages(previousImages) {
        for (const imagePath of previousImages) {
            try {
                await fs.unlink(imagePath);
                console.log(`Successfully deleted image: ${imagePath}`);
            } catch (error) {
                console.error(`Failed to delete image: ${imagePath}`, error);
            }
        }
    }

    /**
     * Updates translations for the model if applicable.
     */
    async updateTranslations(req, res, model, modelId, method) {
        const transModel = this.TranslateModel[model]?.ref;
        if (this.Model[model].translate && transModel) {
            const dynamicTranslateModel = getModelsTranslateHelper(transModel);
            const {language, ...translationData} = req.body.translate;
            if (method === 'PUT') {
                await dynamicTranslateModel.findOneAndReplace(
                    {[model]: modelId, language},
                    {[model]: modelId, language, ...translationData},
                    {upsert: true, new: true}
                );
            } else if (method === 'PATCH') {
                // For PATCH, update only the specified fields
                await dynamicTranslateModel.findOneAndUpdate(
                    {[model]: modelId, language},
                    {$set: translationData},
                    {upsert: true, new: true}
                );
            }
        }
    }

    /**
     * Populates the model with any required fields and translations.
     */
    async populateModelData(model, modelId) {
        const dynamicModel = getModelsHelper(model);
        let updatedData = await dynamicModel.findById(modelId).lean();
        const transModel = this.TranslateModel[model]?.ref;
        if (this.Model[model].translate && transModel) {
            const dynamicTranslateModel = getModelsTranslateHelper(transModel);
            const translations = await dynamicTranslateModel.find({[model]: modelId}).lean();
            updatedData.translates = translations || [];
        }
        if (this.Model[model].populate) {
            await Promise.all(
                this.Model[model].populate.map(async (field) => {
                    updatedData[field] = await populateGet(field, updatedData[field]);
                })
            );
        }
        return updatedData;
    }
}

module.exports = UpdateModelsService;