/**
 * Created by edlc on 11/20/2016.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        fnNs = sjl.ns.fn,
        curry2 = sjl.curry,

        /**
         * Basic Monad implementation.
         * @class module:sjl.Monad
         * @experimental
         */
        Monad = sjl.defineSubClassPure(Function, {
            constructor: function Monad (value) {
                if (!(this instanceof Monad)) {
                    return Monad.of(value);
                }
                Object.defineProperty(this, 'value', {
                    value: value,
                    writable: true
                });
            },
            map: function (fn) {
                return this.constructor.of(fn(this.value));
            },
            join: function () {
                return fnNs.join(this);
            },
            joinR: function () {
                return fnNs.joinR(this);
            },
            ap: function (functor) {
                return functor.map(this.value);
            },
            chain: function (fn) {
                return fnNs.chain(fn, this); // monadic bind
            },
            lift: curry2(function (fn) {
                return fnNs.liftN.apply(null, sjl.concatArrayLikes([this], arguments));
            })
        }, {
            of: function (value) {
                return new Monad(value);
            }
        });

    // Export
    if (isNodeEnv) {
        module.exports = Monad;
    }
    else {
        sjl.ns('Monad', Monad);
        sjl.defineEnumProp(sjl, 'Monad', sjl.ns.Monad);

        if (sjl.isAmd) {
            return Monad;
        }
    }

}());
