var nodemailer = require('nodemailer');

var sendMail = function (msg) {
    console.log("this is the msg", msg);

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'posable.io@gmail.com',
            pass: 'POSable123!'
        }
    });
    var error = JSON.stringify(msg);
    var mailOptions = {
        from: 'Posable.io ✔ <posable.io@gmail.com>', // sender address
        to: '', // list of receivers
        subject: 'Test Email Service ✔', // Subject line
        text: 'This will eventually pass an error msg ✔' + error , // plaintext body
        html: '<b> Hello world ✔' + error + '</b>' // html body
    };

    //  'Steve Spohr <steve@posable.io>' - need to insert email address in to the to line

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
