/**
 * Created by Ely on 7/17/2015.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    sjl.SjlMap = sjl.Extendable.extend(function SjlMap (iterable) {
            var self = this;
            self.size = 0;

            // If an array was passed in inject values
            if (sjl.classOfIs(iterable, 'Array')) {

                // Make our internal arrays inherit our special iterator
                self._values = sjl.iterable([], 0);
                self._keys = sjl.iterable([], 0);

                self.addFromArray(iterable);
            }

            // If anything other than an array is passed in throw an Error
            else if (typeof iterable !== 'undefined') {
                throw new Error ('Type Error: sjl.SjlMap takes only iterable objects as it\'s first parameter. ' +
                ' Parameter received: ', iterable);
            }

            // Set custom iterator function on `this`
            self[sjl.Symbol.iterator] = function () {
                return sjl.ObjectIterator(self._values, self._values, 0);
            };

            // Set flag to remember that original iterator was overridden
            self._iteratorOverridden = true;
        },
        {
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
                var _index = sjl.indexOf(this._values, key);
                if (this.has(key)) {
                    delete this._values[_index];
                    delete this._keys[_index];
                    this.size -= 1;
                    this.size = this.size < 0 ? 1 : 0;
                }
                return this;
            },
            entries: function () {
                return sjl.ObjectIterator(this._keys, this._values, 0);
            },
            forEach: function (callback) {
                sjl.forEach(this._values, callback);
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
                    this._values[index] = value;
                }
                else {
                    this._keys.push(key);
                    this._vales.push(value);
                }
                index = null;
                return this;
            },

            /**************************************************
             * METHODS NOT PART OF THE `Set` spec for ES6:
             **************************************************/

            addFromArray: function (value) {
                // Iterate through the passed in iterable and add all values to `_values`
                var iterator = sjl.iterable(value, 0)[sjl.Symbol.iterator](),
                    entry;

                // Loop through values and add them
                while (iterator.valid()) {
                    entry = iterator.next().value;
                    this.set(entry[0], entry[1]);
                }
                iterator = null;
                entry = null;
                return this;
            },

            iterator: function () {
                return this._values[sjl.Symbol.iterator]();
            }
        });

})(typeof window === 'undefined' ? global : window);