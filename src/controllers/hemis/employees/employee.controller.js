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
            await this.fetchEmployeesService.fetchEmployees();
            res.status(200).json({
                ok: true,
                message: "Employees fetched or synced successfully",
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = EmployeeController;