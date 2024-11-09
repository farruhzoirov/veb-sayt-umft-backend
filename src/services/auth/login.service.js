const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require('dotenv').config();

class LoginService {
    async login(req, res) {
        try {
            let { login, password } = req.body
            login = login.toLowerCase();
            let user = await User.findOne({ login }).select(['login', 'name', 'role', 'password'])
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найдено!" })
            }
            const isPassValid = await bcrypt.compare(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({ message: "Пароль не правильно!" });
            }
            let { name, role } = user
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
            res.status(200).send({
                token,
                user: {
                    name,
                    role,
                    login: user.login
                }
            })
        } catch (e) {
            console.log(e);
            res.status(500).send({
                message: "Internal server error"
            })
        }
    }
}


module.exports = LoginService;