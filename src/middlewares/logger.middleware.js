const os = require('os');
const Logger = require("../models/logger/logger.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

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
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    const MINUTE =  60 * 1000;

    const check = await Logger.exists({
      method: req.method,
      url: req.originalUrl,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      macAddresses: getMacAddress(),
      createdAt: {
        $gte: Date.now() - MINUTE,
        $lte: Date.now() + MINUTE,
      },
    }) || 0
    if (!check) {
      const logger = new Logger({
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: duration,
        macAddresses: getMacAddress(),
        user,
        body: req.body,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });
      try {
        await logger.save();
      } catch (error) {
        console.error('Error saving logger:', error);
        next(error);
      }
    }
  })
  next();
}

module.exports = {
  logging
}