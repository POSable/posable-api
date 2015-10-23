var createPaymentDTO = function (req, statusObject) {
    var paymentDTO = {};
    try {
        if (req.headers['content-type'] === "application/json" || req.headers['content-type'] === "application/xml") {
            paymentDTO = req.body;
            statusObject.success.push("createPaymentDTO");
        } else {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: createPaymentDTO,
                error: {message: "Payment DTO was not successfully created from Post Body"}
            }
        }
        return paymentDTO;
    } catch (err) {
        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "checkPostToken",
                error: {message: "System Error with creating a payment DTO"}
            }
        }
        return paymentDTO;
    }
};


module.exports = createPaymentDTO;
