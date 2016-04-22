/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        StringToLowerFilter = sjl.filter.Filter.extend({
            constructor: function StringToLowerFilter(value) {
                if (!sjl.isset(this)) {
                    return StringToLowerFilter.filter(value);
                }
            },
            filter: function (value) {
                return StringToLowerFilter.filter(value);
            }
        });

    Object.defineProperties(StringToLowerFilter, {
        filter: {
            value: function (value) {
                sjl.throwTypeErrorIfNotOfType('sjl.filter.StringToLowerFilter', 'value', value, String);
                return value.toLowerCase();
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.StringToLowerFilter', StringToLowerFilter);
        return StringToLowerFilter;
    }
    else {
        module.exports = StringToLowerFilter;
    }

}());
