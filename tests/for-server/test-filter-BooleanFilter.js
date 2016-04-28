/**
 * Created by elydelacruz on 3/25/16.
 */
describe('sjl.filter.SlugFilter,', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var BooleanFilter = sjl.filter.BooleanFilter;

    it('should be a subclass of sjl.filter.Filter.', function () {
        expect(new BooleanFilter()).to.be.instanceof(sjl.filter.Filter);
    });

    it('should have expected interface.', function () {
        var filter = new BooleanFilter();

        // expect has required method(s)
        expect(typeof filter.filter).to.equal('function');

        // Expect has required properties
        ['allowCasting', 'conversionRules', 'translations'].forEach(function (key) {
            expect(sjl.isset(filter[key])).to.be.true();
        });

        // Expect has required static properties
        ['filter', 'castingRules'].forEach(function (key) {
            expect(sjl.isset(BooleanFilter[key])).to.be.true();
        });
    });

    it('should return a Boolean as is when it is filtering a Boolean.', function () {
        var filter = new BooleanFilter();
        expect(filter.filter(true)).to.be.true();
        expect(filter.filter(false)).to.be.false();
    });

    it('should return a `false` for all empty values.', function () {
        var filter = new BooleanFilter();
        [function () {
        }, null, undefined, [], {}, ''].forEach(function (value) {
            expect(filter.filter(value)).to.be.false();
        });
    });

    it('should return a `true` for all non-empty values.', function () {
        var filter = new BooleanFilter();
        [[1, 2, 3], 'hello', true, {hello: 'world'}].forEach(function (value) {
            expect(filter.filter(value)).to.be.true();
        });
    });

    it('should return `false` for all empty values representations as strings ["null", "false", etc.].', function () {
        var filter = new BooleanFilter();
        ['0', 'null', 'undefined', '[]', '{}', 'false'].forEach(function (value) {
            expect(filter.filter(value)).to.be.false();
        });
    });

    it('should cast "yes" and any translations passed in to boolean (based on translations passed in).', function () {
        var filter = new BooleanFilter({
            conversionRules: ['yesNo', 'boolean'],
            translations: {'hai': true, 'si': true}
        });
        ['yes', 'si', 'hai'].forEach(function (value) {
            expect(filter.filter(value)).to.be.true();
        });
        ['no', 'niet', 'hello', 'how are you'].forEach(function (value) {
            expect(filter.filter(value)).to.be.false();
        });
    });

    it('should cast "no" and any translations for it, passed in, to boolean (based on translations passed in).', function () {
        var filter = new BooleanFilter({
            conversionRules: ['yesNo'],
            translations: {'iie': false, 'niet': false, 'yes': true, 'si': true, 'hai': true, 'da': true}
        });
        ['no', 'niet', 'iie'].forEach(function (value) {
            expect(filter.filter(value)).to.be.false();
        });
        ['yes', 'si', 'hai', 'da'].forEach(function (value) {
            expect(filter.filter(value)).to.be.true();
        });
    });

    it ('should return true for values that assert to true based on passed in conversion rules.', function () {
        var ruleSets = [
                ['yesNo', 'boolean'],
                ['boolean'],
                [],
                ['all']
            ],
            valueSets = [
                ['yes', 'si', 'hai', 'da', true],
                [true],
                [true],
                ['yes', 'si', 'hai', true, 1, 99, 100, {hello: 'hello'}, [1,2,3]]
            ],
            translationSets = [
                [{yes: true, si: true, hai: true, da: true}],
                [{}],
                [{}],
                [{}]
            ],
            filter = new BooleanFilter();

        ruleSets.forEach(function (ruleSet, index) {
            filter.conversionRules = ruleSet;
            filter.translations = translationSets[index][0];
            valueSets[index].forEach(function (value) {
                expect(filter.filter(value)).to.be.true();
            });
        });

    });

});
