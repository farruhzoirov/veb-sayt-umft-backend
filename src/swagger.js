const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const AdminPanelSwaggerDocument = YAML.load('./swagger/admin-panel-swagger.yaml');
const UiSwaggerDocument = YAML.load('../swagger/ui-swagger.yaml');


module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(AdminPanelSwaggerDocument));
    // app.use("/api-frontend-docs", swaggerUi.serve, swaggerUi.setup(UiSwaggerDocument));
}