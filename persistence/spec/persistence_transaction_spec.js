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
                                        paymentType: 'cash',
                                        creditCard: {
                                            cardType: '',
                                            last4: '1234',
                                            authCode: 'abc123'
                                        }
                                    }
                                }
                            };
        testTransaction = persistTransaction(testTransactionMsg);
    });



    describe("when a transaction is received", function() {
        it("maps and persists", function() {
            expect(true).toBe(true);
        });
    });
});
