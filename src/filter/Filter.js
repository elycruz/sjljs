/**
 * @constructor Filter
 * @extends sjl.stdlib.Extendable
 * @memberof module:sjl.filter
 * @requires sjl
 * @requires sjl.stdlib.Extendable
 * @note Class left as 'private' until documented.
 * @private
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl,
        Extendable = sjl.stdlib.Extendable,

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
