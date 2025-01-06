const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');

const SpecialtyController = require('../controllers/specialties/specialty.controller');

const specialtiesController = new SpecialtyController();

router.get('/fetch-specialty', authMiddleware.universalAccessMiddleware, specialtiesController.fetchSpecialties);


module.exports = router;