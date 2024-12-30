const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');

const SpecialtyController = require('../controllers/specialties/specialty.controller');

const specialtiesController = new SpecialtyController();

router.get('/fetch-specialty', authMiddleware.adminMiddleware, specialtiesController.fetchSpecialties);


module.exports = router;