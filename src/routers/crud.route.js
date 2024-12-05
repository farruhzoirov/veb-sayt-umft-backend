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
const patchModelValidator = require("../validators/crud/patch-model.validator");
const deletingFileValidator = require("../validators/files/delete-file.validator");


router.get('/:model', authMiddleware.adminMiddleware, crudController.getAllModels);

router.get('/:model/:id',authMiddleware.adminMiddleware, crudController.getModelById);

router.post('/:model',  authMiddleware.adminMiddleware, validateModel, crudController.addModel);


router.post('/:model/upload', authMiddleware.adminMiddleware, upload.fields([
    { name: 'file', maxCount: 1 },
]), crudController.uploadFile);


router.put('/:model/:id', authMiddleware.adminMiddleware, validateModel, upload.fields([
    { name: 'file', maxCount: 1 },
]),  crudController.updateModel);


router.patch('/:model/:id', authMiddleware.adminMiddleware, patchModelValidator,   crudController.patchModel);

router.delete('/:model/deleteFile', authMiddleware.adminMiddleware, deletingFileValidator, crudController.deleteFile);

router.delete('/:model/:id', authMiddleware.adminMiddleware,   crudController.deleteModel);




module.exports = router;
