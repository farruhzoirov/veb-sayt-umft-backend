const { Schema } = require('mongoose')
const mongoose = require("mongoose");

const UniversitySchema = new Schema({
    img: [],
    slug: {
        type: String,
    },
    status: {
        type: Number,
        default: 1
    }
})


module.exports = mongoose.model('university', UniversitySchema);