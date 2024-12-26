const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const PartnerSchema = new Schema({
    img: [],
    status: {
        type: Number,
        default: 1
    },
    slug: {
        type: String,
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('partners', PartnerSchema);