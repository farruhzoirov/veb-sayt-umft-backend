const fs = require("fs");
const { Model, TranslateModel } = require("../common/constants/models");

// Services
const GetAllService = require("../services/get-all.service");
const GetModelService = require("../services/get-models.service");
const AddModelsService = require("../services/add-models.service");
const UpdateModelsService = require("../services/update-models.service");
const DeleteModelsService = require("../services/delete-models.service");

class DefaultController {

    constructor() {
        // Services
        this.getAllService = new GetAllService();
        this.getModelService = new GetModelService();
        this.addModelsService = new AddModelsService();
        this.updateModelsService = new UpdateModelsService();
        this.deleteModelsService = new DeleteModelsService();

        // Bind
        this.all = this.all.bind(this);
        this.add = this.add.bind(this);
        this.get = this.get.bind(this);
        this.put = this.put.bind(this);
        this.patch = this.patch.bind(this);
        this.remove = this.remove.bind(this);
    }
    async all(req, res) {
        await this.getAllService.getAll(req, res);
    }
    async add(req, res) {
        await this.addModelsService.addModel(req, res);
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
}

module.exports = DefaultController