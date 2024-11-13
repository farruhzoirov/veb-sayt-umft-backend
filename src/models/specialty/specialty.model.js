const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const SpecialtySchema = new Schema({
    img: [],
    hemisId: {
        type: Number,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    degree: {
        type: Schema.Types.ObjectId,
        ref: 'degree',
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