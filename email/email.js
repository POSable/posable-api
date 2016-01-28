var AWS = require('aws-sdk');

var sns = new AWS.SNS();

console.log(sns);

function sendMail (msg) {

    var testObject = {
        Message: 'hello world', /* required */
        MessageAttributes: {
            someKey: {
                DataType: 'String' /* required */
            }
        },
        Subject: 'aws error subject',
        TopicArn: 'arn:aws:sns:us-west-2:788743476555:TestStage'
    };

    console.log(testObject);

    sns.publish(testObject, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            msg.reject();
        } else {
            console.log(data);
            msg.ack();
        }
    });
}



//var nodemailer = require('nodemailer');
//var logPlugin = require('posable-logging-plugin');
//
//var env = require('./env.json');
//
//var node_env = process.env.NODE_ENV || 'development';
//var setEnv = env[node_env];
//
//var sendMail = function (msg, statusObject, callback, to) {
//    try {
//        if (!statusObject) statusObject = {};
//        if (!callback) callback = function(){console.log(err);};
//        var internalErr;
//        var emailTO = function() {
//            if (setEnv !== "production") {
//                return to || 'david.xesllc@gmail.com'; //Steve Spohr <steve@posable.io>
//            } else {
//                return to || ''; // this should be the client email set by production and internal ID
//            }
//        };
//    } catch (err) {
//        logPlugin.debug("System Error in Emailer", err);
//        internalErr = err;
//        if (msg.reject) {
//            msg.reject();
//        }
//        return callback(internalErr, statusObject);
//    }
//    var transporter = nodemailer.createTransport({
//        service: 'Gmail',
//        auth: {
//            user: 'posable.io@gmail.com',
//            pass: 'POSable123!'
//        }
//    });
//    try {
//        var msgString = JSON.stringify(msg);
//        var mailOptions = {
//            from: 'Posable.io ✔ <posable.io@gmail.com>',
//            to: emailTO(),   // emails here
//            subject: 'Test Email Service ✔', // Subject line
//            text: 'This will eventually pass an error msg ✔' + msgString ,
//            html: '<b> Hello world ✔' + msgString + '</b>'
//        };
//        logPlugin.debug(transporter);
//    } catch (err) {
//        logPlugin.debug("System Error in Email Setup", err);
//        internalErr = err;
//        if (msg.reject) {
//            msg.reject();
//        }
//        return callback(internalErr, statusObject);
//    }
//
//    return transporter.sendMail(mailOptions, function(error, info){
//       try {
//           if(error){
//               logPlugin.debug("Error in Emailer", error);
//               internalErr = error;
//               if (msg.nack) {
//                   //msg.nack(delivery-tag delivery-tag, bit multiple, bit requeue)
//                   msg.nack("", 0, false);
//               }
//               return callback(internalErr, statusObject);
//           }
//           logPlugin.debug('Message sent: ' + info.response);
//           statusObject.success.push('mailSender');
//           logPlugin.debug('finished transporter');
//           if (msg.ack) {
//               msg.ack();
//           }
//           return callback(internalErr, statusObject);
//       } catch (err) {
//           if(err){
//               logPlugin.debug("System Error in Emailer", err);
//               internalErr = err;
//               if (msg.reject) {
//                   msg.reject();
//               }
//               return callback(internalErr, statusObject);
//           }
//       }
//    });
//};
//
module.exports = {
    sendMail: sendMail
};
