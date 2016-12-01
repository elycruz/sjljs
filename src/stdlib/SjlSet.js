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
     * SjlSet constructor.  This object has the same interface as the es6 `Set`
     * object.  The only difference is this one has some extra methods;  I.e.,
     *  `addFromArray`, `iterator`, and a defined `toJSON` method.
     * @class module:sjl.stdlib.SjlSet
     * @extends sjl.stdlib.Extendable
     * @param iterable {Array}
     */
    SjlSet = Extendable.extend({
        /**
         * Constructor.
         * @param iterable {Array} - Optional.
         * @private
         * @constructor
         */
        constructor: function SjlSet (iterable) {
            var self = this,
                _values = [];

            // Define own props
            Object.defineProperties(this, {
                /**
                 * @name _values
                 * @member {Array<*>} sjl.stdlib.SjlSet#_values - Where the values are kept on the Set.  Default `[]`.
                 * @readonly
                 */
                _values: {
                    value: _values
                },

                /**
                 * @name size
                 * @member {Number} sjl.stdlib.SjlSet#size - Size of Set.  Default `0`.
                 * @readonly
                 */
                size: {
                    get: function () {
                        return _values.length;
                    },
                    enumerable: true
                }
            });

            // If an array was passed in inject values
            if (sjl.classOfIs(iterable, 'Array')) {
                self.addFromArray(iterable);
            }

            // If anything other than an array is passed in throw an Error
            else if (typeof iterable !== _undefined) {
                throw new Error ('Type Error: sjl.SjlSet takes only iterable objects as it\'s first parameter. ' +
                    ' Parameter received: ', iterable);
            }

            // Make our `_values` array inherit our special iterator
            makeIterable(_values);

            // Set custom iterator function on `this`
            self[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(_values, _values);
            };

            /**
             * Flag for knowing that default es6 iterator was overridden.  Set on construction.
             * @name _iteratorOverridden
             * @member {Boolean} sjl.stdlib.SjlSet#_iteratorOverridden.  Default `true`.
             * @readonly
             */

            // Set flag to remember that original iterator was overridden
            Object.defineProperty(self, '_iteratorOverridden', {value: true});
        },

        /**
         * Adds a value to Set.
         * @method sjl.stdlib.SjlSet#add
         * @param value {*}
         * @returns {sjl.stdlib.SjlSet}
         */
        add: function (value) {
            if (!this.has(value)) {
                this._values.push(value);
            }
            return this;
        },

        /**
         * Clears Set.
         * @method sjl.stdlib.SjlSet#clear
         * @returns {sjl.stdlib.SjlSet}
         */
        clear: function () {
            while (this._values.length > 0) {
                this._values.pop();
            }
            return this;
        },

        /**
         * Deletes a value from Set.
         * @method sjl.stdlib.SjlSet#delete
         * @param value {*}
         * @returns {sjl.stdlib.SjlSet}
         */
        delete: function (value) {
            var _index = this._values.indexOf(value);
            if (_index > -1 && _index <= this._values.length) {
                this._values.splice(_index, 1);
            }
            return this;
        },

        /**
         * Es6 compliant iterator for all entries in set
         * @method sjl.stdlib.SjlSet#entries
         * @return {sjl.stdlib.ObjectIterator}
         */
        entries: function () {
            return new ObjectIterator(this._values, this._values, 0);
        },

        /**
         * Loops through values in set and calls callback
         * (with optional context) for each value in set.
         * Same signature as Array.prototype.forEach except for values in Set.
         * @method sjl.stdlib.SjlSet#forEach
         * @param callback {Function} - Same signature as Array.prototype.forEach.
         * @param context {*} - Optional.
         * @returns {sjl.stdlib.SjlSet}
         */
        forEach: function (callback, context) {
            this._values.forEach(callback, context);
            return this;
        },

        /**
         * Checks if value exists within Set.
         * @method sjl.stdlib.SjlSet#has
         * @param value
         * @returns {boolean}
         */
        has: function (value) {
            return this._values.indexOf(value) > -1;
        },

        /**
         * Returns an es6 compliant iterator of Set's values (since set doesn't have any keys).
         * @method sjl.stdlib.SjlSet#keys
         * @returns {sjl.stdlib.Iterator}
         */
        keys: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**
         * Returns an es6 compliant iterator of Set's values.
         * @method sjl.stdlib.SjlSet#values
         * @returns {sjl.stdlib.Iterator}
         */
        values: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**************************************************
         * METHODS NOT PART OF THE `Set` spec for ES6:
         **************************************************/

        /**
         * Adds item onto `SjlSet` from the passed in array.
         * @method sjl.stdlib.SjlSet#addFromArray
         * @param value {Array}
         * @returns {sjl.stdlib.SjlSet}
         */
        addFromArray: function (value) {
            // Iterate through the passed in iterable and add all values to `_values`
            var iterator = makeIterable(value, 0)[sjl.Symbol.iterator]();

            // Loop through values and add them
            while (iterator.valid()) {
                this.add(iterator.next().value);
            }
            iterator = null;
            return this;
        },

        /**
         * Returns an iterator with an es6 compliant interface.
         * @method sjl.stdlib.SjlSet#iterator
         * @returns {sjl.stdlib.Iterator}
         */
        iterator: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**
         * Returns own `values`.
         * @method sjl.stdlib.SjlSet#toJSON
         * @returns {Array<*>}
         */
        toJSON: function () {
            return this._values;
        }
    });

    if (isNodeEnv) {
        module.exports = SjlSet;
    }
    else {
        sjl.ns('stdlib.SjlSet', SjlSet);
        if (sjl.isAmd) {
            return SjlSet;
        }
    }

})();
