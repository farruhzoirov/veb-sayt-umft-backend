const router = require('express').Router();

// Controllers
const NewsController = require('../../controllers/frontend/universal.controller');
const newsController = new NewsController();


router.get('/news', newsController.getNewsForFront);

router.get('/news/:slug', newsController.getOneNewsForFront);

module.exports = router;

