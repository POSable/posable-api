var mongoose = require('mongoose');

var MerchantBatchTimeSchema = new mongoose.Schema({
    internalID: String,
    batchTime: String
});

module.exports = {
    model : mongoose.model('MerchantBatchTime', MerchantBatchTimeSchema)
};
