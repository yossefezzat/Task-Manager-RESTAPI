const express = require('express')
const Task = require('../models/task')
const taskRouter = new express.Router()

// get all tasks
taskRouter.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        response.send(500).send(e) // internal server error
    }
})

// get a single task 
taskRouter.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task)
            res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// add a new task (post request)
taskRouter.post('/task', async (req, res) => {
    try {
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task) // Created status 201
    } catch (e) {
        res.status(400).send(e) // bad request 400
    }
})

// update a task
taskRouter.patch('/task/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isvalidUpdates = updates.every((update) => allowedUpdates.includes(update))
    if (!isvalidUpdates) {
        return res.status(400).send({
            error: 'invalid updates'
        })
    }
    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })
        if (!task)
            return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete user by id 
taskRouter.delete('/task/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)
        if (!task)
            return res.status(404).send() //not found 404
        res.send(task)
    } catch (e) {
        res.status(500).send(e) //server error 500
    }
})

module.exports = taskRouter