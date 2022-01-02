const {
    MongoClient,
    ObjectId
} = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, {
    useNewUrlParser: true
}, (error, client) => {
    if (error)
        return console.log('Unable to connect to database')

    const db = client.db(databaseName)
    db.collection('tasks').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((task) => {
        console.log(task)
    }).catch((error) => {
        console.log(error)
    })

})