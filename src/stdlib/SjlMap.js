/**
 * Created by Ely on 7/17/2015.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        stdlibNs = sjl.ns.stdlib,

        // Constructors for composition
        Extendable =        stdlibNs.Extendable,
        ObjectIterator =    stdlibNs.ObjectIterator,
        makeIterable =      stdlibNs.iterable,

        /**
         * SjlMap constructor to augment
         * @param iterable {Array|Object}
         * @private
         * @constructor
         */
        SjlMap = function SjlMap (iterable) {
            var self = this,
                _keys = makeIterable([]),
                _values = makeIterable([]),
                classOfParam0 = sjl.classOf(iterable);

            Object.defineProperties(this, {

                /**
                 * Keys array.  Set on construction.
                 * @member sjl.stdlib.SjlMap#_keys {Array}
                 * @readonly
                 */
                _keys: {
                    value: _keys
                },

                /**
                 * Values array.  Set on construction.
                 * @member sjl.stdlib.SjlMap#_values {Array}
                 * @readonly
                 */
                _values: {
                    value: _values
                },

                /**
                 * @name size
                 * @member sjl.stdlib.SjlMap#size {Number} - Size of the iterator.
                 * @readonly
                 */
                size: {
                    get: function () {
                        return self._keys.length;
                    },
                    enumerable: true
                }
            });

            // If an array was passed in inject values
            if (classOfParam0 === 'Array') {
                self.addFromArray(iterable);
            }
            else if (classOfParam0 === 'Object') {
                self.addFromObject(iterable);
            }

            // Else if anything other undefined was passed at this point throw an error
            else if (classOfParam0 !== 'Undefined') {
                throw new TypeError ('Type Error: sjl.stdlib.SjlMap constructor only accepts a parameter of type' +
                    '`Object`, `Array` or `Undefined`. ' +
                ' Type received: ', sjl.classOf(iterable));
            }

            // Set custom iterator function on `this`
            self[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(_keys, _values, 0);
            };

            /**
             * Flag for knowing that es6 iterator was overridden.  Set on construction.
             * @name _iteratorOverridden
             * @member sjl.stdlib.SjlMap#_iteratorOverridden {Boolean}
             * @readonly
             */
            // Set flag to remember that original iterator was overridden
            Object.defineProperty(self, '_iteratorOverridden', {value: true});
        };

    /**
     * `SjlMap` constructor. Has same api as es6 `Map` constructor with
     *  an additional couple of convenience methods (`addFromArray`, `addFromObject`, `iterator`, `toJson`).
     *
     * @param iterable {Array|Object} - The object to populate itself from (either an `Array<[key, value]>`
     *  or an `Object`).
     * @constructor module:sjl.stdlib.SjlMap
     */
    SjlMap = Extendable.extend(SjlMap, {
        /**
         * Clears the `SjlMap` object of all data that has been set on it.
         * @method sjl.stdlib.SjlMap#clear
         * @returns {SjlMap}
         */
        clear: function () {
            [this._values, this._keys].forEach(function (values) {
                while (values.length > 0) {
                    values.pop();
                }
            });
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
        if (sjl.isAmd) {
            return SjlMap;
        }
    }

})();
