// ./routers/frontend/index.js
const express = require('express');
const router = express.Router();

router.use(require('./news.route'));
router.use(require('./partner.route'));
router.use(require('./socials.route'));

// Add other routes here if needed
module.exports = router;
