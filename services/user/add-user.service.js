const User = require("../../models/user");

class CreateUserService {
    async addUser(req, res) {
        try {
            const { name, login, phone, password, language } = req.body;
            if (!name || !login || !phone || !password || !language) {
                return res.status(400).json({
                    ok: false,
                    message: "Invalid data"
                })
            }
            let findUser = await User.findOne(login);
            if (findUser) res.status(400).json({
                message: "User already exists"
            });
            let files = req.files || [];
            let imagePaths;
            if (req.files && req.files.image) {
                imagePaths = (files.image || []).map((file) => file.path);
            }
            let userCreate = new User({
                ...req.body,
                img: imagePaths || []
            });
            await userCreate.save()
            return res.status(201).json({
                message: 'User created successfully.'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
}

module.exports = CreateUserService;