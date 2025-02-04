const News = require('../../../models/data/news.model');
const Category = require('../../../models/data/category.model');
const Language = require('../../../models/settings/language.model');
const Events = require('../../../models/data/events.model');
const EventsCategory = require('../../../models/data/events-category.model');

const Employee = require('../../../models/data/employee.model');
const Specialty = require('../../../models/specialty/specialty.model');
const Department = require('../../../models/data/department.model');
const Applicants = require('../../../models/applicants/applicants.model');

const Degree = require('../../../models/data/degrees.model');
const Partner = require('../../../models/data/partners.model');

const Logger = require('../../../models/logger/logger.model');

class StatisticController {
  async ModelCounts(req, res, next) {
    try {
      const languages = await Language.countDocuments() || 0;
      const categories = await Category.countDocuments() || 0;
      const news = await News.countDocuments() || 0;
      const events = await Events.countDocuments() || 0;
      const eventsCategory = await EventsCategory.countDocuments() || 0;
      const employees = await Employee.countDocuments() || 0;
      const specialties = await Specialty.countDocuments() || 0;
      const departments = await Department.countDocuments() || 0;
      const applicants = await Applicants.countDocuments() || 0;
      const degrees = await Degree.countDocuments() || 0;
      const partners = await Partner.countDocuments() || 0;

      const newsRegex = "/front/news/*";
      const newsRequestCounts = await this.getUrlStatistics(newsRegex);
      console.log(newsRequestCounts);
      res.status(200).json({
        languages: languages,
        categories: categories,
        news: news,
        events: events,
        eventsCategory: eventsCategory,
        employees: employees,
        specialties: specialties,
        departments: departments,
        applicants: applicants,
        degrees: degrees,
        partners: partners,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUrlStatistics(regex) {
    try {
      const logs = await Logger.aggregate([
        {
          $match: {
            url: {regex: regex, $options: 'i'},
          },
        }, {
        $group: {
          _id: "$url",
          count: { $sum: 1 },
        }
        },
        {
          $sort: {count: -1}
        }
      ]);
      return logs;
    } catch (error) {
      console.log("Error getting url based statistics",error);
    }
  }
}

module.exports = StatisticController;