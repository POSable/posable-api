var logPlugin = require('posable-logging-plugin');
var persistRequest = require('./persistRequest').persistRequest;
var updateRequest = require('./persistRequest').updateRequest;
var post = require('./cloudElementsClient');
var wascallyRabbit = require('posable-wascally-wrapper');

var postProcedure = function(msg, merchant, salesReceipt, callback) {

    persistRequest(salesReceipt, merchant, msg, postToExternal);

    function postToExternal(err, salesReceipt, merchant, externalPost) {
        if (err) {
            logPlugin.error(err);
            return callback(err); // Stops procedure if request does NOT save
        } else {
            post(salesReceipt, merchant, externalPost, updateRequestWithResponse);
        }
    }

    function updateRequestWithResponse(err, response, externalPost, salesReceipt) {
        if (err) {
            logPlugin.error(err);
            return callback(err); // Stops procedure if post fails
        } else {
            updateRequest(externalPost, response, salesReceipt, callback);  // <- Passes to original callback
        }
    }
};

module.exports = postProcedure;