const jwt = require('jsonwebtoken');

function decodedHelper(req, res) {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "Auth error" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    return decoded;
}

module.exports = decodedHelper