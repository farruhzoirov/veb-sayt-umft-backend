const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const SpecialtySchema = new Schema({
  img: [],
  code: {
    type: Number,
    required: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'department',
  },
  status: {
    type: Number,
    default: 1
  }
})


module.exports = mongoose.model('specialty', SpecialtySchema);