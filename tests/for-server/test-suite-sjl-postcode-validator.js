/**
 * Created by edelacruz on 7/28/2014.
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

describe('#`sjl.PostCodeValidator`', function () {

    'use strict';

    describe('#`sjl.PostCodeValidator`', function () {
        var regionAndPostalCodeMap = {
            'CA': ['P2N', 'K8N 5W6', 'K9J 0E6'],
            'US': ['10026', '10000', '10026-0341'],
            'GB': ['EC1A 1BB', 'W1A 0AX', 'M1 1AE', 'B33 8TH', 'CR2 6XH', 'DN55 1PT']
        },
            validator = new sjl.PostCodeValidator();

        Object.keys(regionAndPostalCodeMap).forEach(function (region) {
            regionAndPostalCodeMap[region].forEach(function (postalCode) {
                it ('should match postal code "' + postalCode + '" for region "' + region + '":', function () {
                    expect(validator.region(region).value(postalCode).isValid()).to.equal(true);
                });
            });
        });

    });

});
