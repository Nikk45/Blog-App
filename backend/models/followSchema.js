const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Follow = new Schema({
    currentUserId: {
        type: String,
        require: true,
        ref: "users",
    },
    followingUserId: {
        type: String,
        require: true,
        ref: "users",
    },
    creationDateTime: {
        type: Date,
        require: true,
    }

})

module.exports = mongoose.model("follows", Follow);