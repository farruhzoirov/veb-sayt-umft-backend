const mongoose = require("mongoose");
const fs = require("fs");
const {getModelsHelper, getModelsTranslateHelper, getModel} = require("../helpers/get-models.helper");
const {Model, TranslateModel} = require("../common/constants/models");
const path = require("node:path");


class DeleteModelsService {
    constructor() {
        this.Model =  Model
        this.TranslateModel = TranslateModel
    }
    async deleteModel(req, res) {
        let _id = req.params.id
        const model = await getModel(req, res);
        const dynamicModel = getModelsHelper(model)

        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(500).json({
                msg: '_id is not valid'
            })
        const data = await dynamicModel.findById(_id).select(['_id', 'img', 'file']).lean()
        if (data.img && data.img.length && Array.isArray(data.img)) {
            data.img.forEach(elem => {
                if (fs.existsSync(elem)) {
                    fs.unlinkSync(path.join(`${__dirname}/../${elem}`))
                }
            })
        } else if (data.img) {
            if (fs.existsSync(data.img)) {
                fs.unlinkSync(path.join(`${__dirname}/../${data.img}`))
            }
        }
        if (data.file && data.file.length > 0) {
            data.file.forEach(elem => {
                if (fs.existsSync(elem)) {
                    fs.unlinkSync(path.join(`${__dirname}/../${elem}`))
                }
            })
        }
        await dynamicModel.findByIdAndDelete(_id);
        if (this.Model[model].translate) {
            let transModel = this.TranslateModel[model].ref
            const dynamicTranslateModel = getModelsTranslateHelper(transModel)
            await dynamicTranslateModel.deleteMany({ [model]: _id })
        }
        res.status(200).json({
            message: 'Deleted successfully'
        })
    }
}

module.exports = DeleteModelsService;