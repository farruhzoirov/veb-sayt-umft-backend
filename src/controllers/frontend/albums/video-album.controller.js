const VideoAlbumService = require("../../../services/frontend/albums/video-album.service");

class VideoAlbumController {
  constructor() {
    this.videoAlbumService = new VideoAlbumService();


    this.getVideoAlbumsForFront = this.getVideoAlbumsForFront.bind(this);
  }

  async getVideoAlbumsForFront(req, res, next) {
    try {
      const getVideoAlbums = await this.videoAlbumService.getVideoAlbumsForFront(req);
      res.status(200).json(getVideoAlbums);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = VideoAlbumController;