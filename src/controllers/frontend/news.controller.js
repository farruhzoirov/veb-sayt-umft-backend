const NewsService = require('../../services/frontend/news.service');

class NewsController {
  constructor() {
    // Services
    this.newsService = new NewsService();

    // Bind
    this.getNewsForFront = this.getNewsForFront.bind(this);
    this.getOneNewsForFront = this.getOneNewsForFront.bind(this);
  }

  async getNewsForFront(req, res, next) {
     try {
       const newsList = await this.newsService.getNewsForFront(req);
       res.status(200).json(newsList);
     } catch (err) {
       next(err)
     }
  }

  async getOneNewsForFront(req, res, next) {
      try {
          const oneNews = await this.newsService.getOneNewsForFront(req);
          res.status(200).json(oneNews);
      } catch (err) {
          next(err)
      }
  }
}

module.exports = NewsController;