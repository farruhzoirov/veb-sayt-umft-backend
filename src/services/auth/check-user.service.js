const decoded = require("../../helpers/decoded.helper");
const User = require("../../models/user/user.model");

class CheckUserService {
    async checkUser(req, res) {
        try {
            let dec = decoded(req);
            const user = await User.findOne({ _id: dec.id }).select(['login', 'name', 'role'])
            if (!user) {
                return res.status(401).json({ message:  "User didn't register" })
            }
            res.status(200).json(user);
        } catch (e) {
            return res.status(401).json({ message: "User didn't register" })
        }
    }
}

module.exports = CheckUserService;