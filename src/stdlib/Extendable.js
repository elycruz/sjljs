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
     * // 2nd and 3rd arguments are optional in this scenario
     * Extendable.extend(SomeConstructor, somePrototypeHash, someStaticPropsHash);
     *
     * // Scenario 2: function is called with a prototype object and a static properties object
     * // 2nd argument is optional in this scenario.
     * // Note: First arg must contain a constructor property containing the constructor to extend which is also
     * //   the constructor that gets set on said constructors prototype.constructor property
     * //   (gets set as un-writable/un-configurable makes for a more accurate oop experience).
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
        if (sjl.isAmd) {
            return Extendable;
        }
    }

})();
