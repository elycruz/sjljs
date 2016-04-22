/**
 * Created by Ely on 7/17/2015.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},

        // Constructors for composition
        Extendable =        sjl.stdlib.Extendable,
        ObjectIterator =    sjl.stdlib.ObjectIterator,
        makeIterable =      sjl.stdlib.iterable,

        // Constructor to augment
        SjlMap = function SjlMap (iterable) {
            var self = this,
                _keys,
                _values;
            Object.defineProperties(this, {
                _keys: {
                    get: function () {
                        return _keys;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(SjlMap.name, '_keys', value, Array);
                        _keys = makeIterable(value);
                    }
                },
                _values: {
                    get: function () {
                        return _values;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(SjlMap.name, '_values', value, Array);
                        _values = makeIterable(value);
                    }
                },
                size: {
                    get: function () {
                        return self._keys.length;
                    }
                }
            });

            self._keys = [];
            self._values = [];

            // If an array was passed in inject values
            if (Array.isArray(iterable)) {
                self.addFromArray(iterable);
            }

            else if (sjl.classOfIs(iterable, 'Object')) {
                self.addFromObject(iterable);
            }

            // If anything other than an array is passed in throw an Error
            else if (typeof iterable !== _undefined) {
                throw new Error ('Type Error: sjl.SjlMap takes only iterable objects as it\'s first parameter. ' +
                ' Parameter received: ', iterable);
            }

            // Set custom iterator function on `this`
            self[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(self._keys, self._values, 0);
            };

            // Set flag to remember that original iterator was overridden
            self._iteratorOverridden = true;
        };

    /**
     * 'Simple Javascript Library Map' object (stand-in object
     *  for es6 `Maps` until they're support is more widely accepted).
     *
     *  This constructor offers the same exact api as es6 `Map` objects with
     *  an additional couple of convenience methods (`addFromArray`, `addFromObject`, `iterator`, `toJson`).
     *
     * @param iterable {Array|Object} - The object to populate itself from (either an `Array<[[key, value]]>`
     *  or an `Object` hash).
     * @constructor sjl.stdlib.SjlMap
     */
    SjlMap = Extendable.extend(SjlMap, {
        /**
         * Clears the `SjlMap` object of all data that has been set on it.
         * @method sjl.stdlib.SjlMap#clear
         * @returns {SjlMap}
         */
        clear: function () {
                while (this._values.length > 0) {
                    this._values.pop();
                }
                while (this._keys.length > 0) {
                    this._keys.pop();
                }
                return this;
            },

        /**
         * Deletes an entry in the `SjlMap`.
         * @method sjl.stdlib.SjlMap#delete
         * @param key {*} - Key of key-value pair to remove.
         * @returns {SjlMap}
         */
        delete: function (key) {
                if (this.has(key)) {
                    var _index = this._keys.indexOf(key);
                    this._values.splice(_index, 1);
                    this._keys.splice(_index, 1);
                }
                return this;
            },

        /**
         * Returns the entries in this `SjlMap` as a valid es6 iterator to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.stdlib.SjlMap#entries
         * @returns {sjl.stdlib.ObjectIterator}
         */
        entries: function () {
                return new ObjectIterator(this._keys, this._values, 0);
            },

        /**
         * Iterates through all key value pairs in itself and passes them to `callback`
         *  on each iteration.
         * @method sjl.stdlib.SjlMap#forEach
         * @param callback {Function} - Required.
         * @param context {Object} - Optional.
         * @returns {SjlMap}
         */
        forEach: function (callback, context) {
            var self = this;
            self._keys.forEach(function (key, index) {
                callback.call(context, self._values[index], key);
            });
            return self;
        },

        /**
         * Returns whether a `key` is set on this `SjlMap`.
         * @method sjl.stdlib.SjlMap#has
         * @param key {*} - Required.
         * @returns {boolean}
         */
        has: function (key) {
            return this._keys.indexOf(key) > -1;
        },

        /**
         * Returns the keys in this `SjlMap` as a valid es6 iterator object to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.stdlib.SjlMap#keys
         * @returns {sjl.stdlib.Iterator}
         */
        keys: function () {
            return this._keys[sjl.Symbol.iterator]();
        },

        /**
         * Returns the values in this `SjlMap` as a valid es6 iterator object to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.stdlib.SjlMap#values
         * @returns {sjl.stdlib.Iterator}
         */
        values: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**
         * Returns the value "set" for a key in instance.
         * @method sjl.stdlib.SjlMap#get
         * @param key {*}
         * @returns {*}
         */
        get: function (key) {
            var index = this._keys.indexOf(key);
            return index > -1 ? this._values[index] : undefined;
        },

        /**
         * Sets a key-value pair in this instance.
         * @method sjl.stdlib.SjlMap#set
         * @param key {*} - Key to set.
         * @param value {*} - Value to set.
         * @returns {SjlMap}
         */
        set: function (key, value) {
            var index = this._keys.indexOf(key);
            if (index > -1) {
                this._keys[index] = key;
                this._values[index] = value;
            }
            else {
                this._keys.push(key);
                this._values.push(value);
            }
            return this;
        },

        /**************************************************
         * METHODS NOT PART OF THE `Set` spec for ES6:
         **************************************************/

        /**
         * Adds key-value array pairs in an array to this instance.
         * @method sjl.stdlib.SjlMap#addFromArray
         * @param array {Array<Array<*, *>>} - Array of key-value array entries to parse.
         * @returns {SjlMap}
         */
        addFromArray: function (array) {
            // Iterate through the passed in iterable and add all values to `_values`
            var iterator = sjl.iterable(array, 0)[sjl.Symbol.iterator](),
                entry;

            // Loop through values and add them
            while (iterator.valid()) {
                entry = iterator.next();
                this.set(entry.value[0], entry.value[1]);
            }
            iterator = null;
            entry = null;
            return this;
        },

        /**
         * Add all the `object`'s instance's own property key-value pairs to this instance.
         * @method sjl.stdlib.SjlMap#addFromObject
         * @param object {Object} - Object to operate on.
         * @returns {SjlMap}
         */
        addFromObject: function (object) {
            sjl.throwTypeErrorIfNotOfType(SjlMap.name, 'object', object, 'Object',
                'Only `Object` types allowed.');
            var self = this,
                entry,
                objectIt = new ObjectIterator(object);
            while (objectIt.valid()) {
                entry = objectIt.next();
                self.set(entry.value[0], entry.value[1]);
            }
            return self;
        },

        /**
         * Returns a valid es6 iterator to iterate over key-value pair entries of this instance.
         *  (same as `SjlMap#entries`).
         * @method sjl.stdlib.SjlMap#iterator
         * @returns {sjl.stdlib.ObjectIterator}
         */
        iterator: function () {
            return this.entries();
        },

        /**
         * Shallow to json method.
         * @method sjl.stdlib.SjlMap#toJSON
         * @returns {{}}
         */
        toJSON: function () {
            var self = this,
                out = {};
            this._keys.forEach(function (key, i) {
                out[key] = self._values[i];
            });
            return out;
        }
    });

    if (isNodeEnv) {
        module.exports = SjlMap;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.SjlMap', SjlMap);

        // If `Amd` return the class
        if (window.__isAmd) {
            return SjlMap;
        }
    }

})();
