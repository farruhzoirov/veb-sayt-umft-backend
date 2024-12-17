const router = require('express').Router();
const upload = require('../utils/uploads/upload-models.util')
const authMiddleware = require('../middlewares/auth.middleware');


const DepartmentController = require('../controllers/departments/department.controller');

const departmentsController = new DepartmentController();

router.get('/fetch-departments', authMiddleware.adminMiddleware, departmentsController.fetchDepartments);


router.get('/get-department/:id', authMiddleware.adminMiddleware, departmentsController.getDepartment);


router.get('/get-departments', authMiddleware.adminMiddleware, departmentsController.getAllDepartment);

router.put('/update-department/:departmentId', authMiddleware.adminMiddleware, upload.fields([
    {name: 'image', maxCount: 1}
]), departmentsController.updateDepartment);


module.exports = router;