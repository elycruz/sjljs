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
        maybe = curry3(function (replacement, fn, monad) {
            var subject = monad.flatten();
            return  subject instanceof Nothing ? replacement : fn(subject.unwrap());
        }),
        map = curry2(function (fn, functor) {
            return functor.map(fn);
        }),
        flatten = function (monad) {
            return monad.flatten();
        },
        unwrap = function (obj) {
            return obj.unwrap();
        },
        fnApply = sjl.curry2(function (obj1, obj2) {
            return obj1.fnApply(obj2);
        }),
        fnBind = sjl.curry3(function (obj1, obj2, fn) {
            return obj1.fnBind(fn, obj2);
        }),
        flattenMonad = curry2(function (monad, Type) {
            var value = monad.value;
            while (value instanceof Type) {
                value = value.value;
            }
            return Type(value);
        }),
        returnNothing = function () {
            return Nothing.of();
        },
        addPropertyValue = function (context, value) {
            Object.defineProperty(context, 'value', {
                value: value,
                writable: true
            });
        },
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
                return flattenMonad(this, Identity);
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
        Left = Just.extend({
            constructor: function Left (value) {
                if (!(this instanceof Left)) {
                    return Left.of(value);
                }
                Just.call(this, value);
            },
            map: function (/*func*/) {
                return this;
            }
        }, {
            of: function (value) {
                return new Left(value);
            }
        }),
        Right = Just.extend({
            constructor: function Right (value) {
                if (!(this instanceof Right)) {
                    return Right.of(value);
                }
                Just.call(this);
            }
        },{
            of: function (value) {
                return new Right(value);
            }
        }),

        /**
         * `fn` package.  Includes some functional members
         * @type {Object}
         */
        fnPackage = {
            map: map,
            maybe: maybe,
            flatten: flatten,
            flattenMonad: flattenMonad,
            unwrap: unwrap,
            fnApply: fnApply,
            fnBind: fnBind,
            Identity: Identity,
            Just: Just,
            Nothing: Nothing,
            Left: Left,
            Right: Right
        };

    // Export `fnPackage`
    if (isNodeEnv) {
        module.exports = fnPackage;
    }
    else {
        sjl.ns('fn', fnPackage);
        sjl.fn = sjl.ns.fn;

        if (sjl.isAmd) {
            return fnPackage;
        }
    }

}());
