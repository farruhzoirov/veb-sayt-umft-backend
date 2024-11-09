// Services
const GetAllUsersService = require('../services/user/get-users.service');
const CreateUsersService = require('../services/user/add-user.service');
const GetUserService = require('../services/user/get-user.service');
const UpdateUsersService = require('../services/user/update-user.service');
const DeleteUserService = require('../services/user/delete-user.service');

class UserController {
    async all(req, res) {
        const getAllUsersService = new GetAllUsersService();
        await getAllUsersService.getAllUsers(req, res);
    }

    async get(req, res) {
        const getUserService = new GetUserService();
        await getUserService.getUser(req, res);
    }

    async create(req, res) {
        const createUserService = new CreateUsersService();
        await createUserService.addUser(req, res);
    }

    async update(req, res) {
        const updateUserService = new UpdateUsersService();
        await updateUserService.updateUserById(req, res);
    }

    async delete(req, res) {
        const deleteUserService = new DeleteUserService();
        await deleteUserService.deleteUserById(req, res);
    }
}

module.exports = UserController;