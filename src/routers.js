const router = require('express').Router();
// Routes for Admin Panel

   // Auth
router.use('/auth', require("./routers/admin-panel/auth.route"));

   // User
router.use('/user', require("./routers/admin-panel/user.route"));

  // Statistics
router.use('/statistic', require("./routers/admin-panel/statistics.route"));

  // For Main models
router.use('/api', require("./routers/admin-panel/crud.route"));

 // Departments
router.use('/department', require("./routers/admin-panel/hemis/departments.route"));

 //  -------- Hemis based apis ------
        // Specialties
router.use('/specialty', require("./routers/admin-panel/hemis/specialties.route"));

      // Employees
router.use('/employee', require("./routers/admin-panel/hemis/employees.route"));

     // Classifiers
router.use('/classifiers', require("./routers/admin-panel/hemis/classifiers.route"));




// Routers for the frontend

router.use('/front', require("./routers/frontend/"));

// Applicants

router.use('/submit', require("./routers/applicants.route"));

module.exports = router;



