var Batch = require('../models/batch').model;
var logPlugin = require('posable-logging-plugin');

var finalizeBatch = function(internalID, requestID, batch) {

    try {
        logPlugin.debug('Updating record for : ' + batch.batchID);

        Batch.update({ _id: batch.batchID }, {requestID: requestID, status: "Complete"}, function(err, raw) {
            if (err) logPlugin.error("The batch update response Error from mongo is : " + err);
            logPlugin.debug("The batch " + batch.batchID + " has been successfully updated : " + JSON.stringify(raw));
        });


    } catch (err) {
        logPlugin.debug('System error in persistBatch');
        logPlugin.error(err);
        return undefined;
    }

};


module.exports = finalizeBatch;
