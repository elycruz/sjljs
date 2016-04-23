/**
 * Created by Ely on 8/6/2015.
 */

describe('SjlSet', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var SjlSet = sjl.ns.stdlib.SjlSet;

    function validateHasFunction (obj, funcName) {
        it ('should have a `' + funcName + '` function.', function () {
            // Ensure set has `funcName` function
            expect(sjl.classOf(obj[funcName])).to.equal('Function');
        });
    }

    describe('#Set Methods', function () {
        var methods = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'],
            sjlSet = new SjlSet([1, 2, 3, 4, 5]);
        describe ('should have methods [`' + methods.join('`, `') + '`].', function () {
            methods.forEach(function (method) {
                validateHasFunction(sjlSet, method);
            });
        });
    });

    describe('#`SjlSet#add`', function () {
        var sjlSet = new SjlSet([1, 2, 3, 4, 5, 6, 6, 5, 4]),
            expected = [1, 2, 3, 4, 5, 6];

        it ('should be able to add unique values', function () {
            // Validate size of set
            expect(sjlSet.size).to.equal(6);

            // Validate indexes
            sjlSet.forEach(function (value, index) {
                expect(value).to.equal(expected[index]);
            });
        });
    });

    describe('#`SjlSet#clear, size`', function () {
        var sjlSet = new SjlSet([1, 2, 3, 4, 5]);

        it ('should return `self`.', function () {
            expect(sjlSet.size).to.equal(5);
            // Ensure `clear` returns `self`
            expect(sjlSet.clear()).to.equal(sjlSet);
        });
        it ('should set `size` to `0` as a side effect.', function () {
            // Validate size of set
            expect(sjlSet.size).to.equal(0);
        });
    });

    describe('#`SjlSet#entries, valid, next`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            sjlSet = new SjlSet(values),
            iterator = sjlSet.entries(),
            value;

        it ('should have an `entries` function.', function () {
            expect(typeof sjlSet.entries).to.equal('function');
        });

        // Validate
        it ('should work as an iterator with included extra functions (`valid`).', function () {
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.done).to.equal(false);
                expect(value.value[0]).to.equal(values[iterator.pointer() - 1]);
            }
        });
    });

    describe('#`SjlSet#forEach`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            expectedLength = 6,
            sjlSet = new SjlSet(values),
            exampleContext = {someProperty: 'someValue'},
            indexCount = 0;

        it ('should exists and be of type `Function`.', function () {
            // Validate set has `forEach` method
            expect(typeof sjlSet.forEach).to.equal('function');
        });

        it ('should work as expected when no context is passed in as the 3rd parameter.', function () {
            // Validate `forEach` method works as expected
            sjlSet.forEach(function (value, index, array) {
                expect(array.length).to.equal(expectedLength);
                expect(values[index]).to.equal(value);
                expect(index).to.equal(indexCount);
                expect(this).to.equal(undefined);
                indexCount += 1;
            });
        });

        it ('should work as expected when a context is passed in.', function () {
            // Reset the index count
            indexCount = 0;

            // Validate `forEach` method works as expected
            sjlSet.forEach(function (value, index, array) {
                expect(array.length).to.equal(expectedLength);
                expect(values[index]).to.equal(value);
                expect(index).to.equal(indexCount);
                expect(this).to.equal(exampleContext);
                indexCount += 1;
            }, exampleContext);
        });

    });

    describe('#`SjlSet#has`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            valueInSet = 5,
            valueNotInSet = 8,
            sjlSet = new SjlSet(values);
        it ('should return `false` for values not in set.', function () {
            expect(sjlSet.has(valueNotInSet)).to.equal(false);
        });
        it ('should return `true` for values in set.', function () {
            expect(sjlSet.has(valueInSet)).to.equal(true);
        });
    });

    describe('#`SjlSet#keys`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            sjlSet = new SjlSet(values);
        it ('should return an iterable object.', function () {
            var iterator = sjlSet.keys(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(values[index]);
                index += 1;
            }
        });
    });

    describe('#`SjlSet#values`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            sjlSet = new SjlSet(values);
        it ('should return an iterable', function () {
            var iterator = sjlSet.values(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(values[index]);
                index += 1;
            }
        });
    });

    describe('#`SjlSet#addFromArray`', function () {
        it ('should import unique values from an array.', function () {
            var values = [1, 2, 3, 4, 5],
                otherValues = [6, 7, 8, 9, 10],
                expectedValues = values.concat(otherValues),
                sjlSet = new SjlSet(values),
                value,
                index = 0,
                iterator;
            sjlSet.addFromArray(otherValues);
            iterator = sjlSet.values();
            expect(sjlSet.size).to.equal(expectedValues.length);
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(expectedValues[index]);
                index += 1;
            }
        });
    });

    describe('#`SjlSet#iterator`', function () {
        var values = [1, 2, 3, 4, 5, 6, 6, 5, 4],
            sjlSet = new SjlSet(values);
        it ('should return an iterable object which contains values.', function () {
            var iterator = sjlSet.iterator(),
                value,
                index = 0;
            while (iterator.valid()) {
                value = iterator.next();
                expect(value.value).to.equal(values[index]);
                index += 1;
            }
        });
    });

});
