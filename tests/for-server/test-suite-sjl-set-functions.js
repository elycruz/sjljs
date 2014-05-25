/**
 * Created by Ely on 5/24/2014.
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

describe('Sjl Set Functions', function () {

    "use strict";

    var funcNames = ['extend', 'intersection', 'merge',
        'restrict', 'subtract', 'union'];

    // Check that the set functions are defined
    funcNames.forEach(function (funcName) {
        it ('should have `'+ funcName + '` function.', function () {
            expect((sjl.hasOwnProperty(funcName)
                && typeof sjl[funcName] === 'function')).to.equal(true);
        });
    });

});