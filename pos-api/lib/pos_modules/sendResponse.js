var o2x = require('object-to-xml');
var logPlugin = require('posable-logging-plugin');

var sendResponse = function (res, statusObject, requestID) {
    try {
        if (statusObject.isOK) {
            if (res.req.headers['content-type'] === 'application/xml') {
                res.set('Content-Type', 'application/xml');
                res.status(200);
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    status: 200,
                    requestID: requestID,
                    message: "Transactions passed all internal checks and posted successfully"
                }));
            } else {
                res.set('Content-Type', 'application/json');
                res.status(200);
                res.json({
                    status: 200,
                    requestID: requestID,
                    message: "Transactions passed all internal checks and posted successfully"
                });
            }
        } else {
            if (res.req.headers['content-type'] === 'application/xml') {
                res.status(statusObject.error.error.code || 400);
                res.set('content-type', 'application/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    error: statusObject.error
                }));
            } else {
                res.status(statusObject.error.error.code || 400);
                res.setHeader('content-type', 'application/json');
                res.json({
                    error: statusObject.error
                });
            }
        }
    } catch (err) {
        logPlugin.error(err);
        res.status(500);
    }
};

module.exports = sendResponse;