const axios = require('axios');
const Language = require('../../models/settings/language.model');
const Department = require('../../models/data/department.model');
const DepartmentTranslate = require('../../models/translate/department.model');

class GetDepartmentsService {
    async getDepartments(req, res) {
        try {
            const language = await Language.findOne({slug: 'uz'} );
            const languageId = language ? language._id : null;

            // --------------- Fetch departments from the API -------------------
            const response = await axios.get('');  // Replace with actual API URL
            const departments = response.data;

            if (!Array.isArray(departments)) {
                throw new Error('Departments must be an array');
            }

            if (!departments.translate || !departments.translate.name) {
                throw new Error('For translate fields are requred');
            }

            const existingDepartments = await Department.find().lean();
            const existingIds = existingDepartments.map(dep => dep.hemisId);
            const newDepartments = departments.filter(dep => !existingIds.includes(dep.id));
            const updatedDepartments = departments.filter(dep => existingIds.includes(dep.id));
            const removedDepartmentIds = existingDepartments.filter((dep) => !departments.some(d => dep.hemisId === d.id)).map(dep => dep.id);

            const newDepartmentPromises = newDepartments.map(async (department) => {
                const savedDepartment = await new Department({
                    code: department.code,
                    hemisId: department.id,
                    structureType: department.structureType,
                    active: department.active,
                }).save()

                await new DepartmentTranslate({
                    name: department.translate.name,
                    department: savedDepartment._id,
                    language: languageId
                })
            });

            const updateDepartmentPromises = updatedDepartments.map(async (department) => {
                const updatedDepartment = Department.findOneAndUpdate(
                    {
                        hemisId: department.id
                    },
                    {
                        code: department.code,
                        structureType: department.structureType,
                        active: department.active,
                    },
                    {
                        new: true
                    }
                );
                await DepartmentTranslate.findOneAndUpdate(
                    { department: updatedDepartment._id },
                    { name: department.translate.name },
                    { upsert: true, new: true }
                );
            });
            const deleteDepartmentPromises = removedDepartmentIds.map(async id => {
                await Department.findByIdAndDelete(id);
                await DepartmentTranslate.deleteMany({ departmentId: id });
            });

            const allDepartments = await Promise.all([
                ...newDepartmentPromises,
                ...updateDepartmentPromises,
                ...deleteDepartmentPromises
            ]);
            return res.json({
                success: true,
                data: allDepartments,
                message: 'Departments synchronized successfully'
            });
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

module.exports = GetDepartmentsService;
