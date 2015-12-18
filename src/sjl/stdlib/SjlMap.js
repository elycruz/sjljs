/**
 * Created by Ely on 7/17/2015.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        stdlib = sjl.ns.stdlib,
        Extendable = stdlib.Extendable,
        ObjectIterator = stdlib.ObjectIterator,
        makeIterable = stdlib.iterable,

        /**
         * SjlMap Constructor.
         * @param iterable
         * @constructor
         */
        SjlMap = function SjlMap (iterable) {
            var self = this;
            self.size = 0;
            self._keys = [];
            self._values = [];

            // If an array was passed in inject values
            if (Array.isArray(iterable)) {
                self.addFromArray(iterable);
                // Make our internal arrays inherit our special iterator
                self._values = makeIterable(self._values);
                self._keys = makeIterable(self._keys);
            }

            else if (sjl.classOfIs(iterable, 'Object') && sjl.hasMethod(iterable, 'next')) {
                for (var keyValuePair in iterable) {
                    console.log(keyValuePair);
                }
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

    SjlMap = Extendable.extend(SjlMap, {
            clear: function () {
                while (this._values.length > 0) {
                    this._values.pop();
                }
                while (this._keys.length > 0) {
                    this._keys.pop();
                }
                this.size = 0;
                return this;
            },
            delete: function (key) {
                var _index = this._keys.indexOf(key);
                if (this.has(key)) {
                    delete this._values[_index];
                    delete this._keys[_index];
                    this.size -= sjl.classOfIs(this.size, 'Number') && this.size > 0 ? 1 : 0;
                }
                return this;
            },
            entries: function () {
                return new ObjectIterator(this._keys, this._values, 0);
            },
            forEach: function (callback, context) {
                for (var i = 0; i < this._keys.length - 1; i += 1) {
                    callback.call(context, this._keys[i], this._values[i]);
                }
                return this;
            },
            has: function (key) {
                return this._keys.indexOf(key) > -1 ? true : false;
            },
            keys: function () {
                return this._keys[sjl.Symbol.iterator]();
            },
            values: function () {
                return this._values[sjl.Symbol.iterator]();
            },
            get: function (key) {
                var index = this._keys.indexOf(key);
                return index > -1 ? this._values[index] : undefined;
            },
            set: function (key, value) {
                var index = this._keys.indexOf(key);
                if (index > -1) {
                    this._keys[index] = key;
                    this._values[index] = value;
                    this.size += 1;
                }
                else {
                    this._keys.push(key);
                    this._values.push(value);
                    this.size += 1;
                }
                index = null;
                return this;
            },

            /**************************************************
             * METHODS NOT PART OF THE `Set` spec for ES6:
             **************************************************/

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

            iterator: function () {
                return this.entries();
            },

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
        sjl.ns('stdlib.SjlMap', SjlMap);
        if (window.__isAmd) {
            return SjlMap;
        }
    }

})();
