const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const userRouter = new express.Router()
const auth = require('../middlewares/auth')
const path = require('path')
const fs = require('fs')
const {
    sendWelcomeEmail,
    sendCancelationEmail
} = require('../emails/account')

// add a new user (post request)
userRouter.post('/user', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        sendWelcomeEmail(user.name, user.email)
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        }) // created 201
    } catch (e) {
        res.status(400).send(e) // bad request 400
    }
})

// login user
userRouter.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})

// get user profile
userRouter.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// logout user 
userRouter.post('/user/logout', auth, async (req, res) => {
    try {
        const user = req.user
        user.tokens = user.tokens.filter((token) => {
            return req.token !== token.token
        })
        await user.save()
        res.send(user)
    } catch {
        res.status(500).send()
    }
})

// logout all sessions for user (auth tokens) 
userRouter.post('/user/logoutAll', auth, async (req, res) => {
    try {
        const user = req.user
        user.tokens = []
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})
//test endpoint
userRouter.get('/test', (req, res) => {
    res.send('heloooooooooooo')
})

// update a user data
userRouter.patch('/user/me', auth, async (req, res) => {
    //get the user from the req.user passed from auth user 
    const user = req.user
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password', 'email']
    const isvalidUpdates = updates.every((update) => allowedUpdates.includes(update))

    if (!isvalidUpdates) {
        return res.status(400).send({
            "error": "invalid update"
        })
    }
    try {
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user)
            return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete user by id 
userRouter.delete('/users/me', auth, async (req, res) => {
    const user = req.user
    try {
        // use remove method from mongoose 
        await user.remove()
        sendCancelationEmail(user.name, user.email)
        res.send(user)
    } catch (e) {
        res.status(500).send() //server error 500
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1Mb file size
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            callback(new Error('please upload an image'), false)
        } else {
            callback(undefined, true)
        }

    }
})

userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const user = req.user
    user.avatar = req.file.path
    try {
        await user.save()
        res.send(req.file)
    } catch (e) {
        res.status(500).send()
    }
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

userRouter.delete('/users/me/avatar', auth, async (req, res) => {
    const user = req.user
    try {
        if (!user.avatar) res.status(404).send({
            error: 'Image has been deleted'
        })
        await fs.unlink(user.avatar, (err) => {
            if (err) throw (err)
        })
        user.avatar = undefined
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = userRouter