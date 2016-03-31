var logPlugin = require('posable-logging-plugin');

var updateExtPost = function(extPost, extObjID, statusCode) {

    extPost.update({
        responseDateTime: Date.now(),
        extObjID: extObjID,
        responseStatus: statusCode
    }, function (err, externalPost) {
        if (err) {
            logPlugin.error(err);
        } else {
            logPlugin.debug('Successfully updated externalPost with extObjID : ' + extObjID);
        }
    });
};

module.exports = updateExtPost;