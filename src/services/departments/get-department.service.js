const DepartmentTranslate = require('../../models/translate/department.model');

class GetDepartmentService {
  async getDepartment(req, res) {
    try {
      const departmentId = req.params.departmentId;
      const allDepartments = await DepartmentTranslate.findOne({_id: departmentId});
      return res.status(200).json({
        ok: true,
        data: allDepartments
      })
    } catch (error) {
      console.error('Error in getDepartments:', error);
      return res.status(500).json({
        ok: false,
        message: 'Failed to synchronize departments',
        error: error.message
      });
    }
  }
}

module.exports = GetDepartmentService;
