const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const AdminPanelSwaggerDocument = YAML.load('./swagger/admin-panel-swagger.yaml');
const UiSwaggerDocument = YAML.load('./swagger/ui-swagger.yaml');

module.exports = (app) => {
  // Serve Admin Panel Swagger UI
  app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
    return swaggerUi.setup(AdminPanelSwaggerDocument)(req, res, next);
  });

  // Serve UI Swagger UI
  app.use('/api-frontend-docs', swaggerUi.serve, (req, res, next) => {
    return swaggerUi.setup(UiSwaggerDocument)(req, res, next);
  });
};
