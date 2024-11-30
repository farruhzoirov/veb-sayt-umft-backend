const mongoose = require("mongoose");
const {getModelsHelper, getModelsTranslateHelper} = require("../../helpers/get-models.helper");
const {Model, TranslateModel} = require("../../common/constants/models.constants");
const BaseError = require("../../errors/base.error");

const deleteFilesHelper = require("../../helpers/delete-files.helper");

class DeleteModelsService {
    constructor() {
        this.Model = Model
        this.TranslateModel = TranslateModel
    }
    async deleteModel(modelId, modelName) {
        const dynamicModel = getModelsHelper(modelName)
        if (!mongoose.Types.ObjectId.isValid(modelId)) {
            throw BaseError.BadRequest('Invalid modelId');
        }
        const data = await dynamicModel.findById(modelId);
        console.log(data)
        if (!data) {
            throw BaseError.NotFound("Model doesn't exist");
        }
        if (data.img && Array.isArray(data.img)) {
            await deleteFilesHelper(data.img);
        } else {
            throw BaseError.BadRequest('No images found to delete for model:', modelId);
        }
        // const imagesPath = path.join(process.cwd(), data.img[0]); // Path to the 'images' folder
        // if (data.img && Array.isArray(data.img)) {
        //     data.img.forEach(elem => {
        //         const imagePath = path.join(imagesPath, elem);
        //         console.log(imagePath)
        //         if (fs.existsSync(imagePath)) {
        //             fs.unlinkSync(imagePath);
        //         }
        //     });
        // } else if (data.img) {
        //     const imagePath = path.join(imagesPath, data.img);
        //     if (fs.existsSync(imagePath)) {
        //         fs.unlinkSync(imagePath);
        //     }
        // }
        // if (data.file && Array.isArray(data.file)) {
        //     data.file.forEach(elem => {
        //         const filePath = path.join(imagesPath, elem);
        //         if (fs.existsSync(filePath)) {
        //             fs.unlinkSync(filePath);
        //         }
        //     });
        // }
        await dynamicModel.findByIdAndDelete(modelId);
        if (this.Model[modelName].translate) {
            let transModel = this.TranslateModel[modelName].ref;
            const dynamicTranslateModel = getModelsTranslateHelper(transModel)
            await dynamicTranslateModel.deleteMany({ [modelName]: modelId });
        }
    }
}

module.exports = DeleteModelsService;