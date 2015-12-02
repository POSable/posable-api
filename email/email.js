var sendMail = function (msg) {
    console.log ("in sendMail")

    var nodemailer = require('nodemailer');

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'posable.io@gmail.com',
            pass: 'POSable123!'
        }
    });

    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Posable.io ✔ <posable.io@gmail.com>', // sender address
        to: 'Steve Spohr <steve@posable.io>', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ✔' + msg + 'end of plain text', // plaintext body
        html: '<b>Hello world ✔</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        msg.ack();
    });

};

module.exports = {
    sendMail: sendMail
};
