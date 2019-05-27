const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recepientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
});

const transferSchema = new Schema({
    senderId: {
        type: String,
        required: true,
    },
    receivers: [recepientSchema]
},{
    timestamps: true
});

var Transfers = mongoose.model('transfer', transferSchema);

module.exports = Transfers;