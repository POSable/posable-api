var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var postProcedure = require('../lib/postProcedure');

var testingStub = function(testLodPlugin, testDispose, testPostProcedure, testmsg) {
    logPlugin = testLodPlugin;
    wascallyRabbit = testDispose;
    postProcedure = testPostProcedure;
    msg = testmsg;
};

var handleError = function(msg, err){
    err.deadLetter = true;
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleRealTimeTransaction = function(msg) {
    try {
        logPlugin.debug('Starting handleRealTimeTransaction handler');
        postProcedure(msg, function(err) {
            if (err) {
                handleError(msg, err);
            } else {
                logPlugin.debug('handleRealTimeTransaction successfully finished');
                wascallyRabbit.rabbitDispose(msg, null);
            }
        });
    } catch(err) {
        handleError(msg, err);
        throw err;
    }
};

module.exports = {
    handleRealTimeTransaction: handleRealTimeTransaction,
    testingStub: testingStub
};