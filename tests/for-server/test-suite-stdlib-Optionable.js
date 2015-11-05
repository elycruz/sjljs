/**
 * Created by Ely on 12/17/2014.
 */

'use strict';

// Make test suite directly interoperable with the browser
if (typeof window === 'undefined') {
    var chai = require('chai');
    var sjl = require('./../../src/sjl/sjl.js');
}

// Get chai.expect
if (typeof expect === 'undefined') {
    var expect = chai.expect;
}

describe('Sjl Optionable', function () {

    // Some test values
    var Optionable = sjl.package.stdlib.Optionable,
        engToSpaSalutations = {
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
                return new Optionable(options);
            }
            return new Optionable(
                engToSpaSalutations,
                jpaToEngSalutations,
                spaToJpaSalutations
            );
        },

        allYourBase = {all: {your: {base: {are: {belong: {to: {us: {someValue: 99}}}}}}}};

    // Test 1
    describe ('#`merge`', function () {

        // Test 1.1
        describe('It should merge all object arguments to the options property of the `Optionable` object being called.', function () {
            var obj = getOptionableObj();
            mergedOptionsKeys.forEach(function (key) {
                it('"' + key + '" key should equal value "' + mergedOptions[key] + '".', function () {
                    expect(obj.options[key]).to.equal(mergedOptions[key]);
                });
            });
        }); // end of Test 1.1

        // Test 1.2
        describe('It should overwrite any existing values on the options property with the ones passed into it.', function () {
            var obj = getOptionableObj();
            obj.merge(newValues);
            mergedOptionsKeys.forEach(function (key) {
                it ('should have a key "' + key + '" with a new value "' + newValues[key] + '"', function () {
                    expect(obj.options[key]).to.equal(newValues[key]);
                });
            });
        }); // end of Test 1.2

        // Test 1.3
        describe('It should overwrite all values with the latest values passed in in a set of values.', function () {
            var obj = getOptionableObj(newValues);
            obj.merge(newValues, originalValues, otherValues);
            mergedOptionsKeys.forEach(function (key) {
                it ('should have a key "' + key + '" with an other value "' + otherValues[key] + '"', function () {
                    expect(obj.options[key]).to.equal(otherValues[key]);
                });
            });
        });

    }); // end of Test 1.0

    // Test 2
    describe ('#`has`', function () {
        it ('Should find values by namespace string.', function () {
            var obj = new Optionable(mergedOptions, allYourBase);
            expect(obj.has('all.your.base.are.belong.to.us')).to.equal(true);
        });
    });

    // Test 3
    describe ('#`set`', function () {

        // Test 3.1
        it ('Should be able to set values using a namespace string.', function () {
            var obj = new Optionable(mergedOptions, allYourBase);
            obj.merge(allYourBase);
            obj.set('all.your.base.are.belong.to.us', {someNewValue: 100});
            expect(obj.has('all.your.base.are.belong.to.us')).to.equal(true);
            expect(obj.get('all.your.base.are.belong.to.us.someNewValue')).to.equal(100);
        });

        // Test 3.2
        it ('Should be able to create heirarchichal structures from namespace strings to set an end value.', function () {

            // Empty optionable object
            var obj = new Optionable();

            // Doesn't have namespaced value
            expect(obj.has('all.your.base.are.belong.to.us')).to.equal(false);

            // Add namespaced value and set end value
            obj.set('all.your.base.are.belong.to.us', {someOtherValue: 1000});

            // Should have namespaced value
            expect(obj.has('all.your.base.are.belong.to.us')).to.equal(true);

            // Should have end value
            expect(obj.get('all.your.base.are.belong.to.us.someOtherValue')).to.equal(1000);
        });

        // Tetst 3.3
        describe ('Should be able to set multiple values from an object.', function () {
            // Empty optionable object
            var obj = new Optionable();
            obj.set(mergedOptions);
            mergedOptionsKeys.forEach(function (key) {
                it('It should have a new key "' + key + '" with value "' + mergedOptions[key] + '".', function () {
                    expect(obj.options[key]).to.equal(mergedOptions[key]);
                });
            });

        });

    }); // end of Tetst 3

    // Test 4
    describe ('#`get`', function () {
        var obj = new Optionable(mergedOptions, allYourBase);

        // Test 4.1
        it ('Should be able to get values using a namespace string.', function () {
            expect(obj.get('all.your.base.are.belong.to.us')).to.equal(obj.options.all.your.base.are.belong.to.us);
        });

        it ('Should be able to get values using a regular string (not a namespaced string).', function () {
            expect(obj.get('all')).to.equal(obj.options.all);
        });

        it ('Should return `null` for non-existent keys.', function () {
            expect(obj.get('helloworld')).to.equal(null);
        });

    });

}); // end of Test Suite
