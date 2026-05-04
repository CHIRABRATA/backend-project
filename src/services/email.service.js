const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,     
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
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
async function sendRegistrationEmail(userEmail, userName) {
    const subject = 'Welcome to Our App';
    const text = `Hi ${userName},\n\nWelcome to our app! We're excited to have you on board.\n\nBest regards,\nThe Team`;
    await sendEmail(userEmail, subject, text);
}
module.exports = { transporter, sendEmail, sendRegistrationEmail };   
