const User = require("../../models/user/user.model");


class UpdateUserService {
    async updateUserById(req, res) {
        let userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                message: "User's id is required."
            })
        }
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            })
        }
        const updateUser = {...req.body};
        await User.findByIdAndUpdate(userId,
            {$set: updateUser}, {new: true})
        return res.status(201).send({
            data: updateUser
        })
    }
}


module.exports = UpdateUserService;