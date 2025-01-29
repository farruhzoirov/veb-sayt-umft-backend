const router = require('express').Router()

const LoggerController = require('../../../controllers/admin-panel/logger/logger.controller');

// adminMiddleware

// Validators

// Controller
const loggerController = new LoggerController();

// Routers
// GET
router.get('/loggers', loggerController.getLoggers);



module.exports = router;


