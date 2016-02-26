var mongoose = require('mongoose');

var CompletedBatchSchema = new mongoose.Schema({
    internalID: Number,
    date: Date
});

module.exports = {
    model : mongoose.model('CompletedBatch', CompletedBatchSchema)
};
