const News = require('../../../models/data/news.model');
const Category = require('../../../models/data/category.model');
const Language = require('../../../models/settings/language.model');
const Events = require('../../../models/data/events.model');
const EventsCategory = require('../../../models/data/events-category.model');

const Employee = require('../../../models/data/employee.model');
const Specialty = require('../../../models/specialty/specialty.model');
const Department = require('../../../models/data/department.model');
const Applicants = require('../../../models/applicants/applicants.model');

class StatisticController {
  async ModelCounts(req, res) {
    const languages = await Language.countDocuments() || 0;
    const categories = await Category.countDocuments() || 0;
    const news = await News.countDocuments() || 0;
    const events = await Events.countDocuments() || 0;
    const eventsCategory = await EventsCategory.countDocuments() || 0;
    const employees = await Employee.countDocuments() || 0;
    const specialties = await Specialty.countDocuments() || 0;
    const departments = await Department.countDocuments() || 0;
    const applicants = await Applicants.countDocuments() || 0;

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
    });
  }
}

module.exports = StatisticController;