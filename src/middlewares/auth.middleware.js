const jwt = require('jsonwebtoken');

const config = require('../config/config');

const Roles = require('../common/constants/roles.constants')
const {decode} = require("jsonwebtoken");

class AuthMiddleware {
    async universalAccessMiddleware(req, res, next) {
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
                return res.status(400).json({
                    ok: false,
                    message: "Auth bearer token is missing"
                });
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    ok: false,
                    message: "no token provided"
                });
            }
            const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
            if (!decoded.role) {
                return res.status(401).json({
                    ok: false,
                    message: "Unauthorized, invalid token"
                })
            }
            if (!Roles.hasOwnProperty(decoded.role)) {
                return res.status(403).json({
                    ok: false,
                    message: "Forbidden,you don't have access"
                })
            }
            req.user = decoded;
            next();
        } catch (e) {
            console.error(e);
            res.status(401).json({
                ok: false,
                message: "Unauthorized, token is invalid or expired"
            });
        }
    }

    async adminMiddleware(req, res, next) {
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
                return res.status(400).json({
                    ok: false,
                    message: "Auth bearer token is missing"
                });
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    ok: false,
                    message: "no token provided"
                });
            }
            const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
            if (!decoded.role) {
                return res.status(401).json({
                    ok: false,
                    message: "Unauthorized, invalid token"
                })
            }
            if (decoded.role !== Roles.admin) {
                return res.status(403).json({
                    ok: false,
                    message: "Forbidden,you don't have access"
                })
            }
            req.user = decoded;
            next();
        } catch (e) {
            console.error(e);
            res.status(401).json({
                ok: false,
                message: "Unauthorized, token is invalid or expired"
            });
        }
    }
}

module.exports = new AuthMiddleware();
