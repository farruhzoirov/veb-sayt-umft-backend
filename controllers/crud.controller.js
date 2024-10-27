const fs = require("fs");
const { Model, TranslateModel } = require("../common/constants/models");

// Services
const GetAllService = require("../services/get-all.service");
const GetModelService = require("../services/get-models.service");
const AddModelsService = require("../services/add-models.service");
const UpdateModelsService = require("../services/update-models.service");
const DeleteModelsService = require("../services/delete-models.service");

class DefaultController {
    async all(req, res) {
        const getAllService = new GetAllService();
        await getAllService.getAll(req, res);
    }
    async add(req, res) {
        const addModelsService = new AddModelsService();
        await addModelsService.addModel(req, res);
    }
    async get(req, res) {
        const getModelsService = new GetModelService();
        await getModelsService.getModelById(req, res);
    }
    async put(req, res) {
        const updateModelsService = new UpdateModelsService();
        await updateModelsService.putModel(req, res);
    }
    async patch(req, res) {
        const updateModelsService = new UpdateModelsService();
        await updateModelsService.patchModel(req, res);
    }
    /**
    async update(req, res) {
        const updateModelsService = new UpdateModelsService();
        await updateModelsService.updateModel(req, res);
    }
    */
    async remove(req,   res) {
        const deleteModelsService = new DeleteModelsService();
        await deleteModelsService.deleteModel(req, res);
    }
}



module.exports = DefaultController