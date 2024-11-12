const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

// Partners
const PartnerTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    partners: {
        type: Schema.Types.ObjectId,
        ref: "partners",
        required: true,
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: "language",
        required: true,
    }
});


module.exports = mongoose.model('partnerTranslate', PartnerTranslateSchema);