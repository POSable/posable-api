var save  = function (res, payment, statusObject, callback) {
        payment.save(function (err, post){
            if (err) {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: createPaymentDTO,
                    error: {message: "DB save error", errorObject: err }
                };
            } else {
                statusObject.success.push("paymentSave'");
                console.log("Posted", post);
            }

            callback(res, statusObject);
        })

};

module.exports = save;