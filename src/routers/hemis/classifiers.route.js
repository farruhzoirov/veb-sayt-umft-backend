const {Router} = require('express');
const router = Router();

// Controller
const ClassifiersController = require('../../controllers/hemis/classifiers/classifiers.controller');
const classifierController = new ClassifiersController();

// Middleware
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/', authMiddleware.universalAccessMiddleware, classifierController.getClassifiers);


module.exports = router;
