var mongoose = require('mongoose');

var ExternalPost = new mongoose.Schema({
    requestID: String,
    extObjID: String,
    internalID: String,
    requestDateTime: Date,
    responseDateTime: Date,
    responseStatus: String,
    postBody: Object,
    type: String,
    internalObjID: String
});

module.exports = {
    model : mongoose.model('ExternalPost', ExternalPost)
};