var o2x = require('object-to-xml');

var sendError  = function (res, message, status) {
    res.status(status);
    if (res.req.headers['content-type'] === 'application/xml') {
        res.send(o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            error: message,
        }));
    } else {
        res.json({
            error: message,
        });
    }
};

