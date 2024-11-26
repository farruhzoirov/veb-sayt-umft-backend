const { Schema } = require('mongoose')
const mongoose = require("mongoose");

// It may be Online, Offline or remote study.

// It may be Online, Offline or remote study.
const FormatsSchema = new Schema({
    img: [],
    status: {
        type: Number,
        default: 1
    },
});


module.exports = mongoose.model('format', FormatsSchema);