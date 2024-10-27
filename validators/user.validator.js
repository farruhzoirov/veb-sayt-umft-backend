const  Joi  =  require('joi');

const userSchema = Joi.object({
    login: Joi.string().email().required(),
    password: Joi.string().min(5).required()
});


module.exports =  async (req, res, next) => {
    try {
        const value = await userSchema.validateAsync(req.body);
        next()
    } catch (err) {
        if (err) {
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