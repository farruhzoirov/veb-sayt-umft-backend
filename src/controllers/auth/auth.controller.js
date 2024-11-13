// Services
const AddAdminService = require('../../services/auth/add-admin.service');
const LoginService = require('../../services/auth/login.service');
const CheckUserService = require('../../services/auth/check-user.service');


class AuthController {
    async addAdmin(req, res) {
        const addAdminService = new AddAdminService();
        await addAdminService.addAdmin(req, res);
    }
    async login(req, res) {
        const loginService = new LoginService();
        await loginService.login(req, res);
    }
    async checkUser(req, res) {
        const checkUserService = new CheckUserService();
        await checkUserService.checkUser(req, res);
    }
}




module.exports = AuthController