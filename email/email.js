var nodemailer = require('nodemailer');
var logPlugin = require('posable-logging-plugin');

var env = require('./env.json');

var node_env = process.env.NODE_ENV || 'development';
var setEnv = env[node_env];

var sendMail = function (msg, statusObject, callback, to) {
    if (!statusObject) statusObject = {};
    if (!callback) callback = function(){};
    var internalErr;
    var emailTO = function() {
        if (setEnv !== "production") {
            return to || 'david.xesllc@gmail.com'; //Steve Spohr <steve@posable.io>
        } else {
           return to || ''; // this should be the client email set by production and internal ID
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
        to: emailTO(),   // emails here
        subject: 'Test Email Service ✔', // Subject line
        text: 'This will eventually pass an error msg ✔' + msgString ,
        html: '<b> Hello world ✔' + msgString + '</b>'
    };
    logPlugin.debug(transporter);
    return transporter.sendMail(mailOptions, function(error, info){
        if(error){
            logPlugin.debug("Error", error);
            internalErr = error;
            statusObject.success.push('mailSender');
            return callback(internalErr, statusObject);
        }
        logPlugin.debug('Message sent: ' + info.response);

        if (msg.reject) {
            msg.reject();
        }
        logPlugin.debug('finished transporter');
        return callback(internalErr, statusObject);
    });
};

module.exports = {
    sendMail: sendMail
};
