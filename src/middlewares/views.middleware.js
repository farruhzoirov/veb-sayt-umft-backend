const os = require('os');

const {Model} = require("../common/constants/models.constants");
const Logger = require("../models/logger/logger.model");
const {getModelsHelper} = require("../helpers/admin-panel/get-models.helper");


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
  const now = new Date();
  let earlier = new Date(now.getTime() - 300 * 1000)
  // This logic for calculating views. and if createdAt is greater than 5 min then we can increment again views.
  const checkLogger = await Logger.countDocuments({
    method: req?.method,
    url: req?.originalUrl,
    userAgent: req?.headers['user-agent'],
    ip: req?.ip,
    macAddresses: getMacAddress(),
    createdAt: {
      $gte: earlier, //5min
    },
  }) || 0

  if (checkLogger === 0) {
    try {
      for (const model of modelsForCalculatingViews) {
        if (req?.originalUrl?.startsWith(`/front/${model}`)) {
          const slug = req.params.slug;
          let modelToIncrementViews;
          if (model === Model.news.ref) modelToIncrementViews = getModelsHelper(Model.news.ref);
          if (model === Model.specialty.ref) modelToIncrementViews = getModelsHelper(Model.specialty.ref);
          if (model === Model.events.ref) modelToIncrementViews = getModelsHelper(Model.events.ref);

          await modelToIncrementViews.findOne(
              {slug},
              {$inc: {views: 1}},
              {new: true}
          )
          const logger = new Logger({
            method: req?.method,
            url: req?.originalUrl,
            userAgent: req?.headers["user-agent"],
            ip: req?.ip,
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

  next();
}

module.exports = {
  incrementViews,
}