var mongoose = require('mongoose');

var BatchSchema = new mongoose.Schema({

    createdAt: Date,
    internalID: String,
    requestID: String,
    status: String


});

module.exports = {
    model : mongoose.model('Batch', BatchSchema)
};