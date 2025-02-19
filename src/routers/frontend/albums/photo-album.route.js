const router = require('express').Router();

// Controllers
const PhotoAlbumController = require('../../../controllers/frontend/albums/photo-album.controller');
const photoAlbumController = new PhotoAlbumController();


router.get('/photoAlbum', photoAlbumController.getPhotoAlbumsForFront);


module.exports = router;


