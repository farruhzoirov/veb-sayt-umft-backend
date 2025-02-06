const router = require('express').Router()

const StatisticController = require('../../controllers/admin-panel/statistics/statistics.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const statisticController = new StatisticController();

router.get('/counts', authMiddleware.universalAccessMiddleware,  statisticController.modelAndUrlBasedCounts);

router.get('/views-counts-by-month',  authMiddleware.universalAccessMiddleware, statisticController.viewCountsByMonth);

module.exports = router;
