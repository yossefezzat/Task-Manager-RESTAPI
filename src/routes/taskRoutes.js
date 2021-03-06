const express = require('express')
const Task = require('../models/task')
const auth = require('../middlewares/auth')
const taskRouter = new express.Router()

// get a single task 
taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        if (!task)
            res.status(404).send({
                error: 'cannot find a task'
            })
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

// get all user tasks
// GET /tasks?completed=true            // filters
// GET /tasks?limit=3&skip=0           //  pagination
// GET /tasks?sortBy=createdAt:desc   //   sorting
taskRouter.get('/tasks', auth, async (req, res) => {
    const user = req.user
    match = {}
    sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(user.tasks)
    } catch (e) {
        res.send(500).send() // internal server error
    }
})

// add a new task (post request)
taskRouter.post('/task', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task) // Created status 201
    } catch (e) {
        res.status(400).send() // bad request 400
    }
})

// update a task
taskRouter.patch('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    const user = req.user
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isvalidUpdates = updates.every((update) => allowedUpdates.includes(update))
    if (!isvalidUpdates) {
        return res.status(400).send({
            error: 'invalid updates'
        })
    }
    try {
        const task = await Task.findOne({
            _id,
            owner: user._id
        })
        if (!task)
            return res.status(404).send()
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete user by id 
taskRouter.delete('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    const user = req.user
    try {
        const task = await Task.findOneAndDelete({
            _id,
            owner: user._id
        })
        if (!task)
            return res.status(404).send() //not found 404
        res.send(task)
    } catch (e) {
        res.status(500).send(e) //server error 500
    }
})

module.exports = taskRouter