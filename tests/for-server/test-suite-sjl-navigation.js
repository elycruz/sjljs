/**
 * Created by Ely on 8/19/2015.
 */

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
    require('./../../src/sjl/navigation/BaseContainer');
    require('./../../src/sjl/navigation/BasePage');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('sjl.package().navigation', function () {

    'use strict';

});