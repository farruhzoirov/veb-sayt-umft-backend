const router = require('express').Router();

const DepartmentController = require('../controllers/departments/department.controller');

const departmentsController = new DepartmentController();

router.get('/hemis/fetch-department', departmentsController.fetchDepartments);

router.get('/get-department', departmentsController.getDepartment);

router.get('/get-departments', departmentsController.getAllDepartment);

router.put('/update-department', departmentsController.updateDepartment);


module.exports = router;