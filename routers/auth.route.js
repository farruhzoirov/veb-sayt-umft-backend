const router = require('express').Router()

const AuthController = require('../controllers/auth.controller');

// adminMiddleware
const { adminMiddleware } = require('../middlewares/auth.middleware');

// Validators
const userValidator = require("../validators/user.validator");

// Controller
const authController = new AuthController();

// Routers
router.get('/login/addAdmin',  authController.addAdmin);
router.post('/login', userValidator, authController.login);
router.get('/check-user', adminMiddleware, authController.checkUser);


module.exports = router;


