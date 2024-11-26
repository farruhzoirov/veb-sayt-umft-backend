const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const PricesSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    format: {
        type: Schema.Types.ObjectId,
        ref: 'format',
    },
    degree: {
        type: Schema.Types.ObjectId,
        ref: 'degree',
    }
})

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
    prices: [PricesSchema],
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    status: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('specialty', SpecialtySchema);