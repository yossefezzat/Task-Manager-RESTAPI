const mongoose = require('mongoose')
const validator = require('validator')

// useNewUrlParser = true , useCreateIndex = true (mongoose v6)
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')