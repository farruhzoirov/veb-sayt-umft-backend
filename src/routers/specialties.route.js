const router = require('express').Router();
const upload = require('../utils/uploads/upload-models.util')
const authMiddleware = require('../middlewares/auth.middleware');


const SpecialtyController = require('../controllers/specialties/specialty.controller');

const specialtiesController = new SpecialtyController();

router.get('/fetch-specialty', authMiddleware.adminMiddleware, specialtiesController.fetchSpecialties);

router.get('/get-specialties', authMiddleware.adminMiddleware, specialtiesController.getSpecialties);

router.get('/get-specialty/:id', authMiddleware.adminMiddleware, specialtiesController.getOneSpecialty);


router.put('/update-specialty/:id', authMiddleware.adminMiddleware, upload.fields([
  {name: 'image', maxCount: 1}
]), specialtiesController.updateSpecialty);

module.exports = router;