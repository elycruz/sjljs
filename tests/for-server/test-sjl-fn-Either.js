/**
 * Created by elyde on 11/25/2016.
 */
/**
 * Created by elyde on 11/20/2016.
 */
describe('sjl.Maybe', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var Either = sjl.ns.Either,
        Left = Either.Left,
        Right = Either.Right,
        either = Either.either,
        memberNames = ['Right', 'Left', 'either'],
        expectInstanceOf = sjl.curry2((Type, functor) => expect(functor).to.be.instanceOf(Type)),
        expectRight = expectInstanceOf(Right),
        expectLeft = expectInstanceOf(Left),
        math = sjl.ns.math;

    it ('should be an object', function () {
        expect(typeof Either).to.equal('object');
    });

    it (`should contain the following members: ${memberNames.join(',')}`, function () {
        var foundKeys = Object.keys(Either);
        expect(memberNames.length).to.equal(foundKeys.length);
        foundKeys.forEach(function (key) {
            expect(memberNames.indexOf(key)).to.be.greaterThan(-1);
        });
    });

    describe ('#Left', function () {
        it ('shouldn\'t be mappable (should return the same value no matter what when mapped)', function () {
            var leftValue = Left(2);
            expect(leftValue.map(sjl.curry(Math.pow, 99)).value).to.equal(leftValue.value);
            expectLeft(leftValue);
        });
    });

    describe ('#Right', function () {
        it ('should be mappable', function () {
            var rightValue = Right(2);
            expect(rightValue.map(sjl.curry(Math.pow, 99)).value).to.equal(99 * 99);
            expectRight(rightValue);
        });
        it ('should return an instance of `Left` when being mapped over if it\'s value is empty (undefined or null)', function () {
            var value = Right(null),
                result = value.map(sjl.curry(Math.pow, 99));
            expect(result.value).to.equal(null);
            expectLeft(result);
        });
    });

    describe ('#either', function () {
        it ('should return the right value applied to the `rightCallback` function when value is set (!null !undefined)', function () {
            var multiply = math.multiply,
                multiplyBy2 = multiply(2),
                multiplyBy3 = multiply(3),
                errorMessageCallback = function (value) {
                    return 'An error occurred.  Could not multiply ' + value + '.';
                };
            expect(either(multiplyBy2, multiplyBy3, Right(99))).to.equal(99 * 3);
            expect(either(errorMessageCallback, multiplyBy3, Right(null))).to.equal(errorMessageCallback(null));
        });
    });

});
