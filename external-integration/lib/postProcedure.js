var merchantSearch = require('./merchantSearch');
var requestMap = require('./requestMap');
var batchMap = require('./batchMap');
var logPlugin = require('posable-logging-plugin');
var persistRequest = require('./persistRequest').persistRequest;
var updateRequest = require('./persistRequest').updateRequest;
var post = require('./cloudElementsClient');
var wascallyRabbit = require('posable-wascally-wrapper');


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
                if (merchant.batchType === "real-time") {
                    logPlugin.debug("Real Time merchant found");
                    var salesReceipt = requestMap(msg, merchant);
                } else {
                    logPlugin.debug("Batch merchant found");
                    wascallyRabbit.rabbitDispose(msg, err);
                    return;
                    //salesReceipt = batchMap(msg, merchant);
                }

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