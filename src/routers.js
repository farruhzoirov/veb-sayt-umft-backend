const router = require('express').Router();
// Routes for Admin Panel

   // Auth
router.use('/auth', require("./routers/auth.route"));

   // User
router.use('/user', require("./routers/user.route"));

  // Statistics
router.use('/statistic', require("./routers/statistics.route"));

  // For Main models
router.use('/api', require("./routers/crud.route"));

 // Departments
router.use('/department', require("./routers/hemis/departments.route"));

 //  -------- Hemis based apis ------
        // Specialties
router.use('/specialty', require("./routers/hemis/specialties.route"));

      // Employees
router.use('/employee', require("./routers/hemis/employees.route"));

     // Classifiers
router.use('/classifiers', require("./routers/hemis/classifiers.route"));




// Routers for the frontend

router.use('/front', require("./routers/frontend/"));

// Applicants

router.use('/submit', require("./routers/applicants.route"));

module.exports = router;



