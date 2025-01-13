const SocialsService = require('../../services/frontend/socials.service');

class SocialsController {
    constructor() {
        this.partnersService = new SocialsService();

        this.getSocialsForFront = this.getSocialsForFront.bind(this);
        this.getOneSocialForFront = this.getOneSocialForFront.bind(this);
    }

    async getSocialsForFront(req, res, next) {
        try {
            const socialsList = await this.partnersService.getSocialsForFront(req);
            res.status(200).json(socialsList);
        } catch (err) {
            next(err)
        }
    }

    async getOneSocialForFront(req, res, next) {
        try {
            const social = await this.partnersService.getOneSocialForFront(req);
            res.status(200).json(social);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = SocialsController;