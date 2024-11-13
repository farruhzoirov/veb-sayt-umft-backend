const router = require('express').Router();
const upload = require('../helpers/uploads/upload-models.helper')


const DepartmentController = require('../controllers/departments/department.controller');

const departmentsController = new DepartmentController();

router.get('/hemis/fetch-department', departmentsController.fetchDepartments);

router.get('/get-department', departmentsController.getDepartment);

router.get('/get-departments', departmentsController.getAllDepartment);

// router.put('/update-department', upload.fields[{name: 'image', maxCount: 2}], departmentsController.updateDepartment);


module.exports = router;