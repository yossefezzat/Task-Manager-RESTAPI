const mongoose = require('mongoose')
const validator = require('validator')
require('../db/mongoose.js')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot contain "password" ')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age is invalid number')
            }
        }
    }
})

module.exports = User