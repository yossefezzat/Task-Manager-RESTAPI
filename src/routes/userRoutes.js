const express = require('express')
const User = require('../models/user')
const userRouter = new express.Router()

// get all users documents
userRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

//get single user by id
userRouter.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user)
            res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

// add a new user (post request)
userRouter.post('/user', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).send(user) // created 201
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
        res.status(400).send(e)
    }

})

// update a task
userRouter.patch('/user/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password', 'email']
    const isvalidUpdates = updates.every((update) => allowedUpdates.includes(update))
    if (!isvalidUpdates) {
        return res.status(400).send({
            "error": "invalid update"
        })
    }
    try {
        const user = await User.findById(req.params.id)
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
userRouter.delete('/user/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user)
            return res.status(404).send() //not found 404
        res.send(user)
    } catch (e) {
        res.status(500).send(e) //server error 500
    }
})


module.exports = userRouter