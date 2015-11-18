describe("persistence-service", function() {

    var testTransactionMsg = {};
    var testTransaction;
    var persistTransaction = require('../handlers/createTransactionPersistence');

    beforeEach(function(){
        testTransactionMsg = { body: {
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
                                }
                            };
        testTransaction = persistTransaction(testTransactionMsg);
    });

    //, ack: function(){}, spyOn(testTransactionMsg, 'ack');


    describe("when a transaction is received", function() {
        it("the msg completed map, persist, and ack", function() {
            expect(testTransaction.ack).toHaveBeenCalled();
        });
    });
});
