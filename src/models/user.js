const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
require('../db/mongoose.js')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    });
    if (!user) throw new Error('Unable to login');
    let passwordHash = await bcrypt.hash(password, 8);
    const isMatch = await bcrypt.compare(passwordHash, user.password);
    if (!isMatch) throw new Error('Unable to login');
    return user;

    //$2a$08$f6slwioafcfyfawyumcej.zye3naxmc/xci8ibzur3c9jzh.tn.z.

    // bcrypt.compare(password, user.password, (err, res) => {
    //     console.log(password);
    //     console.log(res)
    //     console.log(user.password);
    //     console.log(err)
    //     return user;
    // })

    //const booleanResult = await bcrypt.compare(userData.password, passwordHash);
};


userSchema.pre('save', async function (next) {
    const user = this
    console.log(user.password)
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User