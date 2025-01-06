const BaseError = require('../errors/base.error');

module.exports = (err, req, res, next) => {
    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            ok: false,
            message: err.message,
            errors: err.errors,
        });
    }
    console.error("Unhandled Error:", err);
    return res.status(500).json({
        ok: false,
        message: err.message,
        errors: err.errors,
    });
}





