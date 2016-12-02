/**
 * Created by elyde on 11/25/2016.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),

        /**
         * @namespace module:sjl.math
         * @type {{add: Function, multiply: Function, divide: Function}}
         */
        math = {

            /**
             * Recursive, curried add function.
             * @function module:sjl.math.add
             * @return {*} - Reduced result.
             */
            add: sjl.curry2(function () {
                return sjl.argsToArray(arguments).reduce(function (agg, num) {
                    return num + agg;
                }, 0);
            }),

            /**
             * Recursive, curried multiply function.
             * @function module:sjl.math.multiply
             * @return {*} - Reduced result.
             */
            multiply: sjl.curry2(function () {
                return sjl.argsToArray(arguments).reduce(function (agg, num) {
                    return num * agg;
                }, 1);
            }),

            /**
             * Recursive, curried divide function.
             * @function module:sjl.math.divide
             * @return {*} - Reduced result.
             */
            divide: sjl.curry2(function () {
                var args = sjl.argsToArray(arguments);
                return args.reduce(function (agg, num) {
                    return agg / num;
                }, args.shift());
            })
        };

    // Export `math`
    if (isNodeEnv) {
        module.exports = math;
    }
    else {
        sjl.ns('math', math);
        sjl.defineEnumProp(sjl, 'math', math);
        Object.keys(math).forEach(function (key) {
            sjl.defineEnumProp(sjl, key, math[key]);
        });

        if (sjl.isAmd) {
            return math;
        }
    }

}());
