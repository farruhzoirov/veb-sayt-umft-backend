const router = require('express').Router();

// Controllers
const NewsController = require('../../controllers/frontend/news.controller');
const newsController = new NewsController();
// Validators

router.get('/news', newsController.getNewsForFront);

router.get('/news/:slug', newsController.getOneNewsForFront);

module.exports = router;

