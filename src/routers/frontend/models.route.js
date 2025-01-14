const router = require('express').Router();

// Controllers
const UniversalController = require('../../controllers/frontend/universal.controller');
const universalController = new UniversalController();


router.get('/:model', universalController.getModelsDataForFront);

router.get('/:model/:slug', universalController.getOneModelDataBySlug);


module.exports = router;

