require('dotenv').config()

module.exports = {
    app: {
        name: 'Task Manager RESTFul Api',
        baseUrl: 'http://localhost:',
        port: 3000
    },
    client: {
        url: 'http://localhost:3000'
    },
    api: {
        prefix: '',
    },
}