require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/user");
const decoded = require('../helpers/decoded.helper');

class AuthController {
    async addAdmin(req, res) {
        try {
            let isAdmin = await User.findOne({role: 'admin' });
            if (isAdmin) {
                const hashPass = await bcrypt.hash('umft2024', 10)
                isAdmin.password = hashPass
                let _id = isAdmin._id;
                await User.findByIdAndUpdate(_id, isAdmin, {
                    new: true,
                });
                res.send({ message: "Admin updated successfully." });
            } else {
                const hashPass = await bcrypt.hash('umft2024', 10)
                let admin =  new User({ login: 'admin2024@gmail.com', password: hashPass, role: 'admin', name: 'Admin' , phone: "+998974072204"})
                await admin.save();
                res.status(201).send({ message: "Admin created successfully." });
            }
        } catch (e) {
            console.log("Add admin", e);
            res.status(500).send({ message: "Internal server error" });
        }
    }
    async login(req, res) {
        try {
            let { login, password } = req.body
            login = login.toLowerCase()
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
            res.status(500).send({ message: "Internal server error" })
        }
    }
    async checkUser(req, res) {
        try {
            let dec = decoded(req)
            const user = await User.findOne({ _id: dec.id }).select(['login', 'name', 'role'])
            if (!user) {
                return res.status(401).json({ message:  "User didn't register" })
            }
            res.status(200).json(user)
        } catch (e) {
            return res.status(401).json({ message: "User didn't register" })
        }
    }
}

module.exports = AuthController