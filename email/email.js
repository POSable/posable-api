var env = require('./common').config();
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');

var AWS = require('aws-sdk');
var sns = new AWS.SNS({region: env['AWS_region']});


var sendMail = function(msg) {
    try {
        var rawRequest = msg.body.data;
        var errorStatus = msg.body.error;
        var snsMessage = {
            Message: 'Error processing post with requestID: ' + msg.properties.correlationId + '\n' +
                'Error: ' + errorStatus + '\n' +
                'Raw request: ' + rawRequest,
            Subject: 'API error for internalID: ' + msg.body.internalID,
            TopicArn: env['SNS_TopicArn']
        };

        if(env['sendSNS'] === true) {
            sns.publish(snsMessage, function(err, data) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    logPlugin.debug(data);
                }

                disposeMsg(msg, err);
            });
        } else {
            logPlugin.debug(snsMessage);
            disposeMsg(msg, null);
        }

    } catch(err) {
        logPlugin.error(err);
        disposeMsg(msg, err);
    }


    function disposeMsg(msg, err) { wascallyRabbit.rabbitDispose(msg, err);}
};


module.exports = {
    sendMail: sendMail
};

