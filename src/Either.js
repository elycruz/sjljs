/**
 * Created by elyde on 11/20/2016.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        Just = sjl.ns.Maybe.Just,
        Left = Just.extend({
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
        Right = Just.extend({
            constructor: function Right(value) {
                if (!(this instanceof Right)) {
                    return Right.of(value);
                }
                Just.call(this, value);
            },
        }, {
            of: function (value) {
                return new Right(value);
            }
        }),
        Either = {
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
        sjl.defineEnumProp(sjl, 'Right', Right);
        sjl.defineEnumProp(sjl, 'Left', Left);

        if (sjl.isAmd) {
            return Either;
        }
    }

}());
