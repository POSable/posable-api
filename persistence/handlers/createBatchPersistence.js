var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var createBatch = require('../lib/createBatch');

var deadLetterErrorHandling = function (msg, error) {
    logPlugin.error(error);
    error.deadLetter = true;
    wascallyRabbit.rabbitDispose(msg, error);
};

function createBatchPersistence(msg) {
    try {
        logPlugin.debug('Received message from Rabbit, Starting Batch Persistence Handler');
        var id = msg.body.internalID;
        if (id === undefined) {
            var batchHandlerError = new Error('Failed Batch Persistence Handler');
            deadLetterErrorHandling(msg, batchHandlerError);
        } else {
            logPlugin.debug('Message starting batch procedure');
            createBatch(merchant.internalID);
        }

    } catch (err) {
        throw err;
    }
}

module.exports = {
  createBatchPersistence: createBatchPersistence
};