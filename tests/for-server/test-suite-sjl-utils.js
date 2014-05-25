// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Utils', function () {

    "use strict";

    describe('#`argsToArray`', function () {

        var helloFunc = function hello () {},
            helloArray = ["a", "b", "c"];

        it ('should return an array for an arguments object.', function () {
            expect(Array.isArray(sjl.argsToArray(arguments))).to.equal(true);
        });

        describe ('when passed in args are [1, 2, "3", '
            + helloFunc + ', [' + helloArray + ']]', function () {
            var valuesToTest,
                valuesToPassIn = [1, 2, '3', helloFunc, helloArray];

            // Get values to test
            (function () {
                valuesToTest = sjl.argsToArray(arguments);
            })(1, 2, '3', helloFunc, helloArray);

            valuesToTest.forEach(function (val, i) {
                it ('Returned array should contain value "' + valuesToPassIn[i]
                    + '" of type "' + sjl.classOf(valuesToPassIn[i]) + '".', function () {
                    expect(val).to.equal(valuesToPassIn[i]);
                });
            });
        })

    });

    describe('#`isset`', function () {
        it('should return false for null value.', function () {
            expect(sjl.isset(null)).to.equal(false);
        });
        it('should return false for undefined value.', function () {
            expect(sjl.isset(undefined)).to.equal(false);
        });
        it('should return true for a defiend value (1).', function () {
            expect(sjl.isset(1)).to.equal(true);
        });
    });

    describe('#`empty`', function () {

        function makeEmptyTestsForValueMap(valMap, retValString) {
            Object.keys(valMap).forEach(function (key) {
                it('should return ' + retValString + ' for `' + key + '`', function () {
                    expect(sjl.empty(valMap[key])).to.equal(eval(retValString));
                });
            });
        }

        var emptyValueMap = {
                "0 value": 0,
                "null value": null,
                "undefined value": undefined,
                "empty string": "",
                "empty object": {},
                "empty array": []
            },

            nonEmptyValueMap = {
                "number other than zero": 1,
                "negative number": -1,
                "true value": true,
                "non-empty object": {a: 'b'},
                "non-empty array": [1],
                "non-empty string": "0"
            };

        // empty Should return true for empty values; I.e., 0, null, undefined, "", {}, []
        it('should return true for all ' +
            'empty values (0, null, undefined, "", {}, [])', function () {
            expect(sjl.empty(0, null, undefined, "", {}, [])).to.equal(true);
        });

        // Should return false for each in empty values
        makeEmptyTestsForValueMap(emptyValueMap, "true");

        // empty Should return false for all non-empty values
        it('should return false for all passed in non-empty ' +
            'values: [1], {hello: "world"}, "0", -1, true, 1', function () {
            expect(sjl.empty([1], {hello: "world"}, "0", -1, true, 1)).to.equal(false);
        });

        // Should return false for each in non-empty values
        makeEmptyTestsForValueMap(nonEmptyValueMap, "false");

    });

});