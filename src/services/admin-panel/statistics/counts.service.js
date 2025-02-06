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
    let monthlyViews = {}
    let statistics = {}

    await Promise.all(modelsGettingViewsByMonth.map(async (model) => {
      const currentModel = await getModelsHelper(model);
      const result = await currentModel.aggregate([
        {
          $project: {
            monthlyViews: {$objectToArray: "$monthlyViews"}
          }
        },
        {
          $unwind: "$monthlyViews"
        },
        {
          $group: {
            _id: "$monthlyViews.k",
            totalViews: {$sum: "$monthlyViews.v"}
          }
        },
        {$sort: {_id: 1}}
      ]);
      console.log('result', result);
      if (result.length) {
        result.forEach(({_id, totalViews}) => {
          const date = new Date(_id);
          const monthName = date.toLocaleDateString("default", {month: "long", year: "numeric"});
          monthlyViews[monthName] = (monthlyViews[monthName] || 0) + totalViews;
        });
        statistics[model] = monthlyViews;
        console.log('statistic', statistics[model])
      } else {
        statistics[model] = {}
      }
    }));
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