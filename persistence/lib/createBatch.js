var Batch = require('../models/batch').model;
var logPlugin = require('posable-logging-plugin');

var createBatch = function(internalID) {

    try {
        logPlugin.debug('Starting createBatch and Save');

        var mongooseBatch = new Batch();

        mongooseBatch.internalID = internalID;
        mongooseBatch.createdAt = new Date();
        mongooseBatch.status = "inProgress";

        mongooseBatch.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                console.log(mongooseBatch._id);
                logPlugin.debug('Batch was saved as inProgress');
                return mongooseBatch
            }
        });

    } catch (err) {
        logPlugin.debug('System error in createBatch');
        logPlugin.error(err);
        return undefined;
    }

};

module.exports = createBatch;

