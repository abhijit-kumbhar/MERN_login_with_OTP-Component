const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const ENV = require('../config.js');

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD,
    },
}
let transpoter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js"
    }
})

const registerMail = async (req, res) => {
    // console.log("content" , req.body)
    const { username, userEmail, text, subject } = req.body;

    var email = {
        body: {
            name: username,
            intro: text || "Welcome to MERN Project",
            outro: 'Need help, or have questions ?'
        }
    }
    var emailBody = MailGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Sign Successful",
        html: emailBody
    }

    //send mail
    transpoter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us ." })
        })
        .catch(error => {
            res.status(500).send({ error })
        })
}

module.exports = registerMail;