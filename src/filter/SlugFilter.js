/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        SlugFilter = sjl.filter.Filter.extend({
            constructor: function SlugFilter(value) {
                if (!sjl.isset(this)) {
                    return SlugFilter.filter(value);
                }
            },
            filter: function (value) {
                return SlugFilter.filter(value);
            }
        });

    Object.defineProperties(SlugFilter, {
        allowedCharsRegex: {
            value: /[^a-z\d\-\_]/gim,
            enumerable: true
        },
        filter: {
            value: function (value, max) {
                if (!sjl.isString(value)) {
                    return value;
                }
                max = sjl.classOfIs(max, Number) ? max : 201;
                return value.trim().toLowerCase()
                    .split(SlugFilter.allowedCharsRegex)
                    .filter(function (char) {
                        return char.length > 0;
                    })
                    .join('-')
                    .substring(0, max);
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.SlugFilter', SlugFilter);
        return SlugFilter;
    }
    else {
        module.exports = SlugFilter;
    }

}());
