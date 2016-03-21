var ExternalPost = require('../../models/externalPost').model;
var logPlugin = require('posable-logging-plugin');

function persistRequest (qbInvoice, merchant, callback) {
    var externalPost = new ExternalPost();

    externalPost.merchantID = merchant.merchantID;
    externalPost.requestDateTime = Date.now();
    externalPost.postBody = qbInvoice;

    externalPost.save(function (err, externalPost) {
        if (err) {
            logPlugin.error(err);
            return callback(err, null, null, null);
        } else {
            logPlugin.debug('External post was saved');
            return callback(null, qbInvoice, merchant, externalPost);
        }
    });
}

function updateRequest (externalPost, response, qbInvoice, callback) {
    var objectID = JSON.parse(qbInvoice);

    externalPost.update({
        responseDateTime: Date.now(),
        externalPostID: response.headers['elements-request-id'],
        externalObjectID: objectID["id"],
        responseStatus: response.statusCode
    }, function (err, externalPost) {
        if (err) {
            logPlugin.error(err);
            return callback(err, null);
        } else {
            logPlugin.debug('Successfully updated externalPost');
            return callback(null, externalPost);
        }
    });
}


module.exports = {
    persistRequest: persistRequest,
    updateRequest: updateRequest
};