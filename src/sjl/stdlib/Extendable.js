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
     * The `sjl.package.stdlib.Extendable` constructor (a constructor that has a static `extend` method for easy extending).
     * @class module:sjl.package.stdlib.Extendable
     * @name sjl.package.stdlib.Extendable
     */
    Extendable = sjl.defineSubClass(Function, Extendable);

    /**
     * Extends a new copy of self with passed in parameters.
     * @method sjl.package.stdlib.Extendable.extend
     * @param constructor {Constructor} - Required.
     * @param methods {Object} - Optional.
     * @param statics {Object} - Static methods. Optional.
     */

    // Export `Extendable`
    if (isNodeEnv) {
        module.exports = Extendable;
    }
    else {
        sjl.package('stdlib.Extendable', Extendable);
    }

})();
