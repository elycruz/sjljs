/**
 * Created by Ely on 7/10/2014.
 *
 * From Douglas Crockford's "Monads and Gonads" talk
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Axioms
 * ------------------------------------------
 * bind(unit(value), f) ==== f(value)
 *
 * bind(monad, unit) ==== monad
 *
 * bind(bind(monad, f), g)
 *
 * bind(monad, function (value) {
 *     return bind(f(value), g);
 * });
 *
 */
(function (context) {

    context.sjl = context.sjl || {};

    /**
     * Creates an object using Object.create or just
     * returns a pojo if Object.create is not available.
     * @param fromValue {mixed} - optional
     * @returns {Object} - with an empty proto if js machine supports it
     */
    function createObj(fromValue) {
        fromValue = fromValue || null;
        return typeof Object.create !== 'undefined'
            ? Object.create(fromValue) : {};
    }

    /**
     * Monad Macroid
     */
    context.sjl.monad = function (modifier) {
        var emptyProto = createObj();

        function unit(value) {
            var monad = createObj(emptyProto);
            monad.bind = function (func, args) {
                return func(value, args);
            };
            if (typeof modifier === 'function') {
                modifier(monad, value);
            }
            return monad;
        }

        unit.lift = function (name, func) {
            emptyProto[name] = function (args) {
                return unit(this.bind(func, args));
            };
            return unit;
        };
        return unit;
    };

    // Identity monad
    var identity = context.sjl.monad(),
        identityMonad = identity("Hello World");
    identityMonad.bind(console.log);

    // Maybe monad
    var maybe = context.sjl.monad(function (monad, value) {
            if (value === null || value === undefined) {
                monad.is_null = true;
                monad.bind = function () {
                    return monad;
                };
            }
        }),
        maybeMonad = maybe(11);

    maybeMonad.bind(function (value) {
        console.log(value * 3);
    });

})(typeof window === 'undefined' ? global : window);
