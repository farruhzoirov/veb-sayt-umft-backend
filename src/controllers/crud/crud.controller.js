const fs = require("fs");
const {Model, TranslateModel} = require("../../common/constants/models.constants");

// Services
const GetAllService = require("../../services/crud/get-models.service");
const GetModelService = require("../../services/crud/get-model.service");
const AddModelsService = require("../../services/crud/add-models.service");
const UpdateModelsService = require("../../services/crud/update-models.service");
const DeleteModelsService = require("../../services/crud/delete-models.service");
const UploadService = require("../../services/crud/upload.service");

const {getModel} = require("../../helpers/get-models.helper");

class DefaultController {
    constructor() {
        // Services
        this.getAllService = new GetAllService();
        this.getModelService = new GetModelService();
        this.addModelsService = new AddModelsService();
        this.updateModelsService = new UpdateModelsService();
        this.deleteModelsService = new DeleteModelsService();
        this.uploadService = new UploadService();
        // Bind
        this.all = this.all.bind(this);
        this.add = this.add.bind(this);
        this.get = this.get.bind(this);
        this.put = this.put.bind(this);
        this.patch = this.patch.bind(this);
        this.remove = this.remove.bind(this);
        this.upload = this.upload.bind(this);
    }

    async all(req, res) {
        await this.getAllService.getAll(req, res);
    }

    async add(req, res, next) {
        try {
            const modelData = req.body;
            const modelName = await getModel(req);
            const newData = await this.addModelsService.addModel(modelName, modelData);
            return res.status(201).json(newData);
        } catch (err) {
            next(err);
        }
    }

    async get(req, res) {
        await this.getModelService.getModelById(req, res);
    }

    async put(req, res) {
        await this.updateModelsService.putModel(req, res);
    }

    async patch(req, res) {
        await this.updateModelsService.patchModel(req, res);
    }

    async remove(req, res) {
        await this.deleteModelsService.deleteModel(req, res);
    }

    async upload(req, res) {
        await this.uploadService.uploadFile(req, res);
    }
}

module.exports = DefaultController