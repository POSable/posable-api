var mongoose = require('mongoose');

var ExternalPost = new mongoose.Schema({
    requestID: String,
    quickbooksID: String,
    internalID: String,
    requestDateTime: Date,
    responseDateTime: Date,
    responseStatus: String,
    postBody: Object,
    type: String
});

module.exports = {
    model : mongoose.model('External Post', ExternalPost)
};