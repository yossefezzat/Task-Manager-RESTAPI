require('dotenv').config()

module.exports = {
    app: {
        name: 'Task Manager RESTFul Api',
        baseUrl: 'http://localhost:',
        port: process.env.PORT
    },
    client: {
        url: 'http://localhost:3000'
    },
    api: {
        prefix: '',
    },
}