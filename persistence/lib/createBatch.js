var Batch = require('../models/batch').model;
var logPlugin = require('posable-logging-plugin');
var paymentQuery = require('./paymentQuery');

var createBatch = function(internalID) {

    try {

        logPlugin.debug('Starting createBatch process for internalID : ' + internalID);

        var mongooseBatch = new Batch();

        var tempBatchID;

        tempBatchID = mongooseBatch._id;

        mongooseBatch.internalID = internalID;
        mongooseBatch.createdAt = new Date();
        mongooseBatch.status = "inProgress";

        mongooseBatch.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('Batch : ' + mongooseBatch._id + 'was saved as inProgress');

                paymentQuery(internalID, tempBatchID, callback);
            }
        });

    } catch (err) {
        logPlugin.debug('System error in createBatch');
        logPlugin.error(err);
        return undefined;
    }

};

var callback = function(err, batchID, batchObject) {
    console.log(batchObject);
};

module.exports = createBatch;

