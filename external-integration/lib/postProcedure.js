var logPlugin = require('posable-logging-plugin');
var persistRequest = require('./persistRequest').persistRequest;
var updateRequest = require('./persistRequest').updateRequest;
var post = require('./cloudElementsClient');

var postProcedure = function(msg, merchant, salesReceipt, callback) {

    persistRequest(salesReceipt, merchant, msg, postToExternal);

    function postToExternal(err, salesReceipt, merchant, externalPost) {
        if (err) {
            // Error saving request, exit with error
            logPlugin.error(err);
            return callback(err);
        } else {
            post(salesReceipt, merchant, externalPost, updateRequestWithResponse);
        }
    }

    function updateRequestWithResponse(err, response, externalPost, salesReceipt) {
        if (err) {
            // Error posting request or updating externalPost, exit with error
            logPlugin.error(err);
            return callback(err, null);
        } else {
            // Request posted and externalPost updated
            updateRequest(externalPost, response, salesReceipt, callback);  // <- Passes to original callback
        }
    }
};

module.exports = postProcedure;