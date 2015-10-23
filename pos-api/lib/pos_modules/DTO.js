var createPaymentDTO = function (req, res, statusObject) {
    var paymentDTO = {};
        if (req.headers['content-type'] === "application/json"  || req.headers['content-type'] === "application/xml" ) {
            paymentDTO = req.body;
            statusObject.success.push("createPaymentDTO");
        } else {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: createPaymentDTO,
                error: {message: "Payment DTO was not successfully created from Post Body"}
            };
        }
        return paymentDTO;
    };

module.exports = createPaymentDTO;
