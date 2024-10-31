const { Schema, model } = require('mongoose')
const mongoose = require("mongoose");

const UniversitySchema = new Schema({
    img: [],
    status: {
        type: Number,
        default: 1
    }
})


module.exports = mongoose.model('university', UniversitySchema);