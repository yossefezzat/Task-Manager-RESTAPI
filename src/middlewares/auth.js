const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = await jwt.verify(token, 'thisismycourse')
        const user = await User.findOne({
            '_id': decoded._id,
            'tokens.token': token
        })
        if (!user) {
            throw Error('please authenticate')
        }
        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(401).send({
            'error': 'unauthorized login'
        })
    }
}

module.exports = auth