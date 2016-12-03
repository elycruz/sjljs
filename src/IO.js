/**
 * Created by u067265 on 12/2/16.
 */
/**
 * Created by edlc on 11/20/2016.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),

        fnNs = sjl.ns.fn,
        // curry2 = sjl.curry,

        Monad = sjl.ns.Monad,

        /**
         * Basic IO implementation.
         * @class module:sjl.IO
         * @experimental
         */
        IO = sjl.defineSubClassPure(Monad, {
            constructor: function IO (value) {
                if (!(this instanceof IO)) {
                    return IO.of(value);
                }
                Monad.call(this, fnNs.ensureFn(value));
            },
            map: function (fn) {
                return IO (sjl.compose(fn, this.value));
            }
            // apN: function () {
            //     var args = sjl.argsToArray(arguments);
            //     return args.reduce(function (agg, functor) {
            //         return agg.ap(functor);
            //     }, this.ap(args.shift()));
            // }
            // liftN: function (fn, functor) {
            //     return fnNs.liftN.apply(null, sjl.concatArrayLikes([fn, this], sjl.restArgs(arguments, 1)));
            // }
        }, {
            of: function (value) {
                return new IO(value);
            }
        });

    // Export
    if (isNodeEnv) {
        module.exports = IO;
    }
    else {
        sjl.ns('IO', IO);
        sjl.defineEnumProp(sjl, 'IO', sjl.ns.IO);
        if (sjl.isAmd) {
            return IO;
        }
    }

}());
