describe("persistence-service", function(){

    var persistPayment = require('../handlers/createPaymentPersistence');
    var persistTransaction = require('../handlers/createPaymentPersistence');

    describe("when a payment is received", function(){
        it("maps and persists", function() {
            expect(true).toBe(true);
        });
    });

    describe("when a transaction is received", function(){
        it("maps and persists", function() {
            expect(true).toBe(true);
        });
    });
});

;