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

var DTO = function (req, res) {
    this.req = req;
    this.res = res;
    this.dto = {};
}

    DTO.prototype.getReqBody = function () {
        var requestBody = this.req.body;
        var message = ""

        if  (requestBody === {}) {
            message = "Request Body Error";
            sendError(this.res, message, 406);
            return false;
        } else if (this.req.headers['content-type'] === "application/json"  || this.req.headers['content-type'] === "application/xml" ) {
            this.dto = requestBody;
            return true;
        } else {
            message = "Content-Type Error";
            sendError(this.res, message, 406);
            return false;
        }
    }

    DTO.prototype.dto = function () {
        return this.dto;
    }

module.exports = DTO;
