/**
 * Created by elydelacruz on 4/16/16.
 */
describe('#sjl.isEmptyOrNotOfType', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    function randNum(start, end) {
        return Math.floor(Math.random() * end + start);
    }

    function generateRandomPrimitiveName (notName) {
        var name = notName,
            names = [
                String.name,
                Boolean.name,
                Function.name,
                Number.name,
                Object.name
            ],
            namesLen = names.length;

        if (typeof notName === 'undefined') {
            name = names[randNum(0, namesLen)];
        }
        while (name === notName) {
            name = names[randNum(0, namesLen)];
        }
        return name;
    }

    var emptyTestArgs = [
            [[], '[]', Array],
            [{}, '{}', Object],
            ['', '""', String],
            [0, '0', Number],
            [false, 'false', Boolean],
            [null, 'null', 'Null'],
            [undefined, 'undefined', 'Undefined']
        ],
        emptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        }),
        nonEmptyTestArgs = [
            [['hello'], '["hello"]', Array],
            [{someProp: 'some-prop-value'}, '{someProp: "some-prop-value"}', Object],
            ['hello-world', 'hello-world', String],
            [1, '1', Number],
            [-1, '-1', Number],
            [true, 'true', Boolean],
            [function () {}, 'function () {}', Function]
        ],
        nonEmptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        });

    it('should return true for empty values [' + emptyValueReps.join(',') + '].', function () {
        emptyTestArgs.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.true();
        });
    });

    it('should return false for non empty values [' + nonEmptyValueReps.join(',') + '].', function () {
        nonEmptyTestArgs.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.false();
        });
    });

    it ('should return false for values that are not empty and match the passed in `type`.', function () {
        nonEmptyTestArgs.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.false();
        });
    });

    it ('should return true for values that do not match the passed `type`.', function () {
        var argsForTest = JSON.parse(JSON.stringify(nonEmptyTestArgs)).map(function (args) {
            var valueType = sjl.classOf(args[0]);
            args[2] = generateRandomPrimitiveName(valueType);
            return args;
        });
        // Ensure a function case is in the test args since JSON.stringify will
        // remove all properties that have a function value.
        argsForTest.push([function () {}, 'function () {}', String]);

        // Run tests
        argsForTest.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.true();
        });
    });

    it('should return true when no params are passed in.', function () {
        expect(sjl.isEmptyOrNotOfType()).to.equal(true);
    });

});
