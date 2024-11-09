const {Router} = require('express');

const router = Router()

router.use('/auth', require("./routers/auth.route"));
router.use('/user', require("./routers/user.route"));
router.use('/statistic', require("./routers/statistics.route"));
router.use('/api', require("./routers/crud.route"));


module.exports = router;



