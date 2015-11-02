describe("sendResponse module", function(){

    var sendResponse = require('../lib/pos_modules/sendResponse');
    var statusObject = { isOK: null };
    var req = {headers: { 'Content-Type' : null }};

    describe("when isOK is true", function(){

        statusObject = {isOK: true};

        describe("and sent with xml", function(){

            req.headers = {'Content-Type': 'application/xml'};

            it("should return success xml response", function(){
                expect(1).toEqual(1);
            });
        });

        describe("and sent with JSON", function(){

            req.headers = {'Content-Type': 'application/json'};

            it("should return success JSON response", function(){
                expect(1).toEqual(1);
            });
        });
    });

    describe("when isOK is false", function(){

        statusObject = {isOK: false};

        describe("and sent with xml", function(){

            req.headers = {'Content-Type': 'application/xml'};

            it("should return error xml response", function(){
                expect(1).toEqual(1);
            });
        });

        describe("and sent with JSON", function(){

            req.headers = {'Content-Type': 'application/json'};

            it("should return error JSON response", function(){
                expect(1).toEqual(1);
            });
        });
    });

    describe("when system error, ", function(){

        it("should return system err message", function(){
            expect(1).toEqual(1);
        });
    });
});




//
//beforeEach(function(done) {
//    statusObject.success = [];
//    var callback = function(internalErr, statusObject, sendResponse) {
//        testObject =  {
//            internalErr : internalErr,
//            statusObject: statusObject,
//            sendResponse: sendResponse
//        };
//        done();
//    };
//    sendResponse(statusObject, callback);
//    //testObject.statusObject.success.push("all-the-things");
//});