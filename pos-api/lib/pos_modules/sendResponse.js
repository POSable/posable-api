var o2x = require('object-to-xml');

var sendResponse  = function (res, statusObject) {
    if (res.req.headers['content-type'] === 'application/xml') {
        res.send(o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            status: statusObject
        }));
    } else {
        res.json(statusObject);
    }
};

module.exports = sendResponse;

