const News = require('../../../models/data/news.model');
const Category = require('../../../models/data/category.model');
const Language = require('../../../models/settings/language.model');


class StatisticController {
  async ModelCounts(req, res) {
    let language = await Language.countDocuments() || 0;
    let category = await Category.countDocuments() || 0;
    let news = await News.countDocuments() || 0;
    res.status(200).json({
      language: language,
      category: category,
      news: news
    });
  }
}

module.exports = StatisticController;