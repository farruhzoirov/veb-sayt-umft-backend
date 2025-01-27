const {Schema, model} = require("mongoose");


const Logger = new Schema({
  method: { type: String, required: true },
  url: { type: String, required: true },
  statusCode: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  userAgent: { type: String },
  body: Object,
  ip: { type: String },
  macAddresses: Object
},{timestamps:true})

module.exports = model("logger", Logger);