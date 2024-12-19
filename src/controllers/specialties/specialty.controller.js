const FetchSpecialtiesService = require('../../services/hemis/specialties/fetch-specialties.service')


class SpecialtyController {
  constructor() {
    // Services
    this.fetchSpecialtiesService  = new FetchSpecialtiesService()


    // Bind
    this.fetchSpecialties = this.fetchSpecialties.bind(this);

  }

  async fetchSpecialties(req, res, next) {
    try {
      await this.fetchSpecialtiesService.fetchSpecialties();
      res.status(200).json({
        ok: true,
        message: "Specialties were fetched or synced successfully",
      })
    } catch (err) {
      next(err)
    }
  }

  async getSpecialties(req, res, next) {

  }

  async getOneSpecialty(req, res, next) {

  }

  async updateSpecialty(req, res, next) {

  }

  async deleteSpecialty(req, res, next) {

  }

}


module.exports = SpecialtyController