const router = require('express').Router()

const StatisticController = require('../controllers/statistics.controller')
const  authMiddleware  = require('../middlewares/auth.middleware');

const statisticController = new StatisticController();

router.get('/counts', authMiddleware.adminMiddleware,  statisticController.ModelCounts);

module.exports = router;
