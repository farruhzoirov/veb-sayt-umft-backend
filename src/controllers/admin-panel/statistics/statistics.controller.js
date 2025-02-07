const Logger = require('../../../models/logger/logger.model');
const CountsService = require("../../../services/admin-panel/statistics/counts.service");

class StatisticController {
  constructor() {
    // Services
    this.countsService = new CountsService();

    this.modelAndUrlBasedCounts = this.modelAndUrlBasedCounts.bind(this);
    this.viewCountsByMonth = this.viewCountsByMonth.bind(this);
 }

  async modelAndUrlBasedCounts(req, res, next) {
    try {
      const statistics = await this.countsService.modelAndUrlBasedCounts()
      res.status(200).json(statistics);
    } catch (error) {
      next(error);
    }
  }

  async viewCountsByMonth(req, res, next) {
    try {
      const views = await this.countsService.viewCountsByMonth(req);
      res.status(200).json(views);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StatisticController;
