const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Blog = new Schema({
    title: {
        type: String,
        require: true
    },
    textBody: {
        type: String,
        require: true
    },
    creationDateTime: {
        type: Date,
        require: true
    },
    userId: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    isDeleted:{
        type: Boolean,
        default: false,
        require: false,
    },
    deletionDateTime:{
        type: Date,
        require: false,
    }
})

module.exports = mongoose.model("blogs", Blog);