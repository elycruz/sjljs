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
     * Extends the passed in constructor with `Extendable`.
     * @examples
     * // Scenario 1: function called with a constructor, a prototype object, and a static properties object.
     * // 2nd and 3rd args are optional in this scenario
     * Extendable.extend(SomeConstructor, somePrototypeHash, someStaticPropsHash);
     *
     * // Scenario 2: function is called with a prototype object and a static properties object
     * // 2nd arg is optional in this scenario.
     * // Note: First arg must contain a constructor property containing the constructor to extend which is also
     * //   the constructor that gets set on actual prototype of the extended method which then becomes
     * //   un-writable/un-configurable (makes for solid oop).
     * Extendable.extend({ constructor: SomeConstructor, someMethod: function () {} },
     *                   {someStaticProp: 'hello'});
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
