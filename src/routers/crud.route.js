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


router.get('/:model', authMiddleware.universalAccessMiddleware, crudController.getAllModels);

router.get('/:model/:id',authMiddleware.universalAccessMiddleware, crudController.getModelById);

router.get('/:model/check/:slug', authMiddleware.universalAccessMiddleware, crudController.checkSlugExists);

router.post('/:model',  authMiddleware.adminMiddleware, validateModel, crudController.addModel);


router.post('/:model/upload', authMiddleware.universalAccessMiddleware, upload.fields([
    { name: 'file', maxCount: 10 },
]), crudController.uploadFile);


router.put('/:model/:id', authMiddleware.universalAccessMiddleware, validateModel, upload.fields([
    { name: 'file', maxCount: 1 },
]),  crudController.updateModel);


router.patch('/:model/:id', authMiddleware.universalAccessMiddleware, patchModelValidator,   crudController.patchModel);

router.delete('/:model/deleteFile', authMiddleware.universalAccessMiddleware, deletingFileValidator, crudController.deleteFile);

router.delete('/:model/:id', authMiddleware.adminMiddleware,   crudController.deleteModel);




module.exports = router;
