const ProgramsService = require('../../services/frontend/programs.service');

class ProgramsController {
  constructor() {
    this.programsService = new ProgramsService();

    this.filterAndGetPrograms = this.filterAndGetPrograms.bind(this);
    this.getOneProgram = this.getOneProgram.bind(this);
  }

  async filterAndGetPrograms(req, res, next) {
    try {
      const programsList = await this.programsService.filterAndGetPrograms(req);
      res.status(200).json(programsList);
    } catch (err) {
      next(err);
    }
  }

  async getOneProgram(req, res, next) {
    try {
      const program = await this.programsService.getOneProgram(req);
      res.status(200).json(program);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProgramsController;