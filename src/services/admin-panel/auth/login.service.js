const User = require("../../../models/user/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../config/config");

class LoginService {
  async login(req, res) {
    try {
      let {login, password} = req.body
      let user = await User.findOne({login: login}).select(['login', 'password', 'name', 'role'])
      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "User not found"
        })
      }
      const isPassValid = await bcrypt.compare(password, user.password)
      if (!isPassValid) {
        return res.status(400).json({message: "Password is incorrect"});
      }
      const {name, role} = user
      const token = jwt.sign({id: user._id, role: user.role}, config.JWT_SECRET_KEY,
          {
            expiresIn: "1d"
          })
      res.status(200).json({
        token,
        user: {
          name,
          role
        }
      })
    } catch (e) {
      console.log(e);
      res.status(500).send({
        message: "Internal server error"
      })
    }
  }
}


module.exports = LoginService;