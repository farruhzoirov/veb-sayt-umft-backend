const DepartmentTranslate = require('../../../models/translate/department.model');

class GetDepartmentsService {
  async getDepartments(req, res) {
    try {
      let page = req.query.page || 1;
      let limit = req.query.limit || 20;
      let select = req.query.select || [];
      const skip = (page - 1) * limit;

      const allDepartments = await DepartmentTranslate.find()
        .select(select.toString())
        .skip(skip)
        .limit(limit)
        .populate('department', 'code, hemisId, img, structureType, active')
        .lean();
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

module.exports = GetDepartmentsService;

