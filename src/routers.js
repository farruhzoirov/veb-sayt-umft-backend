const router = require('express').Router();

// Auth
router.use('/auth', require("./routers/auth.route"));

// User
router.use('/user', require("./routers/user.route"));

// Statistics
router.use('/statistic', require("./routers/statistics.route"));

// For Main models
router.use('/api', require("./routers/crud.route"));

// Applicants
router.use('/submit', require("./routers/applicants.route"));

// Departments
router.use('/department', require("./routers/hemis/departments.route"));

// Specialties
router.use('/specialty', require("./routers/hemis/specialties.route"));

router.use('/employee', require("./routers/hemis/employees.route"));

// Classifiers
router.use('/classifiers', require("./routers/hemis/classifiers.route"));

module.exports = router;



