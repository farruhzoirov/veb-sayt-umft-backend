const Logger = require("../../../models/logger/logger.model");
const {Model} = require("../../../common/constants/models.constants");
const {getModelsHelper} = require("../../../helpers/admin-panel/get-models.helper");
const BaseError = require("../../../errors/base.error");

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

  async viewCountsByMonth(req) {
    const modelsGettingViewsByMonth = [Model.specialty.ref, Model.news.ref, Model.events.ref];
    let month = req.query?.month;

    if (!month) {
      throw BaseError.BadRequest("Month parameter is required in YYYY-MM format");
    }

    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    let statistics = {};

    await Promise.all(modelsGettingViewsByMonth.map(async (modelRef) => {
      const currentModel = getModelsHelper(modelRef);

      const result = await currentModel.aggregate([
        {
          $project: {
            monthlyViews: {
              $objectToArray: "$monthlyViews"
            }
          }
        },
        {
          $unwind: "$monthlyViews"
        },
        {
          $match: {
            "monthlyViews.k": {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            views: {
              $push: {
                date: "$monthlyViews.k",
                views: "$monthlyViews.v"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            viewsArray: 1
          }
        }
      ]);

      const modelName = modelRef.toLowerCase().replace('model', '');

      statistics[modelName] = result[0]?.views || [];
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