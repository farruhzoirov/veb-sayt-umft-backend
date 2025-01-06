const User = require("../../models/user/user.model");
const bcrypt = require("bcryptjs");

// Config
const config = require("../../config/config");

class AddAdminService {
    async addFirstAdmin(req, res) {
        try {
            let isAdmin = await User.findOne({ role: 'admin' });
            if (isAdmin) {
                isAdmin.password = await bcrypt.hash(config.ADMIN_PASSWORD, 10);
                let _id = isAdmin._id;
                await User.findByIdAndUpdate(_id, isAdmin, {
                    new: true,
                });
                res.status(200).json({
                    ok: true,
                    message: "Admin updated successfully."
                });
            } else {
                const hashPass = await bcrypt.hash(config.ADMIN_PASSWORD, 10);
                const admin = new User({
                    login: config.ADMIN_USERNAME,
                    password: hashPass,
                    role: 'admin',
                    name: 'Admin',
                });
                await admin.save();
                res.status(201).json({
                    ok: true,
                    message: "Admin created successfully."
                });
            }
        } catch (e) {
            console.log("Adding admin", e);
            res.status(500).send({
                    ok: false,
                    message: "Internal server error"
                }
            );
        }
    }
}

module.exports = AddAdminService;