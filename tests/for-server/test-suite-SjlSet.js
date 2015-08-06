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

describe('SjlSet', function () {

    "use strict";

    describe('#`sjl.SjlSet#add`', function () { });
    describe('#`sjl.SjlSet#clear`', function () { });
    describe('#`sjl.SjlSet#entries`', function () { });
    describe('#`sjl.SjlSet#forEach`', function () { });
    describe('#`sjl.SjlSet#has`', function () { });
    describe('#`sjl.SjlSet#keys`', function () { });
    describe('#`sjl.SjlSet#values`', function () { });
    describe('#`sjl.SjlSet#addFromArray`', function () { });
    describe('#`sjl.SjlSet#iterator`', function () { });

});