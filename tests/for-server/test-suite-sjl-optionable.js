/**
 * Created by Ely on 12/17/2014.
 */

"use strict";

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    require('./../../sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Optionable', function () {

    // Some test values
    var engToSpaSalutations = {
            goodafternoon: 'buenas tardes',
            goodevening: 'buenas noches',
            goodnight: 'buenas noches'
        },

        jpaToEngSalutations = {
            konichiwa: 'good afternoon',
            konbanwa: 'good evening',
            oyasuminasai: 'good night'
        },

        spaToJpaSalutations = {
            buenastardes: 'konichiwa',
            buenasnoches: 'konbanwa|oyasuminasai'
        },
        mergedOptions = sjl.extend({}, engToSpaSalutations, spaToJpaSalutations, jpaToEngSalutations),
        mergedOptionsKeys = Object.keys(mergedOptions),
        originalValues = mergedOptions,
        newValues = (function () {
            var out = {};
            mergedOptionsKeys.forEach(function (key, i) {
                out[key] = 'new value ' + (i + 1);
            });
            return out;
        }()),
        otherValues = (function () {
            var out = {};
            mergedOptionsKeys.forEach(function (key, i) {
                out[key] = 'other value ' + (i + 1);
            });
            return out;
        }()),
        getOptionableObj = function (options) {
            if (options) {
                return new sjl.Optionable(options);
            }
            return new sjl.Optionable(
                engToSpaSalutations,
                jpaToEngSalutations,
                spaToJpaSalutations
            );
        };

    // Test 1
    describe ('#`mergeOptions`', function () {

        // Test 1.1
        describe('It should merge all object arguments to the options property of the `Optionable` object being called.', function () {
            var optionable = getOptionableObj();
            mergedOptionsKeys.forEach(function (key) {
                it('"' + key + '" key should equal value "' + mergedOptions[key] + '".', function () {
                    expect(optionable.options[key]).to.equal(mergedOptions[key]);
                });
            });
        }); // end of Test 1.1

        // Test 1.2
        describe('It should overwrite any existing values on the options property with the ones passed into it.', function () {
            var optionable = getOptionableObj();
            optionable.mergeOptions(newValues);
            mergedOptionsKeys.forEach(function (key) {
                it ('should have a key "' + key + '" with a new value "' + newValues[key] + '"', function () {
                    expect(optionable.options[key]).to.equal(newValues[key]);
                });
            });
        }); // end of Test 1.2

        // Test 1.3
        describe('It should overwrite all values with the latest values passed in in a set of values.', function () {
            var optionable = getOptionableObj(newValues);
            optionable.mergeOptions(newValues, originalValues, otherValues);
            mergedOptionsKeys.forEach(function (key) {
                it ('should have a key "' + key + '" with an other value "' + otherValues[key] + '"', function () {
                    expect(optionable.options[key]).to.equal(otherValues[key]);
                });
            });
        });

    }); // end of Test 1.0

}); // end of Test Suite
