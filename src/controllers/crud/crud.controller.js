// Services
const GetAllService = require("../../services/crud/get-models.service");
const GetModelService = require("../../services/crud/get-model.service");
const AddModelsService = require("../../services/crud/add-models.service");
const UpdateModelsService = require("../../services/crud/update-models.service");
const DeleteModelsService = require("../../services/crud/delete-models.service");
const UploadService = require("../../services/crud/upload.service");
const DeleteFileService = require("../../services/crud/delete-file.service");
const PatchModelsService = require("../../services/crud/patch-models.service");

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
    this.deleteFileService = new DeleteFileService();
    this.patchModelsService = new PatchModelsService();

    // Bind
    this.getAllModels = this.getAllModels.bind(this);
    this.addModel = this.addModel.bind(this);
    this.getModelById = this.getModelById.bind(this);
    this.updateModel = this.updateModel.bind(this);
    this.patchModel = this.patchModel.bind(this);
    this.deleteModel = this.deleteModel.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  async getAllModels(req, res) {
    await this.getAllService.getAll(req, res);
  }

  async getModelById(req, res) {
    await this.getModelService.getModelById(req, res);
  }

  async addModel(req, res, next) {
    try {
      const modelData = req.body;
      const modelName = await getModel(req);
      const newData = await this.addModelsService.addModel(modelName, modelData);
      console.log("New data", newData);
      return res.status(201).json(newData);
    } catch (err) {
      next(err);
    }
  }

  async updateModel(req, res, next) {
    try {
      const updateData = req.body;
      const modelName = await getModel(req);
      const modelId = req.params.id;
      const newData = await this.updateModelsService.updateModel(modelName, modelId, updateData);
      return res.status(200).json(newData);
    } catch (err) {
      next(err);
    }
  }

  async patchModel(req, res, next) {
    try {
      const modelName = req.params.model;
      const modelId = req.params.id;
      const modelData = req.body;
      const patchedData = await this.patchModelsService.patchModel(modelName, modelId, modelData);
      return res.status(200).json(patchedData);
    } catch (err) {
      next(err);
    }
  }

  async deleteModel(req, res, next) {
    try {
      const modelId = req.params.id;
      const modelName = await getModel(req);
      await this.deleteModelsService.deleteModel(modelId, modelName);
      return res.status(200).json({
        ok: true,
        message: "Model deleted successfully."
      });
    } catch (err) {
      next(err);
    }
  }

  async uploadFile(req, res) {
    await this.uploadService.uploadFile(req, res);
  }

  async deleteFile(req, res, next) {
    try {
      const filePath = req.body.filePath;
      await this.deleteFileService.deleteFile(filePath);
      return res.status(200).json({
        ok: true,
        message: "File deleted"
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DefaultController