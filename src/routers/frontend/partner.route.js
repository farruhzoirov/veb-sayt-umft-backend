const router = require('express').Router();

// Controllers
const PartnersController = require('../../controllers/frontend/partners.controller');
const partnersController = new PartnersController();
// Validators

router.get('/partner', partnersController.getPartnersForFront);

router.get('/partner/:slug', partnersController.getOnePartnerForFront)


module.exports = router;

