describe('Transaction validation', function() {

    var createValTransObj = require('../../lib/pos_modules/api/validateTransaction');
    var statusObject = {};
    var testTransactionDTO = {};
    var testTransaction;

    beforeEach(function(){
        statusObject = {isOK: true, success: []};
        testTransactionDTO = {
            transaction: {
                transactionID: '1',
                merchantID: '1',
                terminalID: '1',
                cashierID: '1',
                payments: [{
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
                }]
            }
        };
        testTransaction = createValTransObj(testTransactionDTO);
    });

    it('keeps statusObject.isOK as true when it passes', function(){
        testTransaction.validateTransaction(statusObject);
        expect(statusObject.isOK).toBe(true); });

    it('updates statusObject.isOK to false when it fails', function(){
        testTransactionDTO.transaction.transactionID = null;
        testTransaction.validateTransaction(statusObject);
        expect(statusObject.isOK).toBe(false); });

    it('pushes "validated" into statusObject when it passes', function(){
        testTransaction.validateTransaction(statusObject);
        expect(statusObject.success[0]).toBe('validated'); });

    it('pushes "transaction validation" into statusObject when it fails', function(){
        testTransactionDTO.transaction.transactionID = null;
        testTransaction.validateTransaction(statusObject);
        expect(statusObject.error.module).toBe('transaction validation'); });

    it('performs payment validations within transaction validation', function(){
        testTransactionDTO.transaction.payments[0].creditCard.cardType = '';
        testTransaction.validateTransaction(statusObject);
        expect(statusObject.error.module).toBe('payment validation'); });

});