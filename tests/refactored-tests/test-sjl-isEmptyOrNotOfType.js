/**
 * Created by elydelacruz on 4/16/16.
 */
// ~~~ STRIP ~~~
// This part gets stripped out when
// generating browser version of test(s).
'use strict';
var chai = require('chai'),
    sjl = require('./../../src/sjl'),
    expect = chai.expect,
    should = chai.should;
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

describe('#sjl.isEmptyOrNotOfType', function () {
    var emptyTestArgs = [
            [[], '[]'],
            [{}, '{}'],
            ['', '""'],
            [0, '0'],
            [false, 'false'],
            [null, 'null'],
            [undefined, 'undefined']
        ],
        emptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        }),
        nonEmptyTestArgs = [
            [['hello'], '["hello"]'],
            [{someProp: 'some-prop-value'}, '{someProp: "some-prop-value"}'],
            ['hello-world', 'hello-world'],
            [1, '1'],
            [-1, '-1'],
            [true, 'true'],
            [function () {
            }, 'function () {}']
        ],
        nonEmptyValueReps = emptyTestArgs.map(function (args) {
            return args[1];
        });

    it('should return true for empty values [' + emptyValueReps.join(',') + '].', function () {
        emptyTestArgs.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0])).to.be.true();
        });
    });

    it('should return false for non empty values [' + nonEmptyValueReps.join(',') + '].', function () {
        nonEmptyTestArgs.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0])).to.be.false();
        });
    });

    it ('should return false for values that are not empty and match the passed in `type`.', function () {
        var argsForTest = nonEmptyTestArgs.map(function (args) {
            return args.concat([ sjl.classOf(args[0]) ]);
        });
        argsForTest.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.false();
        });
    });

    it ('should return true for values that do not match the passed `type`.', function () {
        var argsForTest = nonEmptyTestArgs.map(function (args) {
            var valueType = sjl.classOf(args[0]);
            return args.concat([ generateRandomPrimitiveName(valueType) ]);
        });
        argsForTest.forEach(function (args) {
            expect(sjl.isEmptyOrNotOfType(args[0], args[2])).to.be.true();
        });
    });

    it('should return true when no params are passed in.', function () {
        expect(sjl.isEmptyOrNotOfType()).to.equal(true);
    });

});
