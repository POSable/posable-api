describe("Test 'createPaymentDTO' module & 'createPaymentDTO' function", function() {

    var testObject = {};
    var paymentDTO = {};
    //req.headers['content-type'] === "application/json";
    //req.headers['content-type'] === "application/xml");
    var reqXML = {headers: {content-type: 'application/xml'}, body: {payment: {amount: '10', tax: '0.50'}}};
    var statusObject = {isOK: true, success: []};
    statusObject.success = [];
    var createPaymentDTO = require('../lib/pos_modules/api/createPaymentDTO');
    createPaymentDTO(req, statusObject);
    statusObject.success.push("createPaymentDTO");
    });

    it("Should not have an internal system error", function () {
        expect(testObject.internalErr).toEqual(null);
    });

    it("Should push 'createPaymentDTO' into the success array in statusObject", function () {
        expect(testObject.statusObject.success[0]).toEqual("createPaymentDTO");
    });

    it("Should not push an error into statusObject", function () {
        expect(statusObject.error).toEqual(undefined);
    });
});