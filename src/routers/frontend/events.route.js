const router = require('express').Router();

// Controllers
const EventsController = require('../../controllers/frontend/events.controller');
const {incrementViews} = require("../../middlewares/views.middleware");
const eventsController = new EventsController();


router.get('/events', incrementViews, eventsController.getEventsList);

// router.get('/news/:slug', newsController.getOneModelDataBySlug);


module.exports = router;


