var save  = function (res, transaction, statusObject, callback) {
    transaction.save(function (err, post){
        if (err) {
            // statusObject.isOK = false;
            // statusObject['error'] = {
            //     module: "transactionSave",
            //    error: {code: 500, message: "DB save error", errorObject: err }
            // };
            // callback();
        } else {
            // statusObject.success.push("transactionSave'");
            console.log("Request Transaction Object Posted to DB", post);
        }
        callback();
    })
};

module.exports = save;
