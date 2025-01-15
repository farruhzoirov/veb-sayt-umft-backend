const router = require('express').Router();

// Controllers
const SocialController = require('../../controllers/frontend/socials.controller');
const socialController = new SocialController();


router.post('/social', socialController.getSocialsForFront);

// router.get('/:model/:slug', universalController.getOneModelDataBySlug);


module.exports = router;


