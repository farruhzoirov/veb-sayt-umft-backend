const User = require("../../../models/user/user.model");
const mongoose = require("mongoose");
const BaseError = require("../../../errors/base.error");


class GetUserService {
    async getUserById(req) {
            const userId = req.params.userId;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw BaseError.BadRequest("Invalid user id");
            }
            const getOneUserById = await User.findOne({_id: userId})
            if (!getOneUserById) {
                throw BaseError.BadRequest("User does not exist");
            }
            return getOneUserById;
    }
}


module.exports = GetUserService;