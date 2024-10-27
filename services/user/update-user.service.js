const User = require("../../models/user");
const {promises: fs} = require("fs");


class UpdateUserService {
    async updateUserById(req, res) {
        let  userId  = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                message: "User's id is required."
            })
        }
        const user = await User.findOne(userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            })
        }
        let updateUser = {...req.body};
        if (req.files && req.files.image) {
            let newImagePaths = (req.files.image || []).map((file) => file.path);
            if (user.img && user.img.length) {
                await this.deletePreviousImages(user.img);
            }
            updateUser.img = newImagePaths;
        }
        await user.findByIdAndUpdate(userId, {
            $set: updateUser,
        }, {
            new: true,
        })
        return res.status(201).send({
            message: "User updated successfully."
        })
    }
    async deletePreviousImages(previousImages) {
        for (const imagePath of previousImages) {
            try {
                await fs.unlink(imagePath);
                console.log(`Successfully deleted image: ${imagePath}`);
            } catch (error) {
                console.error(`Failed to delete image: ${imagePath}`, error);
            }
        }
    }
}


module.exports = UpdateUserService;