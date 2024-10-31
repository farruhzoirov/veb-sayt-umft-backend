const modelSchemas = require('../schemas/models.schema');

const validateModel = async (req, res, next) => {
    const model = req.params.model;
    console.log(model)
    if (!model) {
        return res.status(400).json({
            ok: false,
            message: 'model not provided'
        })
    }
    const schema = modelSchemas[model];
    if (!schema) {
        return res.status(400).json({
            ok: false,
            message: `No schema found for validation: ${model}`
        })
    }
    try {
        await schema.validateAsync(req.body);
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


module.exports = validateModel;
