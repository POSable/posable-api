var mongoose = require('mongoose');

var DiscountSchema = new mongoose.Schema({
    discountDescription: String,
    discountAmount: Number
});

module.exports = {
    model : mongoose.model('Discount', DiscountSchema)
};