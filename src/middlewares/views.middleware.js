const os = require('os');
const {Model} = require("../common/constants/models.constants");
const Logger = require("../models/logger/logger.model");
const {getModelsHelper} = require("../helpers/admin-panel/get-models.helper");

// Models for calculate views
const modelsForCalculatingViews = ['program', Model.news.ref, Model.events.ref];

function getMacAddress() {
  const networkInterfaces = os.networkInterfaces();
  const macAddresses = [];
  for (const [interfaceName, addresses] of Object.entries(networkInterfaces)) {
    for (const address of addresses) {
      if (address.mac && address.mac !== '00:00:00:00:00:00') {
        macAddresses.push({interface: interfaceName, mac: address.mac});
      }
    }
  }
  return macAddresses;
}

const incrementViews = async (req, res, next) => {
  const startTime = new Date();
  let earlier = new Date(startTime.getTime() - 24 * 60 * 60 * 1000);

  // This logic for calculating views. and if createdAt is greater than one day then we can increment again views.

  const checkLogger = await Logger.countDocuments({
    method: req?.method,
    url: req?.originalUrl,
    userAgent: req?.headers['user-agent'],
    ip: req?.ip,
    macAddresses: getMacAddress(),
    createdAt: {
      // ------------  To check createdAt is more than 1 day. --------------  //
      $gte: earlier,
    },
  }) || 0

  let body = {...res?.body};
  res.on('finish', async () => {
    if (checkLogger === 0) {
      try {
        for (const model of modelsForCalculatingViews) {
          if (req?.originalUrl?.startsWith(`/front/${model}`)) {
            const slug = req.params?.slug;
            const duration  = Date.now() - startTime;
            let modelToIncrementViews;
            if (model === Model.news.ref) modelToIncrementViews = getModelsHelper(Model.news.ref);
            if (model === Model.specialty.ref) modelToIncrementViews = getModelsHelper(Model.specialty.ref);
            if (model === Model.events.ref) modelToIncrementViews = getModelsHelper(Model.events.ref);

            await modelToIncrementViews.findOneAndUpdate(
                {slug},
                {$inc: {views: 1}},
                {new: true}
            )
            const logger = new Logger({
              method: req?.method,
              url: req?.originalUrl,
              userAgent: req?.headers["user-agent"],
              ip: req?.ip,
              statusCode: res.statusCode,
              responseTime: duration,
              body,
              macAddresses: getMacAddress(),
              createdAt: Date.now(),
            });
            await logger.save();
            break;
          }
        }
      } catch (error) {
        next(error);
      }
    }
  })
  next();
}

module.exports = {
  incrementViews,
}