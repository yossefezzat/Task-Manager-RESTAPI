const express = require('express')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())

// get all users documents
app.get('/users', (req, res) => {

    User.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send()
    })
})

//get single user by id
app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    User.find({
        _id
    }).then((user) => {
        if (!user) {
            res.status(404)
        }
        res.send(user)

    }).catch((e) => {
        res.status(500).send()
    })
})


// add a new user (post request)
app.post('/user', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

// get all tasks
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

// get a single task 
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.find({
        _id
    }).then((task) => {
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


// add a new task (post request)
app.post('/task', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/*', (req, res) => {
    res.status(404).send({
        error: 'page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up to port ' + port)
})