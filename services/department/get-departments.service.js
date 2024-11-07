const axios = require('axios');
const Department = require('../../models/data/department.model');

class GetDepartmentsService {
    async getDepartments(req, res) {
        try {
            const response = await axios.get('');
            const departments = response.data;
            const departmentPromises = departments.map((department) => {
                return new Department({
                    code: department.code,
                    hemisId: department.id,
                    structureType: department.structureType,
                    active: department.active,
                }).save()
            })
            const savedDepartments = await Promise.all(departmentPromises);
            return {
                success: true,
                data: savedDepartments,
                message: 'Departments fetched and saved successfully'
            };
        } catch (error) {
            console.error('Error in getDepartments:', error);
            throw {
                success: false,
                error: error.message,
                message: 'Failed to fetch and save departments'
            };
        }
    }
}