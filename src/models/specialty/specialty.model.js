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



const DurationSchema = new Schema({
    format: {
        type: Schema.Types.ObjectId,
        ref: 'format'
    },
    year: {
        type: Number,
        required: true
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
        required: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'department',
        required: true,
    },
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    prices: [PricesSchema],
    duration: [DurationSchema],
    active: {
        type: Boolean,
        default: true,
    },
    status: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
})

module.exports = mongoose.model('specialty', SpecialtySchema);