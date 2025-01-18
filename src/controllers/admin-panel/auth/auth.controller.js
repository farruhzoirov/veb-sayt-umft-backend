// Services
const AddAdminService = require('../../../services/admin-panel/auth/add-admin.service');
const LoginService = require('../../../services/admin-panel/auth/login.service');
const CheckUserService = require('../../../services/admin-panel/auth/check-user.service');


class AuthController {
  async addFirstAdmin(req, res) {
    const addAdminService = new AddAdminService();
    await addAdminService.addFirstAdmin(req, res);
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