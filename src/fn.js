/**
 * Created by edlc on 11/13/16.
 * @todo find out best practice for naming functions that have side effects
 * @todo split out the `extend` method from `defineSubClass`
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        curry2 = sjl.curry2,
        curry3 = sjl.curry3,
        id = function (value) {
            return value;
        },
        map = curry2(function (fn, functor) {
            return functor.map(fn);
        }),
        ap = curry2(function (obj1, obj2) {
            return obj1.ap(obj2);
        }),
        chain = curry2(function (fn, functor) {
            return functor.map(fn).join();
        }),
        join = curry2(function (monad, Type) {
            return monad.value instanceof Type ? monad.value : Type.of(monad.value);
        }),
        liftN = curry3(function (fn, functor1) {
            return sjl.restArgs(arguments, 3).reduce(function (aggregator, functor) {
                return aggregator.ap(functor);
            }, functor1.map(fn));
        }),
        flattenM = function (functor) {
            while (functor.value instanceof functor.constructor) {
                functor = functor.join();
            }
            return functor;
        },

        /**
         * `fn` package.  Includes some functional members
         * @type {Object}
         */
        fnPackage = {
            id: id,
            map: map,
            join: join,
            chain: chain,
            ap: ap,
            liftN: liftN,
            flattenM: flattenM
        };

    // Export `fnPackage`
    if (isNodeEnv) {
        module.exports = fnPackage;
    }
    else {
        sjl.ns('fn', fnPackage);
        sjl.fn = sjl.ns.fn;

        Object.keys(fnPackage).forEach(function (key) {
            sjl.defineEnumProp(sjl, key, fnPackage[key]);
        });

        if (sjl.isAmd) {
            return fnPackage;
        }
    }

}());
