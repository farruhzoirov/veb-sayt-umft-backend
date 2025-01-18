const router = require('express').Router();

// Controllers
const ApplicantsController = require('../controllers/applicants/applicants.controller');
const applicantsController = new ApplicantsController();
const {adminMiddleware} = require('../middlewares/auth.middleware');

// Validators
const applicantsValidator = require('../validators/applicants/applicants.validator');

router.post('/applicants', applicantsValidator, applicantsController.post);

router.get('/applicants', applicantsController.getAllApplicants);

router.get('/applicants/:applicantId', applicantsController.getOneApplicantById);


module.exports = router;

