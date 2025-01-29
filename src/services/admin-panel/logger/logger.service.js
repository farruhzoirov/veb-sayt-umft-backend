const Logger = require('../../../models/logger/logger.model')


class LoggerService {
  constructor() {

  }

  async getLoggers() {
    const result =await Logger.find().lean()
    return {
      result,
    }
  }
}

module.exports = LoggerService;