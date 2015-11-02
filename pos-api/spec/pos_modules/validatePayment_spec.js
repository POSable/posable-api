describe('Payment validation', function(){

    var createValPayObj = require('../../lib/pos_modules/api/validatePayment');
    var statusObject = {};
    var testPaymentDTO = {};
    var testPayment;

    beforeEach(function(){
        statusObject = {isOK: true, success: []};
        testPaymentDTO = {
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
        };
        testPayment = createValPayObj(testPaymentDTO);
    });

    it('keeps statusObject.isOK as true when it passes', function(){
        testPayment.validatePayment(statusObject);
        expect(statusObject.isOK).toBe(true); });

    it('updates statusObject.isOK to false when it fails', function(){
        testPaymentDTO.uid = null;
        testPayment.validatePayment(statusObject);
        expect(statusObject.isOK).toBe(false); });

    it('skips credit card fields for cash payments', function(){
        testPayment.validatePayment(statusObject);
        expect(statusObject.isOK).toBe(true); });

    it('checks credit card fields for credit payments', function(){
        testPaymentDTO.paymentType = 'credit';
        testPayment.validatePayment(statusObject);
        expect(statusObject.isOK).toBe(false); });

    it('pushes "validated" into statusObject when it passes', function(){
        testPayment.validatePayment(statusObject);
        expect(statusObject.success[0]).toBe('validated'); });

    it('pushes "payment validation" into statusObject when it fails ', function(){
        testPaymentDTO.paymentType = 'credit';
        testPayment.validatePayment(statusObject);
        expect(statusObject.error.module).toBe('payment validation'); });
});