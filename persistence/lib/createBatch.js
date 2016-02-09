var Batch = require('../models/batch').model;
var logPlugin = require('posable-logging-plugin');
var paymentQuery = require('./paymentQuery');

var createBatch = function(id) {

    try {
        logPlugin.debug('Starting createBatch process for internalID : ' + id);

        var mongooseBatch = new Batch();

        var tempBatchID;

        tempBatchID = mongooseBatch._id;

        mongooseBatch.internalID = id;
        mongooseBatch.createdAt = new Date();
        mongooseBatch.status = "inProgress";

        mongooseBatch.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('Batch : ' + mongooseBatch._id + 'was saved as inProgress');

                paymentQuery(id, tempBatchID, callback);
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

