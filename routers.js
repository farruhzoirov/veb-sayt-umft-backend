const {Router} = require('express')
const router = Router()

// foydalanuvchilar
router.use('/auth', require("./routers/auth.route"));
router.use('/user', require("./routers/user.route"));

router.use('/statistic', require("./routers/statistics.route"));
// router.use('/news', require("./routers/data/news"));
// router.use('/message', require("./routers/message"));
// router.use('/page', require("./routers/data/page"));
// router.use('/product', require("./routers/data/product"));

router.use('/api', require("./routers/crud.route"));
// router.use('/auth', require("./router/passport/authpassport"));

// router.use('/user', require("./router/user"));
// router.use('/todolist',require("./router/todolist"));

module.exports = router;



