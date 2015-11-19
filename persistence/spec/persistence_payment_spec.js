describe("persistence-service", function() {

    var testPaymentMsg = {};
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
                                    paymentType: 'credit',
                                    creditCard: {
                                        cardType: 'visa',
                                        last4: '1234',
                                        authCode: 'abc123'
                                    }
                                }
                            },
                            ack: function(){return 'eh?';}
        };
        spyOn(testPaymentMsg, 'ack');
    });


    it("the msg completed map, persist, and ack", function() {
        persistPayment(testPaymentMsg);
        expect(testPaymentMsg.ack).toHaveBeenCalled();
    });

});


