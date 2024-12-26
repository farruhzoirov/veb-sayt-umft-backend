const mongoose = require("mongoose");
const {Schema} = require("mongoose");

// Is it bachelor or master
const DegreeTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String
    },
    degree: {
        type: Schema.Types.ObjectId,
        ref: "degree",
        required: true,
    },
    language : {
        type: Schema.Types.ObjectId,
        ref: "language",
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("degreeTranslate", DegreeTranslateSchema);

