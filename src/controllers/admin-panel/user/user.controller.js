// Services
const GetAllUsersService = require('../../../services/admin-panel/user/get-users.service');
const CreateUsersService = require('../../../services/admin-panel/user/add-user.service');
const GetUserService = require('../../../services/admin-panel/user/get-user.service');
const UpdateUsersService = require('../../../services/admin-panel/user/update-user.service');
const DeleteUserService = require('../../../services/admin-panel/user/delete-user.service');


class UserController {
    async all(req, res) {
        const getAllUsersService = new GetAllUsersService();
        await getAllUsersService.getAllUsers(req, res);
    }

    async get(req, res, next) {
        try {
            const getUserService = new GetUserService();
            const User = await getUserService.getUserById(req);
            res.status(200).json(User);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const createUserService = new CreateUsersService();
            const newUser = await createUserService.addUser(req);
            return res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }

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