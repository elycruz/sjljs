/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Extendable = function Extendable () {};

    /**
     * The `sjl.stdlib.Extendable` constructor (a constructor that has a static `extend` method for easy extending).
     * @class module:sjl.stdlib.Extendable
     * @memberof namespace:sjl.stdlib
     */
    Extendable = sjl.defineSubClass(Function, Extendable);


    // Export `Extendable`
    if (isNodeEnv) {
        module.exports = Extendable;
    }
    else {
        sjl.ns('stdlib.Extendable', Extendable);
        sjl.defineEnumProp(sjl, 'Extendable', Extendable);
        if (window.__isAmd) {
            return Extendable;
        }
    }

    /**
     * @static class:sjl.stdlib.Extendable#extend
     */

})();
