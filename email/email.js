var AWS = require('aws-sdk');
var sns = new AWS.SNS({region: 'us-west-2'});

var sendMail = function(msg) {
    try {
        var testObject = {
            Message: 'hello world', /* required */
            Subject: 'aws error subject',
            TopicArn: 'arn:aws:sns:us-west-2:788743476555:TestStage'
        };

        sns.publish(testObject, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                msg.reject();
            } else {
                console.log(data);
                msg.ack();
            }
        });
    } catch(err) {
        console.log(err);
    }
};


module.exports = {
    sendMail: sendMail
};

