const router = require('express').Router();
const authMiddleware = require('../../../middlewares/auth.middleware');

const EmployeesController = require('../../../controllers/admin-panel/hemis/employees/employee.controller');

const employeesController = new EmployeesController();

router.get('/fetch-employees',  employeesController.fetchEmployee);


module.exports = router;