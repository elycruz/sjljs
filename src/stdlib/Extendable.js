/**
 * Created by Ely on 4/12/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Extendable = function Extendable () {};

    /**
     * The `sjl.stdlib.Extendable` constructor (a constructor that has a static `extend` method for easy extending).
     * @class sjl.stdlib.Extendable
     */
    Extendable = sjl.defineSubClass(Function, Extendable);

    /**
     * Extends this constructor with the passed in constructor.
     * Method Signatures:
     * {Function<constructor {Function}, proto {Object}, statics {Object}>} - `statics` and `proto` are optional.
     * {Function<proto {Object}, statics {Object}>} - `proto` requires a `constructor` with the constructor
     * to use to subclass from parent class.
     * @see sjl.defineSubClass
     * @member sjl.stdlib.Extendable.extend {Function}
     */

    // Export `Extendable`
    if (isNodeEnv) {
        module.exports = Extendable;
    }
    else {
        sjl.ns('stdlib.Extendable', Extendable);
        if (window.__isAmd) {
            return Extendable;
        }
    }

})();
