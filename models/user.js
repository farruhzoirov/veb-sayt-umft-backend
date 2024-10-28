const {Schema, model,Mongoose} = require('mongoose')

const User = new Schema({
    name: String,
    login:{
        type:String,
        unique:true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    password: {
        type: String,
    },
    telegramId: {
        type: Number,
    },
    role: {
        type: String,
        enum: ['admin','teacher','support','user'],
        default: 'user'
    },
    language:String,
    status: {
        type: Boolean,
        default: true
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

module.exports = model('User', User);
