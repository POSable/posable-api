describe("Test 'consumeRealTimePayment' module & 'handleRealTime' function", function() {
    var handleRealTimePayment = require('../handlers/consumeRealTimePayment').handleRealTimePayment;
    var msg = {};
    describe("A valid message id", function() {

        beforeEach(function () {
            msg = {body : {internalID: 1}, ack: function() {}};
            spyOn(msg, "ack")
        });

        it("Should not have an internal error", function (done) {
            console.log("in the it");
            callback = function (err) {
                expect(err).toEqual(null);
                done();
            };
            handleRealTimePayment(msg, callback);
        });

        it("Should parse the msg and use 1 for the internalID", function (done) {
            console.log("in the it");
            callback = function (err, id) {
                expect(id).toEqual(1);
                done();
            };
            handleRealTimePayment(msg, callback);
        });

        it("Should call ack method on msg object.", function (done) {
            console.log("in the it");
            callback = function (err, id) {
                expect(msg.ack).toHaveBeenCalled();
                done();
            };
            handleRealTimePayment(msg, callback);
        });
    });

    describe("An improper message id, text - creating this error - Cast to number failed for value hello at path internalID", function(){

        beforeEach(function () {
            msg = {body : {internalID: "hello"}, nack: function() {}};
            spyOn(msg, "nack")
        });

        it("Should have an internal error", function (done) {
            console.log("in the it");
            callback = function (err) {
                expect(err).not.toBeFalsy();
                done();
            };
            handleRealTimePayment(msg, callback);
        });

        it("Should parse the msg and use undefined for the internalID", function (done) {
            console.log("in the it");
            callback = function (err, id) {
                expect(id).toEqual(undefined);
                done();
            };
            handleRealTimePayment(msg, callback);
        });

        it("Should call nack method on msg object.", function (done) {
            console.log("in the it");
            callback = function () {
                expect(msg.nack).toHaveBeenCalled();
                done();
            };
            handleRealTimePayment(msg, callback);
        });
    });
});
