const nodemailer = require('nodemailer');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
function sendEmail(emailData){
  const msg = {
    to: emailData.reciever, // Change to your recipient
    from: emailData.sender, // Change to your verified sender
    subject: 'Verify your account',
    text:`
             Hello , thanks for registering.
             Please copy and paste the link to verify your account.
             http://${emailData.host}/verify-email?token=${emailData.emailToken}
            `,
        html:`
             <h1>Hello</h1>
             <p> Please click the link to verify your account</p>
            <button class = "btn btn primary"> <a href="http://${emailData.host}/verify-email?token=${emailData.emailToken}"> Verify your account</a></button>
             `
  }
  console.log(msg)
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

exports.sendMail = (toMail, subject, body) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 300,
        secure: true,
        auth: {
            user: process.env.user,
            pass: process.env.pass,
        },
    });
    console.log("here", toMail)

    const mailOptions = {
        from: process.env.sender,
        to: toMail,
        subject,
        html: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('🚀 TCL -> transporter.sendMail -> error', error);
            return {
                err: true,
                msg: error
            };
        }
        console.log(`Email sent: ${info.response}`, 'email send to', toMail);
        return {
            err: false,
            msg: `Email sent successfully to ${toMail}`
        }
    });
};
module.exports = sendEmail
