
describe('Iterator', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var interfaceKeys = [
        'current', 'next', 'rewind', 'valid'
        ],
        basicArray = 'abcdefghijklmnopqrstuvwxyz'.split(''),
        Iterator = sjl.ns.stdlib.Iterator,
        iterator = new Iterator(basicArray);

    it ('should be able to return an iterator whether called as a function or not.', function () {
        expect(iterator instanceof Iterator).to.equal(true);
        expect((new Iterator(basicArray, 3)) instanceof Iterator).to.equal(true);
    });

    it ('should have it\'s main properties (`values` and `pointer`) set on an `__internal` object', function () {
        expect(sjl.issetAndOfType(iterator.values, 'Array')).to.equal(true);
        expect(sjl.issetAndOfType(iterator.pointer, 'Number')).to.equal(true);
    });

    it ('should have the appropriate interface: [' + interfaceKeys.join(', ') + '] .', function () {
        expect(Object.keys(Iterator.prototype).filter(function (key) {
            return interfaceKeys.indexOf(key) > -1;
        }).length === interfaceKeys.length).to.equal(true);
    });

    it ('should be able to iterate through all values in `iterator`.', function () {
        var value;
        while (iterator.valid()) {
            value = iterator.next();
            expect(value.value).to.equal(basicArray[iterator.pointer - 1]);
            expect(value.done).to.equal(false);
        }
    });

    it ('should be able to be rewound.', function () {
        expect(iterator.pointer).to.equal(basicArray.length);
        expect(iterator.rewind().pointer).to.equal(0);
    });

    it ('should be able to set the __internal `pointer` via the `pointer` method.', function () {
        iterator.pointer = 16;
        expect(iterator.pointer).to.equal(16);
    });

    it ('should be able to set the __internal `values` via the `values` method.', function () {
        iterator.values = ['a', 'b', 'c'];
        expect(iterator.values.length).to.equal(3);
    });

    it ('should be able to get the value at the `current` pointer position via the `current` method.', function () {
        iterator.pointer = 1;
        expect(iterator.current().value).to.equal('b');
    });

});
