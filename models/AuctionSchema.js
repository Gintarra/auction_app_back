const mongoose = require('mongoose')
const Schema = mongoose.Schema

const auctionSchema = new Schema({
    ownerName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    bids: {
        type: Array,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('auctionDb', auctionSchema)