const User = require("../../../models/user/user.model");
const bcrypt = require("bcryptjs");
const Roles = require("../../../common/constants/roles.constants");
// Config
const config = require("../../../config/config");

class AddAdminService {
  async addFirstAdmin(req, res) {
    try {
      let isExistsAdmin = await User.findOne({role: Roles.admin});
      if (isExistsAdmin) {
        isExistsAdmin.password = await bcrypt.hash(config.ADMIN_PASSWORD, 10);
        let _id = isExistsAdmin._id;
        await User.findByIdAndUpdate(_id, isExistsAdmin, {
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
          role: Roles.admin,
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