const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const SpecialtyTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    specialty: {
        type: Schema.Types.ObjectId,
        ref: 'department',
    },
    status: {
        type: Number,
        default: 1
    }
})


module.exports = mongoose.model('specialtyTranslate', SpecialtyTranslateSchema);