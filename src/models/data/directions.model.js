const mongoose = require("mongoose");
const  {Schema} = require("mongoose");

const DirectionSchema = new Schema({
    code : {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    img: [],

    faculty: {
        type:  Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true,
    },
    degree: {
        type:  Schema.Types.ObjectId,
        ref: 'degree',
        required: true,
    },
    format: {
        type:  Schema.Types.ObjectId,
        ref: 'format',
    }
});

module.exports = mongoose.model("direction", DirectionSchema);

