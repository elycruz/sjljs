/**
 * Created by edlc on 11/13/16.
 * @todo find out best practice for naming functions that have side effects
 */

(function () {

    'use strict';

    function addPropertyValue (context, value) {
        Object.defineProperty(context, 'value', {
            value: value,
            writable: true,
            enumerable: true
        });
    }

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl.js') : window.sjl || {},
        Extendable = sjl.defineSubClass(Function, function Extendable() {}),
        Just = Extendable.extend({
            constructor: function Just (value) {
                addPropertyValue(this, value);
            },
            map: function (func) {
                return sjl.isset(this.value) ? Just(func(this.value)) : Nothing();
            }
        }, {
            of: function (value) {
                return Just(value);
            }
        }),
        Identity = Extendable.extend({
            constructor: function Identity (value) {
                if (!this) {
                    return Identity.of(value);
                }
                addPropertyValue(this, value);
            },
            map: function (func) {
                return Identity(func(this.value));
            }
        }, {
            of: function (value) {
                return Identity(value);
            }
        }),
        Nothing = Extendable.extend({
            constructor: function Nothing () {
                Object.defineProperty(context, 'value', {
                    value: null,
                    enumerable: true
                });
            },
            map: function () {
                return Nothing();
            }
        }, {
            of: function () {
                return Nothing();
            }
        }),
        fnPackage = {
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
        if (window.__isAmd) {
            return Extendable;
        }
    }

}());
