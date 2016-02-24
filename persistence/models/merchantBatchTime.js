var mongoose = require('mongoose');

var MerchantBatchTimeSchema = new mongoose.Schema({
    internalID: Number,
    batchTime: String
});

module.exports = {
    model : mongoose.model('MerchantBatchTime', MerchantBatchTimeSchema)
};
