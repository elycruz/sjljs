/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        StringTrimFilter = sjl.ns.filter.Filter.extend({
            constructor: function StringTrimFilter(value) {
                if (!sjl.isset(this)) {
                    return StringTrimFilter.filter(value);
                }
            },
            filter: function (value) {
                return StringTrimFilter.filter(value);
            }
        });

    Object.defineProperties(StringTrimFilter, {
        filter: {
            value: function (value) {
                sjl.throwTypeErrorIfNotOfType('sjl.filter.StringTrimFilter', 'value', value, String);
                return value.trim();
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.StringTrimFilter', StringTrimFilter);
        return StringTrimFilter;
    }
    else {
        module.exports = StringTrimFilter;
    }

}());
