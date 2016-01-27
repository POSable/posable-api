var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var postProcedure = require('../lib/postProcedure');

var handleError = function(msg, err){
    err.deadLetter = true;
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleRealTimeTransaction = function(msg) {
    try {
        postProcedure(msg, function(err) {
            if (err) {
                handleError(msg, err);
            } else {
                wascallyRabbit.rabbitDispose(msg, null);
            }
        });
    } catch(err) {
        logPlugin.error(err);
    }

};

module.exports = {
    handleRealTimeTransaction: handleRealTimeTransaction
};
