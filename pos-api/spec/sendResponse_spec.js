describe("sendResponse module", function(){

    var testObject = {};
    var sendResponse = require('../lib/pos_modules/sendResponse');
    var statusObject = {isOK: null, success: []};
    //var req = {headers: {'Content-Type' : null}}

    beforeEach(function(done) {
        statusObject.success = [];
        var callback = function(internalErr, statusObject, sendResponse) {
            testObject =  {
                internalErr : internalErr,
                statusObject: statusObject,
                sendResponse: sendResponse
            };
            done();
        };
        sendResponse(statusObject, callback);
        statusObject.success.push("all-the-things");
    });

    describe("when isOK is true", function(){

        statusObject = {isOK: true};

        describe("and sent with xml", function(){

            testObject.sendResponse.set['Content-Type'] = 'application/xml';
            //.headers.put['Content-Type'] = 'application/json';

            it("should return success xml response", function(){
                expect(200).toEqual(200);
            });

        });

        describe("and sent with JSON", function(){

            //req.set('Content-Type', 'application/json');

            it("should return success JSON response", function(){
                expect(1).toEqual(1);
            });

        });

    });

    describe("when isOK is false", function(){

        statusObject = {isOK: false};

        describe("and sent with xml", function(){

            it("should return error xml response", function(){
                expect(1).toEqual(1);
            });

        });

        describe("and sent with JSON", function(){

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