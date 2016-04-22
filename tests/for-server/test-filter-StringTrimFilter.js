/**
 * Created by elydelacruz on 3/25/16.
 */
'use strict';

let expect = require('chai').expect,
    sjl = require('./../../src/sjl'),
    ns = sjl.ns,
    StringTrimFilter = ns.filter.StringTrimFilter;

function filterDataProvider() {
    return [
        [{
            'unfiltered': ' Hello.  What is your name? ',
            'filtered': 'Hello.  What is your name?',
        }],
        [{
            'unfiltered': '\n\tThrice as nice!\n\t',
            'filtered': 'Thrice as nice!',
        }],
        [{
            'unfiltered': '  \n\tAll your base ...\n\t  ',
            'filtered': 'All your base ...',
        }],

    ];
}

describe(
    'sjl.filter.StringTrimFilter,' +
    'sjl.filter.StringTrimFilter#filter,' +
    'sjl.filter.StringTrimFilter.filter', function () {
    var filter = new StringTrimFilter();
    filterDataProvider().forEach(function (args) {
        var filteredValue = args[0].filtered,
            unfilteredValue = args[0].unfiltered;
        it(`should return slug ${filteredValue} when \`value\` is ${unfilteredValue}.`, function () {
            expect(filter.filter(unfilteredValue)).to.equal(filteredValue);
            expect(StringTrimFilter.filter(unfilteredValue)).to.equal(filteredValue);
            expect(StringTrimFilter(unfilteredValue)).to.equal(filteredValue);
        });
    });

});
