var Batch = require('../models/batch').model;
var logPlugin = require('posable-logging-plugin');

var persistBatch = function(internalID, requestID, batch) {

    try {
        logPlugin.debug('Starting Batch map and Save');

        var mongooseBatch = new Batch();

        mongooseBatch.internalID = internalID;
        mongooseBatch.requestID = requestID;
        mongooseBatch.createdAt = new Date();

        mongooseBatch.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                console.log(mongooseBatch);
                logPlugin.debug('Batch was saved');
            }
        });

    } catch (err) {
        logPlugin.debug('System error in persistBatch');
        logPlugin.error(err);
        return undefined;
    }

};

module.exports = persistBatch;