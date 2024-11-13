const User = require("../../models/user/user.model");


class GetUserService {
    async getUser(req, res) {
        try {
            let userId = req.params.userId;
            let getOne = await User.findOne({ _id: userId })
            res.json({
                ok: true,
                data: getOne
            });
        } catch (error) {
            console.log(error);
            res.json({msg: 'xatolik mavjud...'})
        }
    }
}


module.exports = GetUserService;