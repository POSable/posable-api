var save  = function (res, payment, statusObject, callback) {
    payment.save(function (err, post){
            if (err) {
                // statusObject.isOK = false;
                // statusObject['error'] = {
                //     module: "paymentSave",
                    error: {code: 500, message: "DB save error", errorObject: err }
                // };
                // callback();
            } else {
                // statusObject.success.push("paymentSave");
                console.log("Request Payment Object Posted to DB", post);
            }
            callback();
        })
};

module.exports = save;
