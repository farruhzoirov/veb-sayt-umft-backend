const User = require("../../models/user/user.model");
const UserTranslate = require("../../models/translate/user.model");

class CreateUserService {
    async addUser(req, res) {
        try {
            const {userId} = req.body;
            if (!userId) {
                let files = req.files || [];
                let imagePaths;
                if (req.files && req.files.image) {
                    imagePaths = (files.image || []).map((file) => file.path);
                }
                const newUser = new User({
                    img: imagePaths | [],
                    ...req.body,
                })
                await newUser.save();
                if (req.body.translate) {
                    let findUserTranslate = await UserTranslate.findOne({
                        "user": newUser._id,
                        language: req.body.language,
                    })
                    if (findUserTranslate) {
                        return res.status(400).json({
                            ok: false,
                            message: "User already exists with this language"
                        })
                    }
                    const newUserTranslate = new UserTranslate({
                        "user": newUser._id,
                        ...req.body.translate,
                    });
                    await newUserTranslate.save();
                    return res.status(201).json({
                        ok: true,
                        message: "User created successfully",
                    })
                }
            }

            let findUser = await User.findOne({
                _id: userId
            });

            if (!findUser) {
                return res.status(404).send({
                    ok: false,
                    message: "User not found"
                })
            }
            if (req.body.translate) {
                let findUserTranslate = await UserTranslate.findOne({
                    "user": findUser._id,
                    language: req.body.language,
                })
                if (findUserTranslate) {
                    return res.status(400).json({
                        ok: false,
                        message: "Translate  already exists for this user with this language"
                    })
                }
                const newUserTranslate = new UserTranslate({
                    "user": findUser?._id,
                    ...req.body.translate,
                })
                await newUserTranslate.save();
                return res.status(201).json({
                    message: 'User created successfully.'
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
}

module.exports = CreateUserService;