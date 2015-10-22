var save  = function (res, payment, statusObject, callback) {
        payment.save(function (err, post){
            if (err) {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: createPaymentDTO,
                    error: {message: "DB save error", errorObject: err }
                };
            }
            statusObject.success.push("paymentSave'");
            console.log("Posted", post);
            callback(res, statusObject);
        })

};


//    (function (err, post) {
//    if (err) {
//        var message = "DB Error";
//        res.status(500);
//        if (res.req.headers['content-type'] === 'application/xml') {
//            res.send(o2x({
//                '?xml version="1.0" encoding="utf-8"?' : null,
//                error: message,
//            }));
//        } else {
//            res.json({
//                error: message,
//            });
//        }
//    } else {
//        console.log("Posted this object to DB ", post);
//        if (res.req.headers['content-type'] === 'application/xml') {
//            res.send(o2x({
//                '?xml version="1.0" encoding="utf-8"?' : null,
//                message: 'POS API Transaction, token matched, validation passed, object mapped and saved in mongo',
//            }))
//        } else {
//            res.json({
//                message: 'POS API Transaction, token matched, validation passed, object mapped and saved in mongo',
//            });
//        }
//    }
//});

module.exports = save;