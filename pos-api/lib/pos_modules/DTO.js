var DTO = function (req, res) {
    this.req = req;
    this.res = res;
    this.paymentDTO = {};
}
    DTO.prototype.createPaymentDTO = function (statusObject) {
        if (this.req.headers['content-type'] === "application/json"  || this.req.headers['content-type'] === "application/xml" ) {
            this.paymentDTO = this.req.body;
            statusObject.success.push("createPaymentDTO");
        } else {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: createPaymentDTO,
                error: {message: "Payment DTO was not successfully created from Post Body"}
            };
        }
    }

module.exports = DTO;
