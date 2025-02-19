const router = require('express').Router();

// Controllers
const VideoAlbumController = require('../../../controllers/frontend/albums/video-album.controller');
const videoAlbumController = new VideoAlbumController();

router.get('/videoAlbum', videoAlbumController.getVideoAlbumsForFront);

module.exports = router;


