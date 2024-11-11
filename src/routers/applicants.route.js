const router = require('express').Router();

// Controllers
const ApplicantsController = require('../controllers/applicants/applicants.controller');
const applicantsController = new ApplicantsController();


// Validators
const applicantsValidator = require('../validators/applicants/applicants.validator');


router.post('/applicants', applicantsValidator, applicantsController.post);


module.exports = router;