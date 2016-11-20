/**
 * Created by elyde on 11/20/2016.
 */
/**
 * Created by edlc on 11/13/16.
 * @todo find out best practice for naming functions that have side effects
 * @todo split out the `extend` method from `defineSubClass`
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        Extendable = sjl.ns.stdlib.Extendable,
        fnNs = sjl.ns.fn,
        curry2 = sjl.curry,
        Identity = Extendable.extend({
            constructor: function Identity (value) {
                if (!(this instanceof Identity)) {
                    return Identity.of(value);
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
                return fnNs.join(this, this.constructor);
            },
            ap: function (functor) {
                return functor.map(this.value);
            },
            chain: function (fn) {
                return fnNs.chain(fn, this); // monadic bind
            },
            lift: curry2(function (fn) {
                return fnNs.liftN.apply(null, arguments);
            })
        }, {
            of: function (value) {
                return new Identity(value);
            }
        });

    // Export `fnPackage`
    if (isNodeEnv) {
        module.exports = Identity;
    }
    else {
        sjl.ns('Identity', Identity);
        sjl.Identity = sjl.ns.Identity;

        if (sjl.isAmd) {
            return Identity;
        }
    }

}());
