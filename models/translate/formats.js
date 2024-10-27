const { Schema } = require('mongoose')
const mongoose = require("mongoose");


// It may be Online, Offline or remote study.
const FormatsTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    format: {
        type: Schema.Types.ObjectId,
        ref: 'format',
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: "language",
        required: true,
    }
});


module.exports = mongoose.model('formatTranslate', FormatsTranslateSchema);