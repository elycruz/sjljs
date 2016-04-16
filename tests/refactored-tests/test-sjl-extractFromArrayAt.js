/**
 * Created by Ely on 4/15/2016.
 * File: test-sjl-restArgs.js
 */
// ~~~ STRIP ~~~
// This part gets stripped out when
// generating browser version of test(s).
var chai = require('chai'),
    sjl = require('./../../src/sjl'),
    expect = chai.expect;
// ~~~ /STRIP ~~~

describe('#sjl.extractFromArrayAt', function () {

    'use strict';

    describe('When passing in only `array` and `index`.', function () {
        var testArray = ['a', 'b', 'c', 'd', 'e'],
            stringOfTestArray = '[' + testArray.join(',') + ']';

        // Loop through testArray and generate tests based on current element in loop
        testArray.forEach(function (elm, index, list) {
            var result = sjl.extractFromArrayAt(list, index),
                extractedValue = result[0],
                splicedArray = result[1];
            it('should extract "' + list[index] + '" from `' + stringOfTestArray + '`.', function () {
                expect(extractedValue).to.equal(list[index]);
            });
            it('should return an array with the extracted value, and the newly spliced array in it.', function () {
                expect(splicedArray).to.not.equal(list);
                expect(splicedArray.length).to.not.equal(list.length);
                expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
                expect(result.length).to.equal(2);
            });
            // console.log(result);
        });
    });

    describe('When passing in `array`, `index`, and `type`.', function () {

        // Array<[constructor, value, expected-outcome]>
        // @type {Array<[Constructor, *, Boolean]>}
        var testArray = [
                [Array, ['hello']],
                [Boolean, true],
                [Function, (function () {
                })],
                [Object, {someObjectName: 'some-object-name'}],
                [String, 'hello-world']
            ],
            testArrayValues = testArray.map(function (elm, index, list) {
                return elm[1];
            }),
            testArrayTypes = testArray.map(function (elm, index, list) {
                return elm[0];
            }),
            stringOfTestArray = '[' + testArray.join(',') + ']';

        // Loop through testArray and generate tests based on current element in loop
        testArrayTypes.forEach(function (type, index) {
            var result = sjl.extractFromArrayAt(testArrayValues, index, type),
                extractedValue = result[0],
                splicedArray = result[1];
            it('should extract value from array if it is of the passed in type.', function () {
                expect(extractedValue).to.equal(testArrayValues[index]);
            });
            it('should extract "' + testArrayValues[index] + '" from `' + stringOfTestArray + '`.', function () {
                expect(extractedValue).to.equal(testArrayValues[index]);
            });
            it('should return an array with the extracted value, and the newly spliced array in it.', function () {
                expect(splicedArray).to.not.equal(testArrayValues);
                expect(splicedArray.length).to.not.equal(testArrayValues.length);
                expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
                expect(result.length).to.equal(2);
            });
            // console.log(result);
        });
    });

    describe('When value to extracts `type` doesn\'t match passed in `type`.', function () {
        // Array<[constructor, value, expected-outcome]>
        // @type {Array<[Constructor, *, Boolean]>}
        var testArray = [
                [Array, ['hello']],
                [Boolean, true],
                [Function, (function () {
                })],
                [Object, {someObjectName: 'some-object-name'}],
                [String, 'hello-world']
            ],
            testArrayValues = testArray.map(function (elm, index, list) {
                return elm[1];
            }),
            testArrayTypes = testArray.map(function (elm, index, list) {
                return elm[0];
            });

        it('should return null for values that do not match the type value in an array.', function () {
            testArrayTypes.reverse().forEach(function (type, index) {
                var result = sjl.extractFromArrayAt(testArrayValues, index, type),
                    extractedValue = result[0],
                    splicedArray = result[1];
                it('should return `null` when value to extract doesn\'t match .', function () {
                    expect(extractedValue).to.equal(null);
                });
                it('should return a new unspliced array when value to extract doesn\'t match passed in type.', function () {
                    expect(splicedArray).to.not.equal(testArrayValues);
                    expect(splicedArray.length).to.equal(testArrayValues.length);
                    expect(result.length).to.equal(2);
                });
            })
        });
    });

    describe('When passing in `array`, `index`, `type`, and `makeCopyOfArray`.', function () {
        // Array<[constructor, value, expected-outcome]>
        // @type {Array<[Constructor, *, Boolean]>}
        var testArray = [
                [Array, ['hello']],
                [Boolean, true],
                [Function, (function () {
                })],
                [Object, {someObjectName: 'some-object-name'}],
                [String, 'hello-world']
            ],
            testArrayValues = testArray.map(function (elm, index, list) {
                return elm[1];
            }),
            testArrayTypes = testArray.map(function (elm, index, list) {
                return elm[0];
            });


        // Loop through testArray and generate tests based on current element in loop
        testArrayTypes.forEach(function (type, index) {
            var result = sjl.extractFromArrayAt(testArrayValues, index, type, true),
                extractedValue = result[0],
                splicedArray = result[1];
            it('should return an array with the extracted value, and the newly spliced array in it.', function () {
                expect(splicedArray).to.not.equal(testArrayValues);
                expect(splicedArray.length).to.not.equal(testArrayValues.length);
                expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
                expect(result.length).to.equal(2);
            });
            // console.log(result);
        });

        // Loop through testArray and generate tests based on current element in loop
        testArrayTypes.forEach(function (type, index) {
            var result = sjl.extractFromArrayAt(testArrayValues, index, type, false),
                extractedValue = result[0],
                splicedArray = result[1];
            it('should return an array with the extracted value, and the spliced array in it.', function () {
                expect(splicedArray).to.equal(testArrayValues);
                expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
                expect(testArrayValues.indexOf(extractedValue)).to.equal(-1);
                expect(result.length).to.equal(2);
            });
            // console.log(result);
        });
    });

});
