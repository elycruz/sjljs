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
        fnNs = sjl.fn,
        curry3 = sjl.curry3,
        Identity = fnNs.Identity,
        Extendable = sjl.ns.stdlib.Extendable,
        maybe = curry3(function (replacement, fn, monad) {
            var subject = monad.join();
            return subject instanceof Nothing ? replacement : fn(subject);
        }),
        nothing = sjl.fn.nothing = function () {
            return Nothing.of();
        },
        Nothing = Extendable.extend({
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
            fmap: nothing
        }, {
            of: function () {
                return new Nothing();
            }
        }),
        Just = Identity.extend({
            constructor: function Just(value) {
                if (!(this instanceof Just)) {
                    return Just.of(value);
                }
                Identity.call(this, value);
            },
            map: function (func) {
                return sjl.isset(this.value) ? Just(func(this.value)) : Nothing();
            },
            join: function () {
                return sjl.fn.join(this, Just);
            }
        }, {
            of: function (value) {
                return new Just(value);
            }
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
        sjl.defineEnumProp(sjl, 'Maybe', Maybe);

        if (sjl.isAmd) {
            return Maybe;
        }
    }

}());
