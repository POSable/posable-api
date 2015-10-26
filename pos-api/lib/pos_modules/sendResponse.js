var o2x = require('object-to-xml');

var sendResponse  = function (res, statusObject) {
    try {
        if (statusObject.isOK) {
            try {
                if (res.req.headers['content-type'] === 'application/xml') {
                    res.send(o2x({
                        '?xml version="1.0" encoding="utf-8"?': null,
                        status: 200,
                        message: "Transactions passed all internal checks and posted successfully"
                    }));
                    console.log("Response Returned in XML")
                } else {
                    res.status(200).json({
                        status: 200,
                        message: "Transactions passed all internal checks and posted successfully"
                    })
                    console.log("Response Returned in JSON");
                }
            } catch (err) {
                console.log ("System Error, Response Not Sent to Post", err);
            }
        } else {
            try {
                if (res.req.headers['content-type'] === 'application/xml') {
                    res.send(o2x({
                        '?xml version="1.0" encoding="utf-8"?': null,
                        status: statusObject.error.error.code,
                        error: statusObject.error
                    }));
                    console.log("Response Returned in XML")
                } else {
                    res.status(statusObject.error.error.code).json({
                        error: statusObject.error
                    })
                    console.log("Response Returned in JSON");
                }
            } catch (err) {
                console.log ("System Error, Response Not Sent to Post", err);
            }

        }
    } catch (err) {
        console.log (err);
    }
};

module.exports = sendResponse;




//future work to extract a responseObj.js


//var responseObj = function (res, statusObject) {
//    try {
//        if (statusObject.isOK) {
//            object = {
//                status: 200,
//                message: "All good"
//            }
//        } else {
//            object({
//                status: 500,
//                error: statusObject.error
//            })
//        }
//        return object
//    } catch (err) {
//        return err;
//    }
//}
//
//
//module.exports = responseObj;