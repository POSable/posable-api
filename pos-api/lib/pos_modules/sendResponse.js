var o2x = require('object-to-xml');
var logPlugin = require('posable-logging-plugin');

var sendResponse = function (res, statusObject, requestID) {
    try {
        logPlugin.debug("Starting sendResponse");
        if (statusObject.isOK) {
            logPlugin.debug("- for successful post -");
            if (res.req.headers['content-type'] === 'application/xml') {
                logPlugin.debug("returning  XML");
                res.set('Content-Type', 'application/xml');
                res.status(200);
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    status: 200,
                    requestID: requestID,
                    message: "Passed all internal checks and posted successfully"
                }));
            } else {
                logPlugin.debug("returning JSON");
                res.set('Content-Type', 'application/json');
                res.status(200);
                res.json({
                    status: 200,
                    requestID: requestID,
                    message: "Passed all internal checks and posted successfully"
                });
            }
        } else {
            logPlugin.debug("- for unsuccessful post -");
            if (res.req.headers['content-type'] === 'application/xml') {
                logPlugin.debug("returning  XML");
                res.status(statusObject.error.error.code || 400);
                res.set('content-type', 'application/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    error: statusObject.error
                }));
            } else {
                logPlugin.debug("returning JSON");
                res.status(statusObject.error.error.code || 400);
                res.setHeader('content-type', 'application/json');
                res.json({
                    error: statusObject.error
                });
            }
        }
        logPlugin.debug("Finished sendResponse");
    } catch (err) {
        logPlugin.error(err);
        res.status(500);
    }
};

module.exports = sendResponse;