/**
 * Created by Ely on 6/21/2014.
 */
// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Attributable', function () {

    'use strict';

    var Attributable = sjl.ns.stdlib.Attributable,
        attributable = new Attributable({
            nullValue:              null,
            undefinedValue:         undefined,
            nonEmptyStringValue:    'hello',
            emptyStringValue:       '',
            nonEmptyNumberValue:    1,
            emptyNumberValue:       0,
            nonEmptyBooleanValue:   true,
            emptyBooleanValue:      false,
            functionValue:       function HelloWorld () {},
            emptyObjectValue:    {},
            nonEmptyObjectValue: {all:{your:{base:{are:{belong:{to:{us:{}}}}}}}},
            emptyArrayValue:     [],
            nonEmptyArrayValue:  [1]
        });

    describe('#`attr` and #`attr`', function () {

        it ('should be able to set and/or get one attribute value.', function () {
            // Set attrib to not `null`
            attributable.attr('nullValue', 'not-null-value');
            expect(attributable.attr('nullValue')).to.equal('not-null-value');

            // Set attrib to `null`
            attributable.attr('nullValue', null);
            expect(attributable.attr('nullValue')).to.equal(null);
        });

        it ('should be able to set and/or get multiple attributes in one call.', function () {
            var keysBeingUsed = ['nullValue', 'emptyStringValue', 'nonEmptyBooleanValue'],
                originalValues = attributable.attr(['nullValue', 'emptyStringValue', 'emptyBooleanValue']),
                nonOriginalValues = {
                    nullValue: 'not-null-value',
                    emptyStringValue: 'non-empty-string-value',
                    emptyBooleanValue: true
                },
                returnedValues;

            // Verify original values were returned
            expect(originalValues['nullValue']).to.equal(null);
            expect(sjl.classOfIs(originalValues['emptyStringValue'], 'String')
                && originalValues.emptyStringValue.length === 0).to.equal(true);
            expect(originalValues.emptyBooleanValue).to.equal(false);

            // Set multiple attributes
            attributable.attr(nonOriginalValues);

            // Get multiple attribute values
            returnedValues = attributable.attr(keysBeingUsed);

            // Verify values were set properly on attributable
            keysBeingUsed.forEach(function (key) {
                    expect(returnedValues[key]).to.equal(attributable.attr(key));
                });

            // Reset attributable object
            attributable.attr(originalValues);

        });

    });

});
