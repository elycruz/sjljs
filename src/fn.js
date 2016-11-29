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

        /**
         * Returns whatever you pass in;  Id pattern from functional programming (used by custom functors and monads).
         * @function module:sjl.fn.id
         * @param value {*}
         * @returns {*}
         */
        id = function (value) {
            return value;
        },

        /**
         * Curried map function
         * @function module:sjl.fn.map
         * @param fn {Function}
         * @param functor {Object|Array} - An object with a `map(fn {Function})` method
         * @type {Function}
         */
        map = curry2(function (fn, functor) {
            return functor.map(fn);
        }),
        filter = curry2(function (fn, functor) {
            return functor.filter(fn);
        }),
        foldl = curry2(function (fn, agg, functor) {
            return functor.reduce(fn, agg);
        }),
        foldr = curry2(function (fn, agg, functor) {
            return functor.reduceRight(fn, agg);
        }),
        reduce = foldl,
        reduceRight = foldr,
        ap = curry2(function (obj1, obj2) {
            return obj1.ap(obj2);
        }),
        chain = curry2(function (fn, functor) {
            return functor.map(fn).join();
        }),
        join = function (monad) {
            return monad.value instanceof monad.constructor ? monad.value : monad.constructor.of(monad.value);
        },
        joinR = function (monad) {
            while (monad.value instanceof monad.constructor) {
                monad = monad.join();
            }
            return monad;
        },
        liftN = curry3(function (fn, functor1) {
            return sjl.restArgs(arguments, 3).reduce(function (aggregator, functor) {
                return aggregator.ap(functor);
            }, functor1.map(fn));
        }),

        /**
         * Fn package.  Includes some functional members
         * @namespace module:sjl.fn
         * @type {Object}
         */
        fnPackage = {
            id: id,
            map: map,
            join: join,
            joinR: joinR,
            chain: chain,
            ap: ap,
            liftN: liftN
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
