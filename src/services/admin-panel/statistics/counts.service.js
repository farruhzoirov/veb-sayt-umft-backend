const Logger = require("../../../models/logger/logger.model");
const {Model} = require("../../../common/constants/models.constants");
const {getModelsHelper} = require("../../../helpers/admin-panel/get-models.helper");

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

class CountsService {
  async modelAndUrlBasedCounts() {
    let statistics = {};
    let requestedUrlCounts = {}

    for (const [key, model] of Object.entries(models)) {
      statistics[key] = await model.countDocuments() || 0;
    }

    statistics.requestedUrlCounts = requestedUrlCounts;
    for (const key of Object.keys(models)) {
      const urlRegex = `/front/${key}/*`
      statistics.requestedUrlCounts[`${key}`] = await this.getUrlStatistics(urlRegex);
    }
    return statistics;
  }

  async viewCountsByMonth() {
    const modelsGettingViewsByMonth = [Model.specialty.ref, Model.news.ref, Model.events.ref];
    let statistics = {}
    await Promise.all(modelsGettingViewsByMonth.map(async (model) => {
        statistics[model] = await model.find().select('monthlyViews -__v -createdAt -updatedAt').lean()|| {};
    }))

    return statistics;
  }

  async getUrlStatistics(regex) {
    try {
      return await Logger.countDocuments({url: {$regex: regex, $options: 'i'}});
    } catch (error) {
      console.log("Error getting URL statistics:", error);
      return 0;
    }
  }
}



module.exports = CountsService;