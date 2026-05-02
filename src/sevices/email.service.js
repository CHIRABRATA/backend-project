const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLINT_ID,     
        clientSecret: process.env.CLINT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN_SECRET
    }
});

//verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    }

    console.log('Server is ready to take messages');
}
);

//function to send email
async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to,
        subject,
        text
    };  
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}

module.exports = { transporter, sendEmail };   
