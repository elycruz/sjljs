/**
 * Created by Ely on 7/8/2015.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('sjl.Iterator', function () {

    'use strict';

    var interfaceKeys = [
        'current', 'next', 'rewind', 'pointer', 'collection', 'valid'
        ],
        basicArray = 'abcdefghijklmnopqrstuvwxyz'.split(''),
        iterator = sjl.Iterator(basicArray);

    it ('should be able to return an iterator whether called as a function or not.', function () {
        expect(iterator instanceof sjl.Iterator).to.equal(true);
        expect((new sjl.Iterator(basicArray, 3)) instanceof sjl.Iterator).to.equal(true);
    });

    it ('should have it\'s main properties (`collection` and `pointer`) set on an `internal` object', function () {
        expect(sjl.issetObjKeyAndOfType(iterator.internal, 'collection', 'Array')).to.equal(true);
        expect(sjl.issetObjKeyAndOfType(iterator.internal, 'pointer', 'Number')).to.equal(true);
    });

    it ('should have the appropriate interface: [' + interfaceKeys.join(', ') + '] .', function () {
        expect(Object.keys(sjl.Iterator.prototype).filter(function (key) {
            return interfaceKeys.indexOf(key) > -1;
        }).length === interfaceKeys.length).to.equal(true);
    });

    it ('should be able to iterate through all values in `iterator`.', function () {
        var value;
        while (iterator.valid()) {
            value = iterator.next();
            expect(value.value).to.equal(basicArray[iterator.pointer() - 1]);
            expect(value.done).to.equal(false);
        }
    });

    it ('should be able to be rewound.', function () {
        expect(iterator.pointer()).to.equal(basicArray.length);
        expect(iterator.rewind().pointer()).to.equal(0);
    });

    it ('should be able to set the internal `pointer` via the `pointer` method.', function () {
        expect(iterator.pointer(16).pointer()).to.equal(16);
    });

    it ('should be able to set the internal `collection` via the `collection` method.', function () {
        expect(iterator.collection(['a', 'b', 'c']).collection().length).to.equal(3);
    });

    it ('should be able to get the value at the `current` pointer position via the `current` method.', function () {
        expect(iterator.pointer(1).current().value).to.equal('b');
    });

});
