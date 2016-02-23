var mongoose = require('mongoose');

var MerchantBatchTimeSchema = new mongoose.Schema({
    internalID: String,
    batchTime: Number
});

module.exports = {
    model : mongoose.model('MerchantBatchTime', MerchantBatchTimeSchema)
};
