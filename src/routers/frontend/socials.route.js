const router = require('express').Router();

// Controllers
const SocialsController = require('../../controllers/frontend/socials.controller');
const socialsController = new SocialsController();


router.get('/social', socialsController.getSocialsForFront);

router.get('/social/:slug', socialsController.getOneSocialForFront)


module.exports = router;

