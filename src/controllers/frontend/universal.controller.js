const UniversalService = require('../../services/frontend/universal.service');

// Universal controller for frontend

class UniversalController {
    constructor() {
        // Services
        this.universalService = new UniversalService();

        // Bind
        this.getModelsDataForFront = this.getModelsDataForFront.bind(this);
        this.getOneModelDataBySlug = this.getOneModelDataBySlug.bind(this);
    }

    async getModelsDataForFront(req, res, next) {
        try {
            console.log(req.params.model)
            const modelDataList = await this.universalService.getModelsListForFront(req);
            res.status(200).json(modelDataList);
        } catch (err) {
            next(err)
        }
    }

    async getOneModelDataBySlug(req, res, next) {
        try {
            const oneModelData = await this.universalService.getOneModelDataForFront(req);
            res.status(200).json(oneModelData);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = UniversalController;