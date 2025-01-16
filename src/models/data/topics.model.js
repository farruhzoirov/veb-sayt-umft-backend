const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const TopicSchema = new Schema(
    {
        specialty: {
            type: Schema.Types.ObjectId,
            ref: "specialty",
            required: true,
        },
        level: {
            type: Schema.Types.ObjectId,
            ref: "level",
            required: true,
        },
        slug: {
            type: String,
        },
        status: {
            type: Number,
            default: 1,
        },
        img: [],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("topic", TopicSchema);
