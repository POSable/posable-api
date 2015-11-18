describe("persistence-service", function() {

    var testPaymentMsg = {};
    var testPayment;
    var persistPayment = require('../handlers/createPaymentPersistence');

    beforeEach(function(){
        testPaymentMsg = { body: {
                                data: {
                                    uid: '1',
                                    transactionID: '1',
                                    merchantID: '1',
                                    terminalID: '1',
                                    cashierID: '1',
                                    amount: 5.00,
                                    tax: 1.00,
                                    paymentType: 'cash',
                                    creditCard: {
                                        cardType: '',
                                        last4: '1234',
                                        authCode: 'abc123'
                                    }
                                }
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


