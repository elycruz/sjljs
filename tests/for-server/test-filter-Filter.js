/**
 * Created by elydelacruz on 5/18/16.
 */

describe('sjl.filter.Filter', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    // Get filter constructor
    var Filter = sjl.filter.Filter;

    it ('should be a subclass of sjl.stdlib.Extendable', function () {
        expect(new Filter()).to.be.instanceof(sjl.stdlib.Extendable);
    });

    it ('should have the appropriate interface.', function () {
        expect((new Filter()).filter).to.be.instanceof(Function);
    });
});
