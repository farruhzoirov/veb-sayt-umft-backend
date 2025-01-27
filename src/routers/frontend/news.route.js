const router = require('express').Router();

// Controllers
const NewsController = require('../../controllers/frontend/news.controller');
const {incrementViews} = require("../../middlewares/views.middleware");
const newsController = new NewsController();


router.get('/news', incrementViews, newsController.getNewsList);

// router.get('/news/:slug', newsController.getOneModelDataBySlug);


module.exports = router;


