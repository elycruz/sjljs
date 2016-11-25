/**
 * Created by elyde on 11/25/2016.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        math = {
            add: sjl.curry2(function () {
                return sjl.argsToArray(arguments).reduce(function (agg, num) {
                    return num + agg;
                }, 0);
            }),
            multiply: sjl.curry2(function () {
                return sjl.argsToArray(arguments).reduce(function (agg, num) {
                    return num * agg;
                }, 1);
            })
        };



    // Export `math`
    if (isNodeEnv) {
        module.exports = math;
    }
    else {
        sjl.ns('math', math);
        sjl.defineEnumProp(sjl, 'math', math);

        if (sjl.isAmd) {
            return math;
        }
    }


}());
