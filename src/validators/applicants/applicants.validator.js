const Joi = require('joi');
const ValidateError = require('joi').ValidationError;

const ApplicantSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    slug: Joi.string().required(),
})


module.exports = async (req, res, next) => {
    try {
        await ApplicantSchema.validateAsync(req.body);
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