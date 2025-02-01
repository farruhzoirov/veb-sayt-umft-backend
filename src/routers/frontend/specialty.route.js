const router = require('express').Router();

// Controllers
const SpecialtyController = require('../../controllers/frontend/specialty.controller');
const {incrementViews} = require("../../middlewares/views.middleware");
const programsController = new SpecialtyController();


router.get('/specialty', programsController.filterAndGetSpecialties);

router.get('/specialty/:slug', incrementViews, programsController.getOneSpecialty);


module.exports = router;


