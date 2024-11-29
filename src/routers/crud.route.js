const {Router} = require('express');
const router = Router();
// Controller
const DefaultController = require('../controllers/crud/crud.controller');
const crudController = new DefaultController();
// Middleware
const authMiddleware = require('../middlewares/auth.middleware');
// For upload
const upload = require('../utils/uploads/upload-models.util');
// Validations
const validateModel = require("../validators/crud/models/models.validator");
const deletingFileValidator = require("../validators/files/delete-file.validator");


router.get('/:model', authMiddleware.adminMiddleware, crudController.all);

router.get('/:model/:id',authMiddleware.adminMiddleware, crudController.get);

router.post('/:model',  authMiddleware.adminMiddleware, validateModel, crudController.add);

router.post('/:model/upload', authMiddleware.adminMiddleware, upload.fields([
    { name: 'file', maxCount: 1 },
]), crudController.upload);


router.put('/:model/:modelId', authMiddleware.adminMiddleware, validateModel, upload.fields([
    { name: 'image', maxCount: 5 },
    { name: 'file', maxCount: 5 },
]),  crudController.put);

router.patch('/:model/:modelId', authMiddleware.adminMiddleware,  crudController.patch);

router.delete('/:model/deleteFile', authMiddleware.adminMiddleware, deletingFileValidator, crudController.deleteFile);

router.delete('/:model/:id', authMiddleware.adminMiddleware,  crudController.remove);


module.exports = router;
