const EmployeesService = require('../../services/frontend/employee.service');

class EmployeeController {
  constructor() {
    this.employeesService = new EmployeesService();

    // Bind
    this.getEmployeesForFront = this.getEmployeesForFront.bind(this);
    this.getOneEmployeeForFront = this.getOneEmployeeForFront.bind(this);
  }

  async getEmployeesForFront(req, res, next) {
    try {
      const employees = await this.employeesService.getEmployeesForFront(req);
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }

  async getOneEmployeeForFront(req, res, next) {

  }
}

module.exports = EmployeeController;

