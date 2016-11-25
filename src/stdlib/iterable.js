/**
 * Created by elydelacruz on 11/2/15.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Iterator = sjl.ns.stdlib.Iterator,
        ObjectIterator = sjl.ns.stdlib.ObjectIterator;

    /**
     * Defines an es6 compliant iterator callback on `Object` or `Array`.
     * @function module:sjl.iterable
     * @param arrayOrObj {Array|Object} - Array or object to set iterator function on.
     * @returns {Array|Object}
     */
    sjl.iterable = function (arrayOrObj) {
        var classOfArrayOrObj = sjl.classOf(arrayOrObj),
            keys, values;
        if (classOfArrayOrObj === 'Array') {
            arrayOrObj[sjl.Symbol.iterator] = function () {
                return new Iterator(arrayOrObj);
            };
        }
        else if (classOfArrayOrObj === 'Object') {
            keys = Object.keys(arrayOrObj);
            values = keys.map(function (key) {
                return arrayOrObj[key];
            });
            arrayOrObj[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(keys, values);
            };
        }
        else {
            throw new Error('sjl.iterable only takes objects or arrays.  ' +
                'arrayOrObj param received type is "' + classOfArrayOrObj +
                '".  Value received: ' + arrayOrObj);
        }
        return arrayOrObj;
    };

    if (isNodeEnv) {
        module.exports = sjl.iterable;
    }
    else {
        sjl.ns('stdlib.iterable', sjl.iterable);
        if (sjl.isAmd) {
            return sjl.iterable;
        }
    }

}());
