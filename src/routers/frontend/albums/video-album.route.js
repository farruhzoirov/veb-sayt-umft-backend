const router = require('express').Router();

// Controllers
const VideoAlbumController = require('../../../controllers/frontend/albums/video-album.controller');
const videoAlbumController = new VideoAlbumController();


router.get('/video-album', videoAlbumController.getVideoAlbumsForFront);


module.exports = router;


