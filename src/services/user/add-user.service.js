const User = require("../../models/user/user.model");
const bcrypt = require('bcryptjs');
const BaseError = require("../../errors/base.error");

class CreateUserService {
    async addUser(req) {
        const isUserExists = await User.findOne({login: req.body.login});
        if (isUserExists) {
            throw BaseError.BadRequest("User already exists");
        }
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name: req.body.name,
            login: req.body.login,
            password: hashedPassword,
            role: req.body.role,
            img: req.body.img ? req.body.img : [],
        })
        await newUser.save();
        return newUser;
    }
}


module.exports = CreateUserService;