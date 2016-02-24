var mongoose = require('mongoose');

var CompletedSchema = new mongoose.Schema({
    internalID: Number,
    date: Date
});

module.exports = {
    model : mongoose.model('Completed', CompletedSchema)
};
