/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        StringTrimFilter = sjl.filter.Filter.extend({
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
                return sjl.isString(value) ? value.trim() : value;
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
