const express = require('express')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// get all users documents
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

//get single user by id
app.get('/users/:id', async (req, res) => {
    try {
        _id = req.params.id
        const user = await User.findById(_id)
        if (!user)
            res.status(404).send()
        res.send(user)
    } catch (e) {
        res.send(500).send()
    }
})

// add a new user (post request)
app.post('/user', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).send(user) // created 201
    } catch (e) {
        res.status(400).send(e) // bad request 400
    }
})

// get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        response.send(500).send(e) // internal server error
    }
})

// get a single task 
app.get('/tasks/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findById(_id)
        if (!task)
            res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// add a new task (post request)
app.post('/task', async (req, res) => {
    try {
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task) // Created status 201
    } catch (e) {
        res.status(400).send(e) // bad request 400
    }
})

app.get('/*', (req, res) => {
    res.status(404).send({
        error: 'page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up to port ' + port)
})