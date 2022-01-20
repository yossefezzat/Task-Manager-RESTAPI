const express = require('express')
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')
const auth = require('./middlewares/auth')
const path = require('path')


const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

// GET avatars from public folder  
app.use('/uploads', express.static('uploads'))
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up to port ' + port)
})