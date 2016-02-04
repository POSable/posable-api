var env = require('./common').config();
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var AWS = require('aws-sdk');
var sns = new AWS.SNS({region: env['AWS_region']});


var formatSNS_msg = function(msg) {
    var rawRequest = msg.body.data;
    var errorStatus = msg.body.error;
    var snsMessage = {
        Message: 'Error processing post with requestID: ' + msg.properties.correlationId + '.' +
        '  Error: ' + errorStatus + '.' +
        '  Raw request: ' + rawRequest,
        Subject: 'API error for internalID: ' + msg.body.internalID,
        TopicArn: env['SNS_TopicArn']
    };

    return snsMessage;
};


// Handler
var sendMail = function(msg) {
    try {
        var snsMessage = formatSNS_msg(msg);

        if(env['sendSNS'] === true) {
            sns.publish(snsMessage, function(err, data) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    logPlugin.debug(data);
                }
                wascallyRabbit.rabbitDispose(msg, err);
            });
        } else {
            logPlugin.debug(snsMessage);
            wascallyRabbit.rabbitDispose(msg, null);
        }

    } catch(err) {
        err.deadLetter = true;
        logPlugin.error(err);
        wascallyRabbit.rabbitDispose(msg, err);
    }
};



var testingStub = function(testDispose, testLogPlugin, testSNS, testENV){
    wascallyRabbit = testDispose;
    logPlugin = testLogPlugin;
    sns = testSNS;
    env['sendSNS'] = testENV;
};

module.exports = {
    sendMail: sendMail,
    formatSNS_msg: formatSNS_msg,
    testingStub: testingStub
};

