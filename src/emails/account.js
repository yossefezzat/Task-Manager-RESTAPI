const nodemailer = require('nodemailer')
const config = require('config')

host = config.get('email.host')
service = config.get('email.service')
username = config.get('email.username')
password = config.get('email.password')

const transporter = nodemailer.createTransport({
    host: host,
    service: service,
    secure: true,
    auth: {
        user: username,
        pass: password
    },
    tls: {
        rejectUnauthorized: false
    }
})

const sendWelcomeEmail = (name, email) => {
    const options = {
        from: username,
        to: email,
        subject: 'Thanking for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('sent' + info.response)
    })
}

const sendCancelationEmail = (name, email) => {
    const options = {
        from: username,
        to: email,
        subject: 'Oops, Sorry to see you go',
        text: `Goodbye, ${name}. I hope to see you back sometime soon`
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('sent' + info.response)
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}