/**
 * @constructor Filter
 * @extends sjl.ns.stdlib.Extendable
 * @memberof module:sjl.ns.filter
 * @requires sjl
 * @requires sjl.ns.stdlib.Extendable
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl,
        Extendable = sjl.ns.stdlib.Extendable,

    Filter = Extendable.extend({
        constructor: function Filter (/** ...options {Object} **/) {
            // Set options on filter
            if (arguments.length > 0) {
                sjl.extend.apply(sjl,
                    [true, this].concat(sjl.argsToArray(arguments)));
            }
        },
        filter: function (value) {
            return value; // filtered
        }
    });

    if (!isNodeEnv) {
        sjl.ns('filter.Filter', Filter);
        return Filter;
    }
    else {
        module.exports = Filter;
    }

}());
