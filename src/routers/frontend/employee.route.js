const router = require('express').Router();

// Controllers
const EmployeeController = require('../../controllers/frontend/employee.controller');
const employeeController = new EmployeeController();


router.get('/employee', employeeController.getEmployeesForFront);

router.get('/news/:slug', employeeController.getOneEmployeeForFront);


module.exports = router;


