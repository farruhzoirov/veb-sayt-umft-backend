const mongoose = require('mongoose');
const { Schema } = mongoose;

const specialistInfoSchema = new Schema({
    files: {
        type: [String],
        default: []
    },
    articles: {
        type: [String],
        default: []
    },
    img: [],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('specialistInfo', specialistInfoSchema);

