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

describe ('#sjl.extractFromArrayAt', function () {

    'use strict';

    it ('should return an array containing the extracted value and the resulting spliced array.', function () {

    });

    it ('should return a [new array by default and return the extracted value .', function () {
        var testArray = ['a', 'b', 'c', 'd', 'e'];
        testArray.forEach(function (elm, index, list) {
            var result = sjl.extractFromArrayAt(list, index),
                extractedValue = result[0],
                splicedArray = result[1];
            expect(extractedValue).to.equal(list[index]);
            expect(splicedArray).to.not.equal(list);
            expect(splicedArray.length).to.not.equal(list.length);
            expect(splicedArray.indexOf(extractedValue)).to.equal(-1);
            console.log(result);
        });
    });

});
