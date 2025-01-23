const router = require('express').Router();

// Controllers
const ProgramsController = require('../../controllers/frontend/programs.controller');
const programsController = new ProgramsController();


router.get('/programs', programsController.filterAndGetPrograms);

// router.get('/:model/:slug', universalController.getOneModelDataBySlug);


module.exports = router;


