const User = require("../../../models/user/user.model");
const {promises: fs} = require("fs");

class DeleteUserService {
  async deleteUserById(req, res) {
    try {
      const {userId} = req.body;
      if (!userId) {
        return res.status(400).send({message: "User ID is required."});
      }
      const user = await User.findOne(userId);
      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "User not found."
        });
      }
      await this.deletePreviousImages(user.img);
      await User.deleteOne(userId);
      return res.status(200).json({
        ok: true,
        message: "User deleted successfully."
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: "There is issue with deleting user"
      });
    }
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

module.exports = DeleteUserService;
