const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user2Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    reservedMoney: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('userDb', user2Schema)