const EmployeesService = require('../../services/frontend/employee.service');

class EmployeeController {
  constructor() {
    this.employeesService = new EmployeesService();


    this.getEmployeesForFront = this.getEmployeesForFront.bind(this);
  }

  async getEmployeesForFront(req, res, next) {
    try {
      const employees = await this.employeesService.getEmployeesForFront(req);
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController;

