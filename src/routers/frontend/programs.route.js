const router = require('express').Router();

// Controllers
const ProgramsController = require('../../controllers/frontend/programs.controller');
const {incrementViews} = require("../../middlewares/views.middleware");
const programsController = new ProgramsController();


router.get('/programs', programsController.filterAndGetPrograms);

router.get('/programs/:slug', incrementViews, programsController.getOneProgram);


module.exports = router;


