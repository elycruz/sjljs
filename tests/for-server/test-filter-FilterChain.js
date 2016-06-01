/**
 * Created by elydelacruz on 5/18/16.
 */

describe('sjl.filter.FilterChain', function () {

    // ~~~ STRIP ~~~
    // This part gets stripped out when
    // generating browser version of test(s).
    'use strict';
    var chai = require('chai'),
        sjl = require('./../../src/sjl'),
        expect = chai.expect;
    // These variables get set at the top IIFE in the browser.
    // ~~~ /STRIP ~~~

    var FilterChain =           sjl.filter.FilterChain,
        //Filter =                sjl.filter.Filter,
        BooleanFilter =         sjl.filter.BooleanFilter,
        StringToLowerFilter =   sjl.filter.StringToLowerFilter,
        StringTrimFilter =      sjl.filter.StringTrimFilter,
        SlugFilter =            sjl.filter.SlugFilter,
        StripTagsFilter =       sjl.filter.StripTagsFilter;

    describe ('Constructor', function () {
        it ('should be a subclass of sjl.stdlib.Extendable', function () {
            expect(new FilterChain()).to.be.instanceof(sjl.stdlib.Extendable);
        });
        it ('should have populated filters when they are passed in on construction.', function () {
            var filters = [new StripTagsFilter()];
            expect((new FilterChain(filters)).filters.length).to.equal(filters.length);
        });
    });

    describe ('Properties', function () {
        it ('should have expected proporties.', function () {
            expect((new FilterChain()).filters).to.be.instanceof(Array);
        });
        describe ('#filter', function () {
            it ('should pass passed in filters through filter adding mechanisms', function () {
                var filterChain = new FilterChain(),
                    filters1 = [
                        new StringToLowerFilter(),
                        new StringTrimFilter()
                    ],
                    filters2 = [
                        new StringTrimFilter(),
                        new StringToLowerFilter(),
                        new BooleanFilter(),
                    ];
                filterChain.filters = filters1;
                expect(filterChain.filters.length).to.equal(filters1.length);
                filters1.forEach(function (filter, index) {
                    expect(filterChain.filters[index]).to.equal(filter);
                });
                filterChain.filters = filters2;
                expect(filterChain.filters.length).to.equal(filters2.length);
                filters2.forEach(function (filter, index) {
                    expect(filterChain.filters[index]).to.equal(filter);
                });
            });
        });
    });

    describe ('Methods', function () {

        it ('should have the appropriate interface.', function () {
            var filterChain = new FilterChain();

            [   'filter', 'isFilter', 'isFilterChain',
                'addFilter', 'addFilters', 'prependFilter',
                'mergeFilterChain'
            ]
                .forEach(function (methodName) {
                    expect(filterChain[methodName]).to.be.instanceof(Function);
                });
        });

        describe ('#filter', function () {
            // var filter = new FilterChain(),
            //     filters = [
            //         new StringToLowerFilter(),
            //         new StringTrimFilter()
            //     ];
            it ('should have tests written.');
        });

        describe ('#isFilter', function () {
            var filterChain = new FilterChain();
            it ('should return false when passed in value is not a filter.', function () {
                expect(filterChain.isFilter({})).to.equal(false);
                expect(filterChain.isFilter(function () {})).to.equal(false);
            });
            it ('should return true when passed in value is filter.', function () {
                expect(filterChain.isFilter(new SlugFilter())).to.equal(true);
                expect(filterChain.isFilter(new StripTagsFilter())).to.equal(true);
            });
            it ('should return false when no value is passed in.', function () {
                expect(filterChain.isFilter()).to.equal(false);
            });
        });

        describe ('#isFilterChain', function () {
            var filterChain = new FilterChain();
            it ('should return false when passed in value is not a filter chain.', function () {
                expect(filterChain.isFilterChain({})).to.equal(false);
                expect(filterChain.isFilterChain(function () {})).to.equal(false);
            });
            it ('should return true when passed in value is filter chain.', function () {
                expect(filterChain.isFilterChain(new FilterChain())).to.equal(true);
            });
            it ('should return false when no value is passed in.', function () {
                expect(filterChain.isFilterChain()).to.equal(false);
            });
        });

        describe ('#addFilter', function () {
            it ('should add a filter to it\'s list of filters and return itself after doing so.', function () {
                var filterChain = new FilterChain(),
                    filter = new SlugFilter(),
                    result = filterChain.addFilter(filter);
                expect(filterChain.filters[0]).to.equal(filter);
                expect(result).to.equal(filterChain);
            });
            it ('should throw an error when trying to add non filter values as a filter.', function () {
                var filterChain = new FilterChain(),
                    caughtError;
                try {
                    filterChain.addFilter({});
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
            it ('should throw an error when no value is passed in.', function () {
                var filterChain = new FilterChain(),
                    caughtError;
                try {
                    filterChain.addFilter();
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
        });

        describe ('#addFilters', function () {
            it ('should be able to add a list of filters from passed in array of filters.', function () {
                var filterChain = new FilterChain(),
                    filters = [
                        new BooleanFilter(),
                        new SlugFilter(),
                        new StringToLowerFilter(),
                        new StringTrimFilter(),
                        new StripTagsFilter()
                    ],
                    result = filterChain.addFilters(filters);

                filters.forEach(function (filter, index) {
                    expect(filterChain.filters[index]).to.equal(filter);
                });
                expect(result).to.equal(filterChain);
            });
            it ('should be able to add filters from passed in object of filter key-value pairs.', function () {
                var filterChain = new FilterChain(),
                    filters = {
                        blnFilter: new BooleanFilter(),
                        slugFilter: new SlugFilter(),
                        strToLowerFilter: new StringToLowerFilter(),
                        strTrimFilter: new StringTrimFilter(),
                        stripTagsFilter: new StripTagsFilter()
                    },
                    result = filterChain.addFilters(filters);

                Object.keys(filters).forEach(function (key, index) {
                    expect(filterChain.filters[index]).to.equal(filters[key]);
                });
                expect(result).to.equal(filterChain);
            });
            it ('should throw an error when passed in value is not an Object or an Array.', function () {
                var filterChain = new FilterChain();
                [99, 'hello-world'].forEach(function (value) {
                    var caughtError;
                    try {
                        filterChain.addFilters(value);
                    }
                    catch (e) {
                        caughtError = e;
                    }
                    expect(caughtError).to.be.instanceof(TypeError);
                });
            });
            it ('should throw an error when no value is passed in.', function () {
                var filterChain = new FilterChain(),
                    caughtError;
                try {
                    filterChain.addFilters();
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });

        });

        describe ('#prependFilter', function () {
            it ('should prepend passed in filter and return self after doing so.', function () {
                var filterChain = new FilterChain([
                        new StringToLowerFilter(),
                        new StringTrimFilter(),
                        new StripTagsFilter()
                    ]),
                    filtersToPrepend = [
                        new BooleanFilter(),
                        new SlugFilter()
                    ];
                filtersToPrepend.forEach(function (filter) {
                    expect(filterChain.prependFilter(filter)).to.equal(filterChain);
                    expect(filterChain.filters[0]).to.equal(filter);
                });
            });
            it ('should throw an error if passed in value is not a filter.', function () {
                var filterChain = new FilterChain();
                var caughtError;
                try {
                    filterChain.prependFilter({});
                }
                catch (e) {
                    caughtError = e;
                }
                expect(caughtError).to.be.instanceof(TypeError);
            });
        });

        describe ('#mergeFilterChain', function () {
            var filters1 = [
                    new BooleanFilter(),
                    new SlugFilter()
                ],
                filterChain1 = new FilterChain(filters1),
                filters2 = [
                    new StringToLowerFilter(),
                    new StringTrimFilter(),
                    new StripTagsFilter()
                ],
                filterChain2 = new FilterChain(filters2),
                result = filterChain1.mergeFilterChain(filterChain2);

            expect(result).to.equal(filterChain1);

            filters1.concat(filters2).forEach(function (filter, index) {
                expect(filterChain1.filters[index]).to.equal(filter);
            });
        });

    });

});
