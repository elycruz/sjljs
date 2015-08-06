/**
 * Created by Ely on 8/6/2015.
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

describe('SjlMap', function () {

    "use strict";

    describe('#`sjl.SjlMap#clear`', function () { });
    describe('#`sjl.SjlMap#delete`', function () { });
    describe('#`sjl.SjlMap#entries`', function () { });
    describe('#`sjl.SjlMap#forEach`', function () { });
    describe('#`sjl.SjlMap#has`', function () { });
    describe('#`sjl.SjlMap#keys`', function () { });
    describe('#`sjl.SjlMap#values`', function () { });
    describe('#`sjl.SjlMap#get`', function () { });
    describe('#`sjl.SjlMap#set`', function () { });
    describe('#`sjl.SjlMap#addFromArray`', function () { });
    describe('#`sjl.SjlMap#iterator`', function () { });

});