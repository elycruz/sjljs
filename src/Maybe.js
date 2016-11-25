/**
 * Created by elyde on 11/20/2016.
 */
/**
 * Created by elyde on 11/20/2016.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        ns = sjl.ns,
        curry3 = sjl.curry3,
        Monad = ns.Monad,
        maybe = curry3(function (replacement, fn, monad) {
            var subject = monad.join().map(sjl.ns.fn.id);
            return subject instanceof Nothing ? replacement : fn(subject);
        }),
        nothing = function () {
            return Nothing.of();
        },
        Nothing = Monad.extendWith({
            constructor: function Nothing() {
                if (!(this instanceof Nothing)) {
                    return nothing();
                }
                Object.defineProperty(this, 'value', {
                    value: null
                });
            },
            map: nothing,
            join: nothing,
            ap: nothing,
            chain: nothing
        }, {
            of: function () {
                return new Nothing();
            }
        }),
        Just = Monad.extendWith({
            constructor: function Just(value) {
                if (!(this instanceof Just)) {
                    return Just.of(value);
                }
                Monad.call(this, value);
            },
            map: function (func) {
                var constructor = this.constructor;
                return sjl.isset(this.value) ? constructor.of(func(this.value)) :
                    constructor.counterConstructor.of(this.value);
            }
        }, {
            of: function (value) {
                return new Just(value);
            },
            counterConstructor: Nothing
        }),
        Maybe = {
            maybe: maybe,
            nothing: nothing,
            Just: Just,
            Nothing: Nothing
        };

    // Export `fnPackage`
    if (isNodeEnv) {
        module.exports = Maybe;
    }
    else {
        sjl.ns('Maybe', Maybe);

        Object.keys(Maybe).forEach(function (key) {
            sjl.defineEnumProp(sjl, key, Maybe[key]);
        });

        if (sjl.isAmd) {
            return Maybe;
        }
    }

}());
