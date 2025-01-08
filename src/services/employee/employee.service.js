const Employee = require('../../models/data/employee.model');
const SocialSet = require('../../models/socialSet/socialSet.model');

class EmployeeService {
    constructor() {
    }

    async addEmployee(employeeData) {
        const socials = employeeData.socials;
        const socialLinks = [];
        if (Array.isArray(socials)) {
            for (const social of socials) {
                const newSocialSet = new SocialSet({
                    ...social,
                    university: false
                });
                await newSocialSet.save();
                socialLinks.push(newSocialSet._id);
            }
        }
        employeeData.socialLinks = socialLinks;
        const newEmployee = new Employee({
            ...employeeData
        });
        await newEmployee.save();
    }
}

module.exports = EmployeeService