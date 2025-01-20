// ./routers/frontend/index.js
const express = require('express');
const router = express.Router();

router.use(require('./news.route'));
router.use(require('./events.route'));
router.use(require('./programs.route'));
router.use(require('./socials.route'));
router.use(require('./models.route'));

module.exports = router;
