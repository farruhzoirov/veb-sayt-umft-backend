const mongoose = require("mongoose");
const fs = require("fs");
const {getModelsHelper, getModelsTranslateHelper, getModel} = require("../../helpers/get-models.helper");
const {Model, TranslateModel} = require("../../common/constants/models.constants");
const path = require("node:path");


class DeleteModelsService {
    constructor() {
        this.Model = Model
        this.TranslateModel = TranslateModel
    }
    async deleteModel(req, res) {
        let _id = req.params.id;
        const model = await getModel(req);

        if (!model) {
            return res.status(404).json({
                ok: false,
                message: "Model not found"
            });
        }

        const dynamicModel = getModelsHelper(model)

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(500).json({
                ok: false,
                message: '_id is not valid'
            })
        }
        const data = await dynamicModel.findById(_id).select(['_id', 'img', 'file']).lean()
        console.log(data)
        const rootPath = path.resolve(__dirname, '../../'); // Adjust to reach the project root
        console.log(rootPath);
        const imagesPath = path.join(rootPath, 'images'); // Path to the 'images' folder
        if (data.img && Array.isArray(data.img)) {
            data.img.forEach(elem => {
                const imagePath = path.join(imagesPath, elem);
                console.log(imagePath)
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        } else if (data.img) {
            const imagePath = path.join(imagesPath, data.img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        if (data.file && Array.isArray(data.file)) {
            data.file.forEach(elem => {
                const filePath = path.join(imagesPath, elem);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }
        await dynamicModel.findByIdAndDelete(_id);
        if (this.Model[model].translate) {
            let transModel = this.TranslateModel[model].ref
            const dynamicTranslateModel = getModelsTranslateHelper(transModel)
            await dynamicTranslateModel.deleteMany({[model]: _id})
        }
        res.status(200).json({
            ok: true,
            message: 'Deleted successfully'
        })
    }
}

module.exports = DeleteModelsService;