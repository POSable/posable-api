var post = require('../lib/cloudElementsClient');
var logPlugin = require('posable-logging-plugin');

var handleSummary = function(msg) {

    logPlugin.debug(msg);

    //map to CE Client
    post();
    msg.ack();
};

module.exports = {

    handleSummary: handleSummary

};