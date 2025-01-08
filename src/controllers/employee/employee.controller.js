const EmployeeService = require('../../services/employee/employee.service');

class EmployeeController {
    constructor() {
        this.employeeService = new EmployeeService();

        this.addEmployee = this.addEmployee.bind(this);
    }
    async addEmployee(req, res, next) {
        try {
            const employeeData = req.body;
            await this.employeeService.addEmployee(employeeData);
            res.status(200).json({
                ok: true,
                message: 'Employee added successfully',
            });
        } catch (err) {
            next(err)
        }
    }
}