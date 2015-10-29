/**
 * Created by Ely on 7/8/2015.
 */
// Make test suite directly interoperable with the browser

var chai,
    sjl,
    expect,
    Iterator;

if (typeof window === 'undefined') {
    chai = require('chai');
    sjl = require('./../../src/es6/sjl.js');
}

if (typeof expect === 'undefined') {
    expect = chai.expect;
}

Iterator = sjl.package.stdlib.Iterator;

describe('sjl.package.stdlib.Iterator', function () {

    'use strict';

    var interfaceKeys = [
        'current', 'next', 'rewind', 'pointer', 'values', 'valid'
        ],
        basicArray = 'abcdefghijklmnopqrstuvwxyz'.split(''),
        iterator = new Iterator(basicArray);

    it ('should be able to return an iterator whether called as a function or not.', function () {
        expect(iterator instanceof Iterator).to.equal(true);
        expect((new Iterator(basicArray, 3)) instanceof Iterator).to.equal(true);
    });

    it ('should have it\'s main properties (`values` and `pointer`) set on an `__internal` object', function () {
        expect(sjl.issetObjKeyAndOfType(iterator.__internal, 'values', 'Array')).to.equal(true);
        expect(sjl.issetObjKeyAndOfType(iterator.__internal, 'pointer', 'Number')).to.equal(true);
    });

    //it ('should have the appropriate interface: [' + interfaceKeys.join(', ') + '] .', function () {
    //    expect(Object.keys(Iterator.prototype).filter(function (key) {
    //        return interfaceKeys.indexOf(key) > -1;
    //    }).length === interfaceKeys.length).to.equal(true);
    //});

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

    it ('should be able to set the __internal `pointer` via the `pointer` method.', function () {
        expect(iterator.pointer(16).pointer()).to.equal(16);
    });

    it ('should be able to set the __internal `values` via the `values` method.', function () {
        expect(iterator.values(['a', 'b', 'c']).values().length).to.equal(3);
    });

    it ('should be able to get the value at the `current` pointer position via the `current` method.', function () {
        expect(iterator.pointer(1).current().value).to.equal('b');
    });

});
