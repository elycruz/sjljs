/**
 * Created by elyde on 11/19/2016.
 */

describe('sjl.version', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    it ('should be set.', function () {
        // @note below member is imported as side effect for node version only
        // (it is bundled with the browser version)
        var version = sjl.isNodeEnv ? require('./../../src/generated/version') : sjl.version;
        expect(sjl.notEmptyAndOfType(version, String)).to.equal(true);
    });

});