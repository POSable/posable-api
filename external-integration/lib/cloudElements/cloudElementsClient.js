var logPlugin = require('posable-logging-plugin');
var request = require('request');

var cloudElementsClient = function(extPost, merchConfig, postString, callback) {
    try {
        logPlugin.debug('Starting Cloud Elements Client posting function');
        request({
            url: postString,
            method: 'POST',
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json',
                'Authorization': merchConfig.cloudElemAPIKey
            },
            body: JSON.stringify(extPost.postBody)

        }, function(err, response){
            if (err) {
                logPlugin.error(err);
                callback(err, null);
            } else if (response.statusCode === 200) {
                logPlugin.debug('Successful post to Cloud Elements with Status Code of 200');
                callback(null, response);
            } else {
                logPlugin.debug("CloudElem response code: " + response.statusCode);
                logPlugin.debug("CloudElem response code: " + response.body);
                var newError = new Error("Failed post to CE");
                callback(newError, null);
            }
        });

    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};

module.exports = cloudElementsClient;
