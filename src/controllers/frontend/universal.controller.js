const UniversalService = require('../../services/frontend/universal.service');

class UniversalController {
  constructor() {
    // Services
    this.universalService = new UniversalService();

    // Bind
    this.getModelsDataForFront = this.getModelsDataForFront.bind(this);
    this.getOneModelDataForFront = this.getOneModelDataForFront.bind(this);
  }

  async getModelsDataForFront(req, res, next) {
     try {
       const modelDataList = await this.universalService.getModelsListForFront(req);
       res.status(200).json(modelDataList);
     } catch (err) {
       next(err)
     }
  }

  async getOneModelDataForFront(req, res, next) {
      try {
          const oneModelData = await this.universalService.getOneModelDataForFront(req);
          res.status(200).json(oneModelData);
      } catch (err) {
          next(err)
      }
  }
}

module.exports = UniversalController;