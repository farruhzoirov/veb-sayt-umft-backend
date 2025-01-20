const EventsService =  require('../../services/frontend/events.service');

class EventsController {
  constructor() {
    this.eventsService = new EventsService();

    this.getEventsList = this.getEventsList.bind(this);
  }

  async getEventsList(req, res, next) {
    try {
      const eventsList = await this.eventsService.getEventsForFront(req);
      res.status(200).json(eventsList);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EventsController;