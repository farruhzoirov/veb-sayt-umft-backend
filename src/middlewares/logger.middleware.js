const os = require('os');
const Logger = require("../models/logger/logger.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const {Model} = require("../common/constants/models.constants")
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

const logging = async (req, res, next) => {
  const startTime = Date.now();

  let user = null;

  if (req.headers?.authorization ?? req.headers?.authorization?.split(' ').at(1)) {
    let token = req.headers?.authorization.split(' ').at(1);
    try {
      let res = jwt.verify(token, config.JWT_SECRET_KEY);
      user = res.id || null;
    } catch (error) {
      user = null;
    }
  }
  let body = {...res.body};
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    let now = new Date()
    let earlier = new Date(now.getTime() - 60 * 1000)
    let later = new Date(now.getTime() + 60 * 1000)

    const check = await Logger.countDocuments({
      method: req.method,
      url: req.originalUrl,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      macAddresses: getMacAddress(),
      createdAt: {
        $gte: earlier,
        $lte: later,
      },
    }) || 0
    console.log('check', check)
    if (check === 0) {
      const logger = new Logger({
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: duration,
        macAddresses: getMacAddress(),
        body,
        user,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });
      try {
        await logger.save();
        for (const model of modelsForCalculatingViews) {
          if (req?.originalUrl?.startsWith(`/front/${model}`)) {
            console.log(model)
            const slug = req.params?.slug;
            console.log("Slug", slug)
            let modelToIncrementViews;
            if (model === Model.news.ref) modelToIncrementViews = getModelsHelper(Model.news.ref);
            if (model === Model.specialty.ref) modelToIncrementViews = getModelsHelper(Model.specialty.ref);
            if (model === Model.events.ref) modelToIncrementViews = getModelsHelper(Model.events.ref);

            await modelToIncrementViews.findOneAndUpdate(
                {slug},
                {$inc: {views: 1}},
                {new: true}
            )
          }
        }
      } catch (error) {
        console.error('Error saving logger:', error);
      }
    }
  })

  next();
}

module.exports = {
  logging
}