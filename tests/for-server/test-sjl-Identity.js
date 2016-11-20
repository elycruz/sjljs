/**
 * Created by edlc on 11/14/16.
 */
describe('sjl.Identity', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    let chai = require('chai'),
        sjl = require('./../../src/sjl'),
        assert = chai.assert,
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    let Identity = sjl.ns.Identity,
        expectIdentity = identity => expect(identity).to.be.instanceOf(Identity);

    it ('should have the appropriate (monadic) interface.', function () {
        let identity = Identity();
        ['map', 'join', 'chain', 'ap'].forEach(function (key) {
            expect(identity[key]).to.be.instanceOf(Function);
        });
    });

    it ('should have a `of` static method.', function () {
        expect(Identity.of).to.be.instanceOf(Function);
    });

    describe ('#map', function () {
        let identity = Identity(2),
            pow = sjl.curry2(Math.pow),
            result = identity.map(pow(8));
        it ('should pass `Identity`\'s contained value to passed in function.', function () {
            expect(result.value).to.equal(64);
        });
        it ('should return a new instance of `Identity`.', function () {
            expect(result).to.be.instanceOf(Identity);
        });
    });

    describe ('#join', function () {
        it ('should remove one level of monadic structure on it\'s own type;  ' +
            'E.g., If it\'s inner value is of the same type.', function () {
            var innerMostValue = 5,
                identity1 = Identity(innerMostValue),
                identity2 = Identity(identity1),
                identity3 = Identity(identity2),
                identity4 = Identity(),
                expectInnerValueEqual = (value, value2) => expect(value).to.equal(value2),
                expectations = (result, equalTo) => {
                    expectIdentity(result);
                    expectInnerValueEqual(result.value, equalTo);
                };
                expectations(identity1.join(), innerMostValue);
                expectations(identity2.join(), innerMostValue);
                expectations(identity3.join(), identity1);
                expectations(identity4.join(), undefined);
        });
    });

    // describe ('#unwrap', function () {
    //     it ('should return it\'s contained value.', function () {
    //         let id1= Identity(1),
    //             id2 = Identity(),
    //             id3 = Identity(3),
    //             id4 = Identity(id3);
    //         expect(id1.unwrap()).to.equal(1);
    //         expect(id2.unwrap()).to.equal(undefined);
    //         expect(id4.unwrap()).to.equal(id3.unwrap());
    //     });
    // });

    describe ('#ap', function () {
        var add = sjl.curry2(function (a, b) { return a + b; }),
            multiply = sjl.curry2(function (a, b) { return a * b; }),
            idAdd = Identity(add),
            idMultiply = Identity(multiply),
            idMultiplyBy5 = idMultiply.ap(Identity(5));

        it ('Should effectively apply the function contents of one `Identity` obj to another.', function () {
            var result = idMultiplyBy5.ap(Identity(5)),
                result2 = idAdd.ap(Identity(3)).ap(Identity(5));
            expectIdentity(result);
            expectIdentity(result2);
            expect(result.value).to.equal(5 * 5);
            expect(result2.value).to.equal(8);
        });

        it ('should throw an error when trying to apply one Functor with a non ' +
            'function value in it to another.', function () {
            assert.throws(() => Identity(5).ap(Identity(3)), Error);
        });
    });

    describe ('#chain', function () {
        var split = function (str) { return str.split(''); },
            camelCase = sjl.camelCase,
            ucaseFirst = sjl.ucaseFirst,
            compose = sjl.compose,
            idSplit = compose(Identity, split),
            originalStr = 'hello-world',

            // Identity(['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd'])
            expectedStrTransform = compose(idSplit, ucaseFirst, camelCase)(originalStr),

            // Expected: Identity(['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd'])
            result = Identity(originalStr)
                .chain(camelCase)
                .chain(ucaseFirst)
                .chain(idSplit);

        it ('Should return a type of `Identity`.', function () {
            expectIdentity(result);
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
            var result2 = Identity(originalStr)
                .chain(camelCase)
                .chain(ucaseFirst)
                .chain(compose(Identity, idSplit));
            expectIdentity(result2);
            expectIdentity(result2.value);
            expect(result2.value.value).to.be.instanceOf(Array);
        });

    });

});
