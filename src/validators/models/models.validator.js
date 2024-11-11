const modelSchemas = require('../schemas/models.schema');

const validateModel = async (req, res, next) => {
    try {
        // 1. Validate model parameter
        const model = req.params.model;
        if (!model) {
            return res.status(400).json({
                ok: false,
                message: 'Model parameter is required'
            });
        }
        // 2. Get and validate schema exists
        const schema = modelSchemas[model];
        if (!schema) {
            return res.status(400).json({
                ok: false,
                message: `Schema not found for model: ${model}`
            });
        }
        // 3. Validate request body is present
        if (!req.body || !Object.keys(req.body).length) {
            return res.status(400).json({
                ok: false,
                message: 'Request body is empty'
            });
        }
        // 4. Validate body against schema
        await schema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        next();
    } catch (error) {
        // Handle validation errors
        if (error.isJoi) {
            return res.status(400).json({
                ok: false,
                message: 'Validation failed',
                errors: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }
        // Handle unexpected errors
        console.error('Validation middleware error:', error);
        return res.status(500).json({
            ok: false,
            message: 'Internal server error during validation'
        });

    }
};

module.exports = validateModel;