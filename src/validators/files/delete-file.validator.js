const Joi = require('joi');
const ValidateError = require('joi').ValidationError;

const FilePathSchema = Joi.object({
    filePath: Joi.string().required(),
})

module.exports = async (req, res, next) => {
    try {
        await FilePathSchema.validateAsync(req.body);
        next();
    } catch (err) {
        if (err instanceof ValidateError) {
            res.status(400).send({
                ok: false,
                error: err?.details[0]?.message,
            });
        } else {
            res.status(500).send({
                ok: false,
                error: "Internal server error",
            });
        }
    }
}