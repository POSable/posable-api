var mongoose = require('mongoose');

var MerchantBatchTimeSchema = new mongoose.Schema({
    internalID: Number,
    batchTime: Number
});

module.exports = {
    model : mongoose.model('MerchantBatchTime', MerchantBatchTimeSchema)
};
