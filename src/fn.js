/**
 * Created by edlc on 11/13/16.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        curry2 = sjl.curry2,
        curry3 = sjl.curry3,
        defineSubClassPure = sjl.defineSubClassPure,
        defineSubClassPureMulti = function (ctorOrCtors, methodsAndCtor, statics) {
            var args = sjl.argsToArray(arguments),
                arg0 = args.shift();
            if (sjl.notEmptyAndOfType(arg0, Array)) {
                return arg0.reduce(function (agg, Constructor) {
                    return defineSubClassPure(Constructor, agg);
                }, defineSubClassPure(arg0.shift(), methodsAndCtor, statics));
            }
            return defineSubClassPure.apply(null, arguments);
        },
        fnPackage = (function () {

            /**
             * Returns whatever you pass in;  Id pattern from functional programming (used by custom functors and monads).
             * @function module:sjl.fn.id
             * @param value {*}
             * @returns {*}
             */
            var id = function (value) {
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

            /**
             * Curried filter function.
             * @function module:sjl.fn.filter
             * @param fn {Function}
             * @param functor {{filter: {Function}}}
             * @type {{filter: {Function}}}
             */
            filter = curry2(function (fn, functor) {
                return functor.filter(fn);
            }),

            /**
             * Curried reduce function.
             * @function module:sjl.fn.reduce
             * @param fn {Function}
             * @param agg {*} - Aggregator.
             * @param functor {{reduce: {Function}}}
             * @type {{reduce: {Function}}}
             */
            reduce = curry2(function (fn, agg, functor) {
                return functor.reduce(fn, agg);
            }),

            /**
             * Curried reduceRight function.
             * @function module:sjl.fn.reduceRight
             * @param fn {Function}
             * @param agg {*} - Aggregator.
             * @param functor {{reduceRight: {Function}}}
             * @type {{reduceRight: {Function}}}
             */
            reduceR = curry2(function (fn, agg, functor) {
                return functor.reduceRight(fn, agg);
            }),

            /**
             * Applicative apply.  Applies function within functor1 to value within functor2.
             * @function module:sjl.fn.ap
             * @param functor1 {{ap: {Function}}}
             * @param functor1 {{ap: {Function}}}
             * @type {{ap: {Function}}}
             */
            ap = curry2(function (obj1, obj2) {
                return obj1.ap(obj2);
            }),

            /**
             *
             * @function module:sjl.fn.chain
             * @type {*}
             */
            chain = curry2(function (fn, functor) {
                return functor.map(fn).join();
            }),

            ensureFn = function (fn) {
                return sjl.isFunction(fn) ? fn : function () { return fn; };
            },

            /**
             * Monadic join
             * @function module:sjl.fn.join
             * @param monad {Monad}
             * @todo add more descriptive jsdoc here.
             * @returns {*|Array|String}
             */
            join = function (monad) {
                return monad.value instanceof monad.constructor ? monad.value : monad.constructor.of(monad.value);
            },

            joinR = function (monad) {
                var constructor = monad.constructor;
                while (monad.value instanceof constructor) {
                    monad = monad.value;
                }
                return monad instanceof constructor ? monad : constructor.of(monad);
            },

            /**
             * @param fn {Function}
             * @returns {Functor}
             */
            liftN = curry3(function (fn, functor1) {
                return sjl.restArgs(arguments, 3).reduce(function (aggregator, functor) {
                    return aggregator.ap(functor);
                }, functor1.map(fn));
            });

            /**
             * Fn package.  Includes some functional members
             * @namespace module:sjl.fn
             * @type {{id: module:sjl.fn.id, map: Function, join: module:sjl.fn.join, joinR: joinR, chain: *, filter: {filter: {Function}}, reduce: {reduce: {Function}}, reduceR: {reduceRight: {Function}}, ap: {ap: {Function}}, liftN: (*)}}
             */
            return {
                id: id,
                map: map,
                join: join,
                joinR: joinR,
                chain: chain,
                filter: filter,
                reduce: reduce,
                reduceR: reduceR,
                ap: ap,
                liftN: liftN,
                ensureFn: ensureFn
            };

        }()),
        Functor = (function () {
            var Constructor = function Functor (value) {
                if (!this) {
                    return new Functor(value);
                }
                Object.defineProperty(this, 'value', {
                    value: value,
                    writable: true
                });
            };
            return defineSubClassPure(Function, {
                constructor: Constructor,
                map: function (fn) {
                    return new this.constructor(fn(this.value));
                }
            });
        }()),
        Apply = (function () {
            var Constructor = function Apply (value) {
                if (!this) {
                    return new Apply(value);
                }
                Functor.apply(this, value);
            };
            return defineSubClassPure(Functor, {
                constructor: Constructor,
                ap: function (functor) {
                    return functor.map(this.value);
                }
            });
        }()),
        Applicative = (function () {
            var Constructor = function Applicative (value) {
                if (!this) {
                    return new Applicative(value);
                }
                Apply.apply(this, value);
            };
            return defineSubClassPure(Apply, {
                constructor: Constructor
            }, {
                of: function (value) {
                    return new this(value);
                }
            });

        }()),
        Chain = (function () {
            var Constructor = function Monad (value) {
                if (!this) {
                    return new Chain(value);
                }
                Apply.apply(this, value);
            };
            return defineSubClassPure(Apply, {
                constructor: Constructor,
                chain: function (fn) {
                    return this.map(fn).join();
                }
            });
        }()),
        Monad = (function () {
            var Constructor = function Monad (value) {
                if (!this) {
                    return new Monad(value);
                }
                Applicative.apply(this, value);
            };
            return defineSubClassPureMulti([Applicative, Chain], Constructor);
        }()),
        Extend = (function () {
            var Constructor = function Extend (value) {
                if (!this) {
                    return new Extend(value);
                }
                Functor.apply(this, value);
            };
            return defineSubClassPure(Functor, {
                constructor: Constructor,
                extend: function (fn) {
                    return this.constructor.of(fn(this.value));
                }
            });
        }()),
        Comonad = (function () {
            var Constructor = function Comonad (value) {
                if (!this) {
                    return new Comonad(value);
                }
                Extend.apply(this, value);
            };
            return defineSubClassPure(Functor, {
                constructor: Constructor,
                extract: function () {
                    return this.value;
                }
            });
        }());

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
