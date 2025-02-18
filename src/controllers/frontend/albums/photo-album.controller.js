const PhotoAlbumService = require("../../../services/frontend/albums/photo-album.service");


class PhotoAlbumController {
  constructor() {
    this.photoAlbumService = new PhotoAlbumService();


    this.getPhotoAlbumsForFront = this.getPhotoAlbumsForFront.bind(this);
  }

  async getPhotoAlbumsForFront(req, res, next) {
    try {
      const getPhotoAlbums = await this.photoAlbumService.getPhotoAlbumsForFront(req);
      res.status(200).json(getPhotoAlbums);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PhotoAlbumController;