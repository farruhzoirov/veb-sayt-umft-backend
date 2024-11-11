const Language = require('../../models/settings/language.model');
const Department = require('../../models/data/department.model');
const DepartmentTranslate = require('../../models/translate/department.model');
const { default: mongoose } = require('mongoose');

class UpdateDepartmentsService {
    async updateDepartments(req, res) {
        try {
            const departmentId = req.params.departmentId;
            if (!mongoose.Types.ObjectId.isValid(departmentId)) {
                return res.status(400).json({
                    ok: false,
                    message: 'Invalid departmentId'
                });
            }
            const updatedData = { ...req.body } || {};
            const findDepartment = Department.findOne({ _id: departmentId }).lean();
            if (!findDepartment) {
                return res.status(404).json({
                    ok: false,
                    message: 'Department not found'
                });
            }
            let files = req.files || [];
            if (files && files.image) {
                let imagePaths = (files.image).map((file) => file.path);
                await findDepartment.updateOne(
                    {
                        _id: departmentId
                    },
                    {
                        $set: {
                            img: imagePaths,
                            ...updatedData
                        }
                    }
                )
            }
            return res.status(200).json({
                success: true,
                message: 'Departments updated successfully'
            });
        } catch (error) {
            console.error('Error in updateDepartments:', error);
            return res.status(500).json({
                ok: false,
                message: 'Failed to update departments',
                error: error.message
            });
        }
    }
}

module.exports = UpdateDepartmentsService;
