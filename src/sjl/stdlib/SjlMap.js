/**
 * Created by Ely on 7/17/2015.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        stdlib = sjl.package.stdlib,
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
            if (sjl.classOfIs(iterable, 'Array')) {
                self.addFromArray(iterable);
                // Make our internal arrays inherit our special iterator
                self._values = makeIterable(self._values, 0);
                self._keys = makeIterable(self._keys, 0);
            }

            // If anything other than an array is passed in throw an Error
            else if (typeof iterable !== 'undefined') {
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
                var _index = sjl.indexOf(this._keys, key);
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
                return sjl.indexOf(this._keys, key) > -1 ? true : false;
            },
            keys: function () {
                return this._keys[sjl.Symbol.iterator]();
            },
            values: function () {
                return this._values[sjl.Symbol.iterator]();
            },
            get: function (key) {
                var index = sjl.indexOf(this._keys, key);
                return index > -1 ? this._values[index] : undefined;
            },
            set: function (key, value) {
                var index = sjl.indexOf(this._keys, key);
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
                sjl.forEach(this._keys, function (key, i) {
                    out[key] = self._values[i];
                });
                return out;
            }
        });

    if (isNodeEnv) {
        module.exports = SjlMap;
    }
    else {
        sjl.package('stdlib.SjlMap', SjlMap);
    }

})();