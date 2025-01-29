const LoggerService = require('../../../services/admin-panel/logger/logger.service');

class LoggerController {
  constructor() {
    this.loggerService = new LoggerService();

    this.getLoggers = this.getLoggers.bind(this);
  }

  async getLoggers(req, res, next) {
    const result = await this.loggerService.getLoggers(req, res, next);
    res.status(200).json(result);
  }
}

module.exports = LoggerController;