const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');


class AuthMiddleware {
    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET_KEY); 
    }
    async auth(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    ok: false,
                    message : "User didn't register"
                });
            }
            req.user = this.verifyToken(token);
            next();
        } catch (e) {
            console.error("Auth Middleware", e);
            res.status(500).json({
                ok: false,
                message: "Internal server error"
            });
        }
    }
    async adminMiddleware(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({
                    ok: false,
                    message: "Token not found."
                });
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    ok: false,
                    message: "Auth error"
                });
            }
            req.user = this.verifyToken(token);
            const user = await User.findById(req.user._id).lean();
            if (user.role !== 'admin') {
                return res.status(401).json({
                    ok: false,
                    message: 'Not authorized as an admin.'
                });
            }
            next();
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new AuthMiddleware();
