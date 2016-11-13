/**
 * Created by elyde on 11/12/2016.
 * Adds some functional sugar directly to `sjl` (not on the `fn` namespace)
 * to allow the use of common functional features with sjl;  E.g., compose, curry, curryN, etc..
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : window.sjl || {};

    /**
     * @param value
     * @returns {Boolean}
     */
    sjl.hasIterator = function (value) {
        return sjl.isFunction(value[sjl.Symbol.iterator]);
    };

    /**
     * @param obj {*}
     * @returns {Iterator|undefined}
     */
    sjl.getIterator = function (obj) {
        return obj[sjl.Symbol.iterator];
    };

    /**
     * @param iterator {Iterator}
     * @returns {Array}
     */
    sjl.iteratorToArray = function (iterator) {
        var current = iterator.next(),
            out = [];
        while (current.done === false) {
            out.push(current.value);
        }
        return out;
    };

    /**
     * @allParams {*} - [,arrayLike {*}].  One or more array like objects.
     * @returns {Array|null}
     */
    sjl.getArrayLikes = function (/* [,arrayLike] */) {
        return sjl.argsToArray(arguments).filter(function (arg) {
            return Array.isArray(arg) ||
                sjl.classOfIs(arg, 'Arguments') ||
                (sjl.isset(WeakSet) && sjl.classOfIs(arg, WeakSet)) ||
                (sjl.isset(sjl.stdlib.SjlSet) && sjl.classOfIs(arg, sjl.stdlib.SjlSet)) ||
                (sjl.isset(Set) && sjl.classOfIs(arg, Set));
        });
    };

    /**
     * @param obj {*}
     * @returns {Array<Array<*,*>>} - Array map.  I.e., [[key{*}, value{*}]].
     */
    sjl.objToArrayMap = function (obj) {
        var keys = sjl.keys(obj);
        if (keys.length === 0) {
            return [];
        }
        return keys.map(function (key) {
            return [key, obj[key]];
        });
    };

    /**
     * @param setObj {{entries: {Function}} | Set | WeakSet | Map | WeakMap | SjlSet | SjlMap} - Object with `entries` method.
     *  E.g., Set, WeakSet, Map, WeakMap, SjlSet, SjlMap
     * @returns {Array}
     */
    sjl.setToArray = function (setObj) {
        var iterator = setObj.entries(),
            current = iterator.next(),
            out = [];
        while (current.done === false) {
            out.push(current.value);
            current = iterator.next();
        }
        return out;
    };

    /**
     * @param mapObj {{entries: {Function}} | Set | WeakSet | Map | WeakMap | SjlSet | SjlMap} - Object with `entries` method.
     * @returns {Array}
     */
    sjl.mapToArray = function (mapObj) {
        return sjl.setToArray(mapObj);
    };

    /**
     * @param arrayLike {*}
     * @returns {Array|Undefined} - `Undefined` if couldn't find array like.
     */
    sjl.arrayLikeToArray = function (arrayLike) {
        var out,
            classOfArrayLike = sjl.classOf(arrayLike);
        switch (classOfArrayLike) {
            case 'Arguments':
                out = sjl.argsToArray(arrayLike);
                break;
            case 'SjlSet':
            case 'WeakSet':
            case 'Set':
                out = sjl.setToArray(arrayLike);
                break;
            case 'Map':
            case 'WeakMap':
            case 'SjlMap':
                out = sjl.mapToArray(arrayLike);
                break;
            case 'Array':
                out = arrayLike;
                break;
            case 'String':
                out = arrayLike.split('');
                break;
            default:
                break;
        }
        return out;
    };

    /**
     * @param arrayLike {*}
     * @returns {Array|Undefined} - `Undefined` if couldn't find array like.
     */
    sjl.notArrayLikeToArray = function (arrayLike) {
        var out,
            classOfArrayLike = sjl.classOf(arrayLike);
        switch (classOfArrayLike) {
            case 'Object':
                if (sjl.hasIterator(classOfArrayLike)) {
                    out = sjl.iteratorToArray(sjl.getIterator(classOfArrayLike));
                }
                else {
                    out = sjl.objToArrayMap(arrayLike);
                }
                break;
            case 'Number':
                out = arrayLike + ''.split('');
                break;
            case 'Function':
                out = sjl.toArray(arrayLike());
                break;
            default:
                // If can't operate on value throw an error
                if (sjl.classOfIsMulti(arrayLike, 'Null', 'Undefined', 'Symbol', 'Boolean')) {
                    throw new TypeError('`sjl.toArray` cannot operate on values of type' +
                        ' `Null`, `Undefined`, `Symbol`, `Boolean`.  ' +
                        'Value type passed in: `' + classOfArrayLike + '`.');
                }
                // Else wrap value in array and give a warning
                else {
                    console.warn('`sjl.toArray` has wrapped a value unrecognized to it.  ' +
                        'Value and type: ' + arrayLike + ', ', classOfArrayLike);
                    out = [arrayLike];
                }
                break;
        }
        return out;
    };

    /**
     * @param arrayLike {*}
     * @returns {Array|Undefined}
     */
    sjl.toArray = function (arrayLike) {
        return sjl.arrayLikeToArray(arrayLike) ||
            sjl.notArrayLikeToArray(arrayLike);
    };

    /**
     * @returns {Array}
     */
    sjl.concatArrayLikes = function (/* [,arrayLike] */) {
        return sjl.getArrayLikes.apply(null, arguments).reduce(function (arr1, arr2) {
            return arr1.concat(sjl.toArray(arr2));
        }, []);
    };

    // Export `Extendable`
    if (isNodeEnv) {
        module.exports = sjl;
    }
    else if (window.__isAmd) {
        return sjl;
    }

}());
