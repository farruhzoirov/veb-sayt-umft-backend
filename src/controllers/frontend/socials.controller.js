const SocialService = require("../../services/frontend/social.service");

class SocialsController {
  constructor() {
    // Services
    this.socialService = new SocialService();

    // Bind
    this.getSocialsForFront = this.getSocialsForFront.bind(this);
  }

  async getSocialsForFront(req, res, next) {
    try {
      const socialsList = await this.socialService.getSocialsForFront(req);
      res.status(200).json(socialsList);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SocialsController