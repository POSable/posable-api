var Batch = require('../models/batch').model;
var logPlugin = require('posable-logging-plugin');

var persistBatch = function(internalID, requestID, batch) {

    try {
        logPlugin.debug('Updating record for : ' + batch.batchID);

        Batch.update({ _id: batch.batchID }, {requestID: requestID, status: "Complete"}, function(err, raw) {
            if (err) logPlugin.error("The response Error from mongo is : " + err);
            logPlugin.debug("The batch " + batch.batchID + " has been successfully updated");
        });


    } catch (err) {
        logPlugin.debug('System error in persistBatch');
        logPlugin.error(err);
        return undefined;
    }

};


module.exports = persistBatch;
