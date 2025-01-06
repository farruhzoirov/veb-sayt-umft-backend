const {Schema, model, Mongoose} = require('mongoose');

const UserModel = new Schema({
    name: {
        type: String,
    },
    login: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'manager'],
        default: 'admin'
    },
    status: {
        type: Number,
        default: 1
    },
    img: []
}, {
    timestamps: true
})

module.exports = model('user', UserModel);
