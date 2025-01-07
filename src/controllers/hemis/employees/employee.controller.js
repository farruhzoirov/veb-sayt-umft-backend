const FetchEmployeesService = require("../../../services/hemis/employee/fetch-employees.service");

class EmployeeController {
    constructor() {
        // Service
        this.fetchEmployeesService = new FetchEmployeesService();
        // Bind
        this.fetchEmployee = this.fetchEmployee.bind(this);
    }

    async fetchEmployee(req, res) {
        const employeesData = await this.fetchEmployeesService.fetchEmployees();
        res.status(200).json(employeesData);
    }
}

module.exports = EmployeeController;