const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const MessengerSchema = new Schema({
    img: [],
    link: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
    }
})

module.exports = mongoose.model('messenger', MessengerSchema);