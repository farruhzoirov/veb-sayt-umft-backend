const axios = require('axios');
const Language = require('../../models/settings/language.model');
const Department = require('../../models/data/department.model');
const DepartmentTranslate = require('../../models/translate/department.model');

class FetchDepartmentsService {
    async getDepartments(req, res) {
        try {

            const allDepartments = await Department.find().select().lean();
        } catch (error) {
            console.error('Error in getDepartments:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to synchronize departments',
                error: error.message
            });
        }
    }
}

module.exports = FetchDepartmentsService;
