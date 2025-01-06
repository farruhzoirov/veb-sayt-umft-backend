// Services
const FetchDepartmentsService = require('../../../services/hemis/departments/fetch-departments.service');


class DepartmentController {
    constructor() {
        this.fetchDepartmentsService = new FetchDepartmentsService();
        // Bind
        this.fetchDepartments = this.fetchDepartments.bind(this);
    }
    async fetchDepartments(req, res, next) {
        try {
            await this.fetchDepartmentsService.fetchDepartments(req, res);
            res.status(200).json({
                ok: true,
                message: "Departments were fetched or synced successfully",
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = DepartmentController