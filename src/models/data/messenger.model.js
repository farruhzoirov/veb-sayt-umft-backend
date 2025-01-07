const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const MessengerSchema = new Schema(
    {
        img: [],
        slug: {
            type: String,
        },
        status: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("messenger", MessengerSchema);
