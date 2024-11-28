const {Schema, model, Mongoose} = require('mongoose');

const UserModel = new Schema({
    login: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true
    },
    password: {
        type: String,
    },
    telegramId: {
        type: Number,
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'support', 'user'],
        default: 'user'
    },
    language: String,
    status: {
        type: Number,
        default: 1
    },
    action: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    img: []
}, {
    timestamps: true
})

module.exports = model('user', UserModel);
