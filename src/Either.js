/**
 * Created by elyde on 11/20/2016.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        Just = sjl.ns.Maybe.Just,
        either = sjl.curry2(function (leftCallback, rightCallback, monad) {
            var identity = monad.map(sjl.ns.fn.id);
            switch (identity .constructor) {
                case Left:
                    return leftCallback(identity.value);
                case Right:
                    return rightCallback(identity.value);
            }
        }),
        Left = sjl.defineSubClassPure(Just, {
            constructor: function Left(value) {
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
        Right = sjl.defineSubClassPure(Just, {
            constructor: function Right(value) {
                if (!(this instanceof Right)) {
                    return Right.of(value);
                }
                Just.call(this, value);
            }
        }, {
            of: function (value) {
                return new Right(value);
            },
            counterConstructor: Left
        }),
        /**
         * Houses the Right and Left monads and their companion method `either`.
         * @experimental
         * @namespace module:sjl.Either
         * @type {{either: (*), Right, Left}}
         */
        Either = {
            either: either,
            Right: Right,
            Left: Left
        };

    // Export `fnPackage`
    if (isNodeEnv) {
        module.exports = Either;
    }
    else {
        sjl.ns('Either', Either);
        sjl.defineEnumProp(sjl, 'Either', Either);
        sjl.defineEnumProp(sjl, 'either', either);
        sjl.defineEnumProp(sjl, 'Right', Right);
        sjl.defineEnumProp(sjl, 'Left', Left);

        if (sjl.isAmd) {
            return Either;
        }
    }

}());
