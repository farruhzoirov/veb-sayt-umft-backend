const  Joi  =  require('joi');
const {ValidationError} = require("joi");

const userSchema = Joi.object({
    name: Joi.string().optional(),
    img: Joi.string().optional(),
    login: Joi.string().required(),
    password: Joi.string().min(3).required(),
    role: Joi.string().optional(),
});

module.exports =  async (req, res, next) => {
    try {
        await userSchema.validateAsync(req.body, {
            abortEarly: false
        });
        next()
    } catch (err) {
        if (err instanceof ValidationError) {
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