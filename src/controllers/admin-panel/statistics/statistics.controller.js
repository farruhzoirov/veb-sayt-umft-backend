const models = {
  news: require('../../../models/data/news.model'),
  category: require('../../../models/data/category.model'),
  language: require('../../../models/settings/language.model'),
  events: require('../../../models/data/events.model'),
  eventsCategory: require('../../../models/data/events-category.model'),
  employee: require('../../../models/data/employee.model'),
  specialty: require('../../../models/specialty/specialty.model'),
  department: require('../../../models/data/department.model'),
  applicants: require('../../../models/applicants/applicants.model'),
  degree: require('../../../models/data/degrees.model'),
  partner: require('../../../models/data/partners.model')
};

const Logger = require('../../../models/logger/logger.model');

class StatisticController {
  constructor() {
    this.getUrlStatistics = this.getUrlStatistics.bind(this);
    this.ModelCounts = this.ModelCounts.bind(this);
  }

  async ModelCounts(req, res, next) {
    try {
      let statistics = {};

      // **Model obyektidan dinamik hisoblash**
      for (const [key, model] of Object.entries(models)) {
        statistics[key] = await model.countDocuments() || 0;
      }

      // **URL statistikalarini olish**
      for (const key of Object.keys(models)) {
        const urlRegex = new RegExp(`/front/${key}/*`, "i"); // `/front/model_name/*` kabi url
        statistics[`${key}RequestCounts`] = await this.getUrlStatistics(urlRegex);
      }

      res.status(200).json(statistics);
    } catch (error) {
      next(error);
    }
  }

  async getUrlStatistics(regex) {
    try {
      return await Logger.countDocuments({ url: { $regex: regex, $options: 'i' } });
    } catch (error) {
      console.log("Error getting URL statistics:", error);
      return 0;
    }
  }
}

module.exports = StatisticController;
