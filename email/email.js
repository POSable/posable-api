var nodemailer = require('nodemailer');

var env = require('./env.json');

var node_env = process.env.NODE_ENV || 'development';
var setEnv =env[node_env];

var sendMail = function (msg, statusObject, callback, to) {
    var internalErr;
    var emailTO = function() {
        if (setEnv !== "production") {
            return to || ''; //Steve Spohr <steve@posable.io>
        } else {
           return to || '';
        }

    };
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'posable.io@gmail.com',
            pass: 'POSable123!'
        }
    });

    var msgString = JSON.stringify(msg);
    var mailOptions = {
        from: 'Posable.io ✔ <posable.io@gmail.com>',
        to: emailTO,   // emails here
        subject: 'Test Email Service ✔', // Subject line
        text: 'This will eventually pass an error msg ✔' + msgString ,
        html: '<b> Hello world ✔' + msgString + '</b>'
    };

    return transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("Error", error);
            internalErr = error;
            statusObject.success.push('mailSender');
            return callback(internalErr, statusObject);
        }
        console.log('Message sent: ' + info.response);
        if (msg.ack) msg.ack();
        return callback(internalErr, statusObject);
    });
};

module.exports = {
    sendMail: sendMail
};
