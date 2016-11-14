/**
 * Created by edlc on 11/13/16.
 * @todo find out best practice for naming functions that have side effects
 * @todo split out the `extend` method from `defineSubClass`
 */

(function () {

    'use strict';

    function addPropertyValue (context, value) {
        Object.defineProperty(context, 'value', {
            value: value,
            writable: true
        });
    }

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl || {},
        Extendable = sjl.defineSubClass(Function, function Extendable() {}),
        Identity = Extendable.extend({
            constructor: function Identity (value) {
                if (!(this instanceof Identity)) {
                    return Identity.of(value);
                }
                addPropertyValue(this, value);
            },
            map: function (func) {
                return Identity.of(func(this.value));
            },
            flatten: function () {
                var value = this.value;
                while (value instanceof Identity) {
                    value = value.value;
                }
                return Identity(value);
            },
            unwrap: function () {
                return this.flatten().value;
            },
            fnApply: function (obj) {
                return obj.map(this.value);
            },
            fnBind: sjl.curry2(function (fn, mappable) {
                return mappable.map(fn(this.value)).flatten();
            }),
        }, {
            of: function (value) {
                return new Identity(value);
            }
        }),
        Just = Identity.extend({
            constructor: function Just (value) {
                if (!(this instanceof Just)) {
                    return Just.of(value);
                }
                Identity.call(this, value);
            },
            map: function (func) {
                return sjl.isset(this.value) ? Just(func(this.value)) : Nothing();
            },
            flatten: function () {
                var value = this.value;
                while (value instanceof Just) {
                    value = value.value;
                }
                return sjl.isset(value) ? Just(value): Nothing();
            }
        }, {
            of: function (value) {
                return new Just(value);
            }
        }),
        returnNothing = function () {
            return Nothing.of();
        },
        Nothing = Extendable.extend({
            constructor: function Nothing () {
                if (!(this instanceof Nothing)) {
                    return returnNothing();
                }
                Object.defineProperty(this, 'value', {
                    value: null
                });
            },
            map: returnNothing,
            unwrap: function () {
                return this.flatten().value;
            },
            flatten: returnNothing,
            fnApply: returnNothing,
            fnBind: returnNothing
        }, {
            of: function () {
                return new Nothing();
            }
        }),

        /**
         * `fn` package.  Includes some functional members
         * @type {{map: *, flatten: fnPackage.flatten, unwrap: fnPackage.unwrap, apply: *, bind: *, Identity: (any), Just: (any), Nothing: (any)}}
         */
        fnPackage = {

            map: sjl.curry2(function (obj, fn) {
                return obj.map(fn);
            }),
            flatten: function (obj) {
                return obj.flatten();
            },
            unwrap: function (obj) {
                return obj.unwrap();
            },
            fnApply: sjl.curry2(function (obj1, obj2) {
                return obj1.fnApply(obj2);
            }),
            fnBind: sjl.curry3(function (obj1, obj2, fn) {
                return obj1.fnBind(fn, obj2);
            }),

            Identity: Identity,
            Just: Just,
            Nothing: Nothing
        };

    // Export `Extendable`
    if (isNodeEnv) {
        module.exports = fnPackage;
    }
    else {
        sjl.ns('fn', fnPackage);
        sjl.fn = sjl.ns.fn;
        if (window.__isAmd) {
            return Extendable;
        }
    }

}());
