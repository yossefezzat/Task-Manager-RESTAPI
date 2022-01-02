const mongoose = require('mongoose')
const validator = require('validator')

// useNewUrlParser = true , useCreateIndex = true (mongoose v6)
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')

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

// const newUser = new User({
//     name: 'ezzat',
//     email: 'ezzat@ezzat.com',
//     password: 'ezzat123'
// })

// newUser.save().then((user) => {
//     console.log(user)
// }).catch((error) => {
//     console.log(error)
// })

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

const task = new Task({
    description: '     task desc',
})

task.save().then(() => {
    console.log(task)
}).catch((error) => {
    console.log(error)
})