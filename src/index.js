const express = require('express')
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')
const auth = require('./middlewares/auth')
const config = require('config')

const app = express()

const port = config.get('app.port')
app.use(express.json())

// GET avatars from public folder  
app.use('/uploads', express.static('uploads'))

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up to port ' + port)
})