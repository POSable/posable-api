var o2x = require('object-to-xml');

var sendResponse  = function (res, statusObject) {
    try {
        if (statusObject.isOK) {
            if (res.req.headers['content-type'] === 'application/xml') {
                res.set('Content-Type', 'application/xml');
                res.status(200);
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    status: 200,
                    message: "Transactions passed all internal checks and posted successfully"
                }));
            } else {
                res.set('Content-Type', 'application/json');
                res.status(200);
                res.json({
                    status: 200,
                    message: "Transactions passed all internal checks and posted successfully"
                });
            }
        } else {
            if (res.req.headers['content-type'] === 'application/xml') {
                res.status(statusObject.error.error.code || 400);
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    status: statusObject.error.error.code,
                    error: statusObject.error
                }));
            } else {
                res.status(statusObject.error.error.code || 400);
                res.json({
                    error: statusObject.error
                });
            }
        }
    } catch (err) {
        //console.log("Error is not being returned to requester ", err)
        res.status(500);
    }
};

module.exports = sendResponse;
