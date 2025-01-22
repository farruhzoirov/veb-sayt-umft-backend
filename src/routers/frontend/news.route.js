const router = require('express').Router();

// Controllers
const NewsController = require('../../controllers/frontend/news.controller');
const newsController = new NewsController();


router.get('/news', newsController.getNewsList);

// router.get('/news/:slug', newsController.getOneModelDataBySlug);


module.exports = router;


