const PartnersService = require('../../services/frontend/partners.service');

class PartnersController {
     constructor() {
          this.partnersService = new PartnersService();

          this.getPartnersForFront = this.getPartnersForFront.bind(this);
     }

     async getPartnersForFront(req, res, next) {
          try {
               const partnersList = await this.partnersService.getPartners(req);
               res.status(200).json(partnersList);
          } catch (err) {
               next(err)
          }
     }

     async getOnePartnerForFront(req, res, next) {
          try {
               const partner = await this.partnersService.getOnePartner(req);
               res.status(200).json(partner);
          } catch (err) {
               next(err)
          }
     }
}

module.exports = PartnersController;