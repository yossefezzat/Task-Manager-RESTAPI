const mongoose = require('mongoose')
const validator = require('validator')
require('../db/mongoose.js')

const taskModel = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true

    },
    completed: {
        type: Boolean,
        default: false
    }
})

const Task = mongoose.model('Task', taskModel)

module.exports = Task