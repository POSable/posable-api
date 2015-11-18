describe("persistence-service", function() {

    var testPaymentMsg = {};
    var testPayment;
    var persistPayment = require('../handlers/createPaymentPersistence');

    beforeEach(function(){
        testPaymentMsg = {
            "uid" : "SampleID",
            "transactionID" : "SampleID",
            "merchantID" : "SampleID",
            "terminalID" : "SampleID",
            "cashierID" : "SampleID",
            "dateTime" :  "Wed Oct 14 2015 11:30:50 GMT-0600 (MDT)",
            "paymentType" : "credit",
            "amount" : 100.00,
            "tax" : 15.45,
            "creditCard": {
                "cardType" : "visa",
                "last4" : 1234,
                "authCode" : 123123
            }
        };
        testPayment = persistPayment(testPaymentMsg);
    });




    describe("when a payment is received", function() {
        it("maps and persists", function() {
            expect(true).toBe(true);
        });
    });
});



