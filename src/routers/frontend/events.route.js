const router = require('express').Router();

// Controllers
const EventsController = require('../../controllers/frontend/events.controller');
const eventsController = new EventsController();


router.get('/events', eventsController.getEventsList);

// router.get('/news/:slug', newsController.getOneModelDataBySlug);


module.exports = router;


