describe("Test 'createPaymentDTO' module & 'createPaymentDTO' function", function() {
    var createPaymentDTO = require('../../lib/pos_modules/api/createPaymentDTO');
    var req, statusObject;

    describe("Request content-type is json", function (){
        req = {body: {test: "value"}, headers: {'content-type': ""}};

        beforeEach(function() {
            statusObject = {isOK: true, success: []};
            req.headers['content-type'] = "application/json";
        });

        it("Should return DTO", function () {
            var dto = createPaymentDTO(req, statusObject);
            expect(typeof dto).toEqual('object');
        });

        it("Should add object to statusObject success array", function () {
            var origLength = statusObject.success.length;
            createPaymentDTO(req, statusObject);
            var updateLength = statusObject.success.length;
            expect(updateLength - origLength).toEqual(1);
        });
    });

    describe("Request content-type is xml", function(){
        req = {body: {payment: {test: "value"}}, headers: {'content-type': ""}};

        beforeEach(function() {
            statusObject = {isOK: true, success: []};
            req.headers['content-type'] = "application/xml";
        });

        it("Should return DTO", function () {
            var dto = createPaymentDTO(req, statusObject);
            expect(typeof dto).toEqual('object');
        });

        it("Should add object to statusObject success array", function () {
            var origLength = statusObject.success.length;
            createPaymentDTO(req, statusObject);
            var updateLength = statusObject.success.length;
            expect(updateLength - origLength).toEqual(1);
        });
    });

    describe("Request content-type is NOT xml or json", function(){
        req = {body: {payment: {test: "value"}}, headers: {'content-type': ""}};

        beforeEach(function() {
            statusObject = {isOK: true, success: []};
            req.headers['content-type'] = "text/plain";
        });

        it("Should change state of statusObject isOK to false", function () {
            createPaymentDTO(req, statusObject);
            expect(statusObject.isOK).toEqual(false);
        });

        it("Should set statusObject error", function () {
            createPaymentDTO(req, statusObject);
            expect(typeof statusObject.error).toEqual('object');
        });

        it("Should return DTO", function () {
            var dto = createPaymentDTO(req, statusObject);
            expect(typeof dto).toEqual('object');
        });
    });

    describe("System Error is Caught", function(){
        req = {body: {payment: {test: "value"}}, headers: {'content-type': ""}};

        beforeEach(function() {
            statusObject = {isOK: true, success: {push: function (){}}};
            spyOn(statusObject.success, 'push').and.throwError("Catch this System Error");
            req.headers['content-type'] = "text/plain";
        });

        it("Should return an empty DTO", function () {
            var dto = createPaymentDTO(req, statusObject);
            expect(dto).toEqual({});
        });

        it("Should set statusObject error", function () {
            createPaymentDTO(req, statusObject);
            expect(typeof statusObject.error).toEqual('object');
        });
    });
});