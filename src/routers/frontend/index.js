// ./routers/frontend/index.js
const express = require('express');
const router = express.Router();

router.use(require('./news.route'));
router.use(require('./partner.route'));

// Add other routes here if needed
module.exports = router;
