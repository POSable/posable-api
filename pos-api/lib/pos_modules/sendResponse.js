var o2x = require('object-to-xml');

var sendResponse  = function (res, statusObject) {
    try {
        if (res.req.headers['content-type'] === 'application/xml') {
            res.send(o2x({
                '?xml version="1.0" encoding="utf-8"?' : null,
                status: statusObject
            }));
            console.log("Response Returned in XML")
        } else {
            res.json(statusObject);
            console.log("Response Returned in JSON");
        }
    } catch (err) {
        console.log ("System Error, Response Not Sent to Post", err);
    }

};

module.exports = sendResponse;

