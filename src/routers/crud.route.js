const {Router} = require('express');
const router = Router();
const authMiddleware = require('../middlewares/auth.middleware');
const DefaultController = require('../controllers/crud/crud.controller');

const upload = require('../helpers/uploads/upload-models.helper');

const validateModel = require("../validators/models/models.validator");

const crudController = new DefaultController();

router.get('/:model', authMiddleware.adminMiddleware, crudController.all);
router.get('/:model/:id',  crudController.get);

router.post('/:model', authMiddleware.adminMiddleware,  upload.fields([
    { name: 'image', maxCount: 5 },  // Up to 5 images
    { name: 'file', maxCount: 5 },   // Up to 5 other files
]), validateModel, crudController.add);


router.put('/:model/:modelId', authMiddleware.adminMiddleware, upload.fields([
    { name: 'image', maxCount: 5 },
    { name: 'file', maxCount: 5 },
]), validateModel,  crudController.put);


router.patch('/:model/:modelId', authMiddleware.adminMiddleware,  crudController.patch);
//router.patch('/:model/modelId',  crudController.update);

router.delete('/:model/:id', authMiddleware.adminMiddleware,  crudController.remove);



module.exports = router;
