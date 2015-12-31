var DailySum = require('../models/dailySum').model;
var logPlugin = require('posable-logging-plugin');


var mapDailySum = function(msg) {
    try {
        var dailySum = new DailySum();
        dailySum.merchantID = msg.body.data.merchantID;
        dailySum.dateTime = msg.body.data.dateTime;
        dailySum.dailySumAmount = msg.body.data.dailySumAmount;
        logPlugin("Succesful Daily Sum")
        return dailySum;
    } catch (err) {
        logPlugin.error(err);
        return undefined;
    }
};

module.exports = mapDailySum;