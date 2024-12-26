const { Schema } = require('mongoose')
const mongoose = require("mongoose");


// It may be Online, Offline or remote study.
const FormatsSchema = new Schema({
    img: [],
    status: {
        type: Number,
        default: 1
    },
    slug: {
        type: String,
        required: [true, "slug is required"]
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('format', FormatsSchema);