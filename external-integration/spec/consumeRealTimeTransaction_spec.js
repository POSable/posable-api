describe("Test 'consumeRealTimeTransaction' module & 'handleRealTimeTransaction' function", function() {
    var handleRealTimeTransaction = require('../handlers/consumeRealTimeTransaction').handleRealTimeTransaction;
    var msg = {};
    describe("A valid message id", function() {

        beforeEach(function () {
            msg = {body : {internalID: 1}, ack: function() {}};
            spyOn(msg, "ack")
        });

        it("Should not have an internal error", function (done) {
            callback = function (err) {
                expect(err).toEqual(null);
                done();
            };
            handleRealTimeTransaction(msg, callback);
        });

        it("Should parse the msg and use 1 for the internalID", function (done) {
            callback = function (err, id) {
                expect(id).toEqual(1);
                done();
            };
            handleRealTimeTransaction(msg, callback);
        });

        it("Should call ack method on msg object.", function (done) {
            callback = function () {
                expect(msg.ack).toHaveBeenCalled();
                done();
            };
            handleRealTimeTransaction(msg, callback);
        });
    });

    describe("An improper message id, text - creating this error - Cast to number failed for value hello at path internalID", function(){

        beforeEach(function () {
            msg = {body : {internalID: "hello"}, nack: function() {}};
            spyOn(msg, "nack")
        });

        it("Should have an internal error", function (done) {
            callback = function (err) {
                expect(err).not.toBeFalsy();
                done();
            };
            handleRealTimeTransaction(msg, callback);
        });

        it("Should parse the msg and use undefined for the internalID", function (done) {
            callback = function (err, id) {
                expect(id).toEqual(undefined);
                done();
            };
            handleRealTimeTransaction(msg, callback);
        });

        it("Should call nack method on msg object.", function (done) {
            callback = function () {
                expect(msg.nack).toHaveBeenCalled();
                done();
            };
            handleRealTimeTransaction(msg, callback);
        });
    });
});
