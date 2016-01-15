var DailySum = require('../models/batch').model;
var logPlugin = require('posable-logging-plugin');

//going to need to dig out internalID here or maybe the dailySum handler and pass it
var mapDailySum = function(msg) {
    try {
        var dailySum = new DailySum();
        dailySum.merchantID = msg.body.data.merchantID;
        dailySum.dateTime = msg.body.data.dateTime;
        dailySum.dailySumAmount = msg.body.data.dailySumAmount;
        logPlugin.debug("Successful Daily Sum");
        return dailySum;
    } catch (err) {
        logPlugin.error(err);
        return undefined;
    }
};

module.exports = mapDailySum;