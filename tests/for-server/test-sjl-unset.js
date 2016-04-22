/**
 * Created by elydelacruz on 4/16/16.
 */
describe('sjl.unset', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it ('should remove a property from an object.', function () {
        var helloWorld = {name: 'hello-world-object', message: 'hello-world'};
        expect(sjl.unset(helloWorld, 'message').hasOwnProperty('message')).to.be.false();
    });

    it ('should return true when the removal of the passed in proeprty was successful.', function () {
        var helloWorld = {name: 'hello-world-object', message: 'hello-world'};
        expect(sjl.unset(helloWorld, 'message')).to.be.true();
    });

});
