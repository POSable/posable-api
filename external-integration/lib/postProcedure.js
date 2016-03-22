var logPlugin = require('posable-logging-plugin');
var persistRequest = require('./persistRequest').persistRequest;
var updateRequest = require('./persistRequest').updateRequest;
var post = require('./cloudElementsClient');

var postProcedure = function(msg, merchant, qbInvoice, callback) {

    persistRequest(qbInvoice, merchant, msg, postToExternal);

    function postToExternal(err, qbInvoice, merchant, externalPost) {
        if (err) {
            // Error saving request, exit with error
            logPlugin.error(err);
            return callback(err);
        } else {
            post(qbInvoice, merchant, externalPost, updateRequestWithResponse);
        }
    }

    function updateRequestWithResponse(err, response, externalPost, qbInvoice) {
        if (err) {
            // Error posting request or updating externalPost, exit with error
            logPlugin.error(err);
            return callback(err, null);
        } else {
            // Request posted and externalPost updated
            updateRequest(externalPost, response, qbInvoice, callback);  // <- Passes to original callback
        }
    }
};

module.exports = postProcedure;