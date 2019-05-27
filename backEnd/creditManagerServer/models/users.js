const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true

    },

    profile: {
        type: String,
        required: true,
        default: 'images/index.png'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        required: true,
        default: 0
    },
},{
    timestamps: true
});

var Users = mongoose.model('user', userSchema);

module.exports = Users;