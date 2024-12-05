const Joi = require('joi');
const {ValidationError: ValidateError} = require("joi");

const StatusSchema = Joi.object({
    status: Joi.number().required(),
});


module.exports = async (req, res, next) => {
    try {
        await StatusSchema.validateAsync(req.body);
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