var mongoose = require('mongoose');

var DailySumSchema = new mongoose.Schema({
    merchantID: String,
    dateTime: Date,
    dailySumAmount: String
});

module.exports = {
    model : mongoose.model('DailySum', DailySumSchema)
};