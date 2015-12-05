var DailySum = require('../models/dailySum').model;

var mapDailySum = function(msg) {
    try {
        //console.log(msg.body.data);
        var dailySum = new DailySum();

        dailySum.merchantID = msg.body.data.merchantID;
        dailySum.dateTime = msg.body.data.dateTime;
        dailySum.dailySumAmount = msg.body.data.dailySumAmount;

        return dailySum;

    } catch (err) {
        console.log(err);

    }
    return dailySum;
};

module.exports = mapDailySum;