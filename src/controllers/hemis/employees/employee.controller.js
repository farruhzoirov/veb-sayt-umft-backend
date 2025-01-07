const FetchEmployeesService = require("../../../services/hemis/employee/fetch-employees.service");

class EmployeeController {
    constructor() {
        // Service
        this.fetchEmployeesService = new FetchEmployeesService();
        // Bind
        this.fetchEmployee = this.fetchEmployee.bind(this);
    }

    async fetchEmployee(req, res, next) {
        try {
            const employeesData = await this.fetchEmployeesService.fetchEmployees();
            res.status(200).json(employeesData);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = EmployeeController;