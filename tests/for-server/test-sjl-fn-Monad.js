/**
 * Created by edlc on 11/14/16.
 */
describe('sjl.Monad', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        assert = chai.assert,
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var Monad = sjl.ns.Monad,
        expectMonad = monad => expect(monad).to.be.instanceOf(Monad);

    it ('should have the appropriate (monadic) interface.', function () {
        var monad = Monad();
        ['map', 'join', 'chain', 'ap'].forEach(function (key) {
            expect(monad[key]).to.be.instanceOf(Function);
        });
    });

    it ('should have a `of` static method.', function () {
        expect(Monad.of).to.be.instanceOf(Function);
    });

    describe ('#map', function () {
        var monad = Monad(2),
            pow = sjl.curry2(Math.pow),
            result = monad.map(pow(8));
        it ('should pass `Monad`\'s contained value to passed in function.', function () {
            expect(result.value).to.equal(64);
        });
        it ('should return a new instance of `Monad`.', function () {
            expect(result).to.be.instanceOf(Monad);
        });
    });

    describe ('#join', function () {
        it ('should remove one level of monadic structure on it\'s own type;  ' +
            'E.g., If it\'s inner value is of the same type.', function () {
            var innerMostValue = 5,
                monad1 = Monad(innerMostValue),
                monad2 = Monad(monad1),
                monad3 = Monad(monad2),
                monad4 = Monad(),
                expectInnerValueEqual = (value, value2) => expect(value).to.equal(value2),
                expectations = (result, equalTo) => {
                    expectMonad(result);
                    expectInnerValueEqual(result.value, equalTo);
                };
                expectations(monad1.join(), innerMostValue);
                expectations(monad2.join(), innerMostValue);
                expectations(monad3.join(), monad1);
                expectations(monad4.join(), undefined);
        });
    });

    describe ('#ap', function () {
        var add = sjl.curry2(function (a, b) { return a + b; }),
            multiply = sjl.curry2(function (a, b) { return a * b; }),
            idAdd = Monad(add),
            idMultiply = Monad(multiply),
            idMultiplyBy5 = idMultiply.ap(Monad(5));

        it ('Should effectively apply the function contents of one `Monad` obj to another.', function () {
            var result = idMultiplyBy5.ap(Monad(5)),
                result2 = idAdd.ap(Monad(3)).ap(Monad(5));
            expectMonad(result);
            expectMonad(result2);
            expect(result.value).to.equal(5 * 5);
            expect(result2.value).to.equal(8);
        });

        it ('should throw an error when trying to apply one Functor with a non ' +
            'function value in it to another.', function () {
            assert.throws(() => Monad(5).ap(Monad(3)), Error);
        });
    });

    describe ('#chain', function () {
        var split = function (str) { return str.split(''); },
            camelCase = sjl.camelCase,
            ucaseFirst = sjl.ucaseFirst,
            compose = sjl.compose,
            idSplit = compose(Monad, split),
            originalStr = 'hello-world',

            // Monad(['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd'])
            expectedStrTransform = compose(idSplit, ucaseFirst, camelCase)(originalStr),

            // Expected: Monad(['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd'])
            result = Monad(originalStr)
                .chain(camelCase)
                .chain(ucaseFirst)
                .chain(idSplit);

        it ('Should return a type of `Monad`.', function () {
            expectMonad(result);
        });

        it ('Should apply passed in method.', function () {
            expect(result.value).to.be.instanceOf(Array);
            expect(result.value.length).to.equal(result.value.length);
            result.chain(function (value) {
                value.forEach(function (innerValue, index) {
                    expect(innerValue).to.equal(expectedStrTransform.value[index]);
                });
            });
        });

        it ('Should retain monadic structure when called.', function () {
            var result2 = Monad(originalStr)
                .chain(camelCase)
                .chain(ucaseFirst)
                .chain(compose(Monad, idSplit));
            expectMonad(result2);
            expectMonad(result2.value);
            expect(result2.value.value).to.be.instanceOf(Array);
        });

    });

    // describe ('#unwrap', function () {
    //     it ('should return it\'s contained value.', function () {
    //         let id1= Monad(1),
    //             id2 = Monad(),
    //             id3 = Monad(3),
    //             id4 = Monad(id3);
    //         expect(id1.unwrap()).to.equal(1);
    //         expect(id2.unwrap()).to.equal(undefined);
    //         expect(id4.unwrap()).to.equal(id3.unwrap());
    //     });
    // });

});
