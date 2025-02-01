const SpecialtiesService = require('../../services/frontend/specialty.service');

class SpecialtyController {
  constructor() {
    this.specialtiesService = new SpecialtiesService();

    this.filterAndGetSpecialties = this.filterAndGetSpecialties.bind(this);
    this.getOneSpecialty = this.getOneSpecialty.bind(this);
  }

  async filterAndGetSpecialties(req, res, next) {
    try {
      const specialtiesList = await this.specialtiesService.filterAndGetSpecialties(req);
      res.status(200).json(specialtiesList);
    } catch (err) {
      next(err);
    }
  }

  async getOneSpecialty(req, res, next) {
    try {
      const oneSpecialty = await this.specialtiesService.getOneSpecialty(req);
      res.status(200).json(oneSpecialty);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SpecialtyController;