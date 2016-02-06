var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');

var deadLetterErrorHandling = function (msg, error) {
    logPlugin.error(error);
    error.deadLetter = true;
    wascallyRabbit.rabbitDispose(msg, error);
};

function createBatchPersistence(msg) {
    try {
        logPlugin.debug('Received message from Rabbit, Starting Batch Persistence Handler');
        batchReq = msg;
        if (batchReq === undefined) {
            var batchHandlerError = new Error('Failed Batch Persistence Handler');
            deadLetterErrorHandling(msg, batchHandlerError);
        } else {
            logPlugin.debug('Message starting batch procedure');

        }


    } catch (err) {

    }
}

module.exports = {
  createBatchPersistence: createBatchPersistence
};