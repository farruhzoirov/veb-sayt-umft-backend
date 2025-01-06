const router = require('express').Router()

const AuthController = require('../controllers/auth/auth.controller');

// adminMiddleware
const authMiddleware = require('../middlewares/auth.middleware');

// Validators
const userValidator = require("../validators/user.validator");

// Controller
const authController = new AuthController();

// Routers
// GET
router.get('/add-first-admin',  authController.addFirstAdmin);

// POST
router.post('/login', userValidator, authController.login);


router.get('/check-user', authMiddleware.universalAccessMiddleware, authController.checkUser);



module.exports = router;


