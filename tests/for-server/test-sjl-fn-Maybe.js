/**
 * Created by elyde on 11/20/2016.
 */
describe('sjl.Maybe', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    let chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var Maybe = sjl.ns.Maybe,
        Just = Maybe.Just,
        Nothing = Maybe.Nothing,
        maybe = Maybe.maybe,
        memberNames = ['Just', 'Nothing', 'nothing', 'maybe'],
        expectInstanceOf = sjl.curry2((Type, functor) => expect(functor).to.be.instanceOf(Type)),
        expectNothing = expectInstanceOf(Nothing),
        expectJust = expectInstanceOf(Just);

    it ('should be an object', function () {
        expect(typeof Maybe).to.equal('object');
    });

    it (`should contain the following members: ${memberNames.join(',')}`, function () {
        var foundKeys = Object.keys(Maybe);
        expect(memberNames.length).to.equal(foundKeys.length);
        foundKeys.forEach(function (key) {
            expect(memberNames.indexOf(key)).to.be.greaterThan(-1);
        });
    });

    describe ('#Just', function () {
        it ('should return an instance when receiving any value', function () {
            [null, undefined, 99, 0, -1, true, false, [1,2,3], {}, {a: 'b'}, () => {}]
                .forEach(function (value) {
                    expectJust(Just(value));
                });
        });
        it ('should return an instance of itself even when receiving no value', function () {
            expectJust(Just());
        });

        describe ('#map', function () {
            var someFn = function (value) { return value.toString(); };
            it('should return nothing when contained value is `null` or `undefined`', function () {
                expectNothing(Just().map(someFn));
                expectNothing(Just(null).map(someFn));
                expectNothing(Just(undefined).map(someFn));
            });
            expectJust(Just(-1).map(someFn));
            expectJust(Just(0).map(someFn));
            expectJust(Just(1).map(someFn));
            [-1, 0, 1, true, false, [1,2,3], {}, {a: 'b'}, () => {}]
                .forEach(function (value) {
                    it ('should return an instance of `Just` when contained value is ' +
                        '`' + value.toString() + '`', function () {
                        expectJust(Just(value).map(someFn));
                    });
                });

        });
    });

    describe ('#Nothing', function () {
        describe ('should return `Nothing` for it\'s monadic interface [map, ap, join, chain]', function () {
            var someFn = function (value) { return value * 2; },
                someMonad = Just(99);
            it ('should return `Nothing` for `map`.', function () {
                expectNothing(Nothing(100).map(someFn));
                expectNothing(Nothing(99).map(someFn));
                expectNothing(Nothing(Just(98)).map(someFn));
            });
            it ('should return `Nothing` for `join` even when nested has `Nothing`s.', function () {
                expectNothing(Nothing(Nothing(98)).join());
                expectNothing(Nothing(Just(99)).join());
                expectNothing(Nothing(99).join());
                expectNothing(Nothing().join());
            });
            it ('should return `Nothing` for `ap`.', function () {
                expectNothing(Nothing(98).ap(someMonad));
                expectNothing(Nothing(Just(99)).ap(someMonad));
            });
            it ('should return `Nothing` for `chain`.', function () {
                expectNothing(Nothing(97).chain(someFn));
                expectNothing(Nothing(Just(96)).chain(someFn));
            });
        });

    });

    describe ('#maybe', function () {
        it ('should return the replacement value when value to check is not set (null | undefined)', function () {
            var just100 = Just(100),
                justNull = Just(null),
                id = sjl.ns.fn.id,
                justTimes2 = incomingJust => Just(value => value * 2).ap(incomingJust);
            expect(maybe(just100, id, justNull)).to.equal(just100);
            expect(maybe(Just(99), justTimes2, just100).value).to.equal(200);
            expect(maybe(Just(1000), justTimes2, Just(null)).value).to.equal(1000);
            expect(maybe(Just(2000), justTimes2, Just(1000)).value).to.equal(2000);
        });
    });

});
