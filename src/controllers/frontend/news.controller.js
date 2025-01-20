const NewsService = require('../../services/frontend/news.service');

class NewsController {
  constructor() {
    this.newsService = new NewsService();

    this.getNewsList = this.getNewsList.bind(this);
  }

  async getNewsList(req, res, next) {
    try {
      const newsList = await this.newsService.getNewsForFront(req);
      res.status(200).json(newsList);
    } catch (err) {
      next(err);
    }
  }
}


module.exports = NewsController