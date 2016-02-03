var merchantSearch = require('./merchantSearch');
var requestMap = require('./requestMap');
//var batchMap
var logPlugin = require('posable-logging-plugin');
var persistRequest = require('./persistRequest').persistRequest;
var updateRequest = require('./persistRequest').updateRequest;
var post = require('./cloudElementsClient');

var postProcedure = function(msg, callback) {

    // Initial ID Check
    var id = msg.body.internalID;
    if (id === undefined) {
        var idError = new Error('Msg internalID is undefined.  Msg rejected from RTT handler');
        return callback(idError); // Stops procedure for invalid ID
    } else {
        merchantSearch(id, mapResultsAndPersist);
    }

    // Internal Callback Functions

    function mapResultsAndPersist(err, merchant) {
        if (err) {
            logPlugin.error(err);
            return callback(err); // Stops procedure if merchant is NOT found
        } else {
            try {
                //if merchant.batchType === 'batch'
                var salesReceipt = requestMap(msg, merchant);
            } catch(err) {
                logPlugin.error(err);
                return callback(err);
            }
            persistRequest(salesReceipt, merchant, msg, postToExternal);
        }
    }

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
            console.log('made it');
            updateRequest(externalPost, response, salesReceipt, callback);  // <- Passes to original callback
        }
    }
};

module.exports = postProcedure;