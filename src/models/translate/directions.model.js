const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const DirectionsTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    direction: {
        type: Schema.Types.ObjectId,
        ref: "direction",
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: "language",
        required: true,
    }
});


module.exports = mongoose.model("directionTranslate", DirectionsTranslateSchema);

