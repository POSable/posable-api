var mongoose = require('mongoose');

var ExternalPost = new mongoose.Schema({
    requestID: String,
    externalPostID: String,
    externalObjectID: String,
    merchantID: String,
    requestDateTime: Date,
    responseDateTime: Date,
    responseStatus: String,
    postBody: Object
});

module.exports = {
    model : mongoose.model('External Post', ExternalPost)
};