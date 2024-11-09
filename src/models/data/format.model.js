const { Schema } = require('mongoose')
const mongoose = require("mongoose");

// It may be Online, Offline or remote study.

// It may be Online, Offline or remote study.
const FormatsSchema = new Schema({

});


module.exports = mongoose.model('format', FormatsSchema);