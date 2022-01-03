const mongoose = require('mongoose')
const validator = require('validator')
require('../db/mongoose.js')

const Task = mongoose.model('Task', {
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

module.exports = Task