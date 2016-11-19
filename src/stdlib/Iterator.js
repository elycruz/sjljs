/**
 * Created by Ely on 4/12/2014.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        errorContextName = 'sjl.stdlib.Iterator',
        getPropDescriptor = Object.getOwnPropertyDescriptor,

        /**
         * @param values {Array}
         * @constructor
         * @private
         */
        Iterator = function Iterator(values) {
            sjl.throwTypeErrorIfNotOfType(errorContextName, 'values', values, 'Array');
            var _values = values,
                _pointer = 0;

            /**
             * Public property docs
             *----------------------------------------------------- */
            /**
             * Iterator values.  Set on construction.
             * @name _values
             * @member {Array<*>} sjl.stdlib.Iterator#_values
             * @readonly
             */
            /**
             * Iterator pointer.
             * @name pointer
             * @member {Number} sjl.stdlib.Iterator#pointer
             */
            /**
             * Iterator size.
             * @name size
             * @readonly
             * @member {Number} sjl.stdlib.Iterator#size
             */

            // Set values property
            if (!getPropDescriptor(this, '_values')) {
                Object.defineProperty(this, '_values', {
                    value: _values
                });
            }

            // Set `pointer` property description
            if (!getPropDescriptor(this, 'pointer')) {
                Object.defineProperty(this, 'pointer', {
                    get: function () {
                        return _pointer;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(errorContextName, 'pointer', value, Number);
                        _pointer = sjl.constrainPointer(value, 0, _values.length);
                    },
                    enumerable: true
                });
            }

            if (!getPropDescriptor(this, 'size')) {
                // Define properties before setting values
                Object.defineProperty(this, 'size', {
                    get: function () {
                        return _values.length;
                    },
                    enumerable: true
                });
            }
        };

    /**
     * Es6 compliant iterator constructor with some convenience methods;  I.e.,
     *  `valid`, `rewind`, `current`, and `forEach`.
     * @class sjl.stdlib.Iterator
     * @extends sjl.stdlib.Extendable
     * @param values {Array} - Values to iterate through.
     */
    Iterator = sjl.stdlib.Extendable.extend(Iterator, {

        /**
         * Returns the current value that `pointer` is pointing to.
         * @method sjl.stdlib.Iterator#current
         * @returns {{done: boolean, value: *}}
         */
        current: function () {
            var self = this;
            return self.valid() ? {
                done: false,
                value: self._values[self.pointer]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.stdlib.Iterator#next
         * @returns {{done: boolean, value: *}}
         */
        next: function () {
            var self = this,
                pointer = self.pointer,
                retVal = self.valid() ? {
                    done: false,
                    value: self._values[pointer]
                } : {
                    done: true
                };
            self.pointer += 1;
            return retVal;
        },

        /**
         * Rewinds the iterator.
         * @method sjl.stdlib.Iterator#rewind
         * @returns {sjl.stdlib.Iterator}
         */
        rewind: function () {
            this.pointer = 0;
            return this;
        },

        /**
         * Returns whether the iterator has reached it's end.
         * @method sjl.stdlib.Iterator#valid
         * @returns {boolean}
         */
        valid: function () {
            return this.pointer < this._values.length;
        },

        /**
         * Iterates through all elements in iterator.
         * @param callback {Function}
         * @param context {Object}
         * @method sjl.stdlib.Iterator#forEach
         * @returns {sjl.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            context = context || this;
            this._values.forEach(callback, context);
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = Iterator;
    }
    else {
        sjl.ns('stdlib.Iterator', Iterator);
        if (sjl.__isAmd) {
            return sjl.stdlib.Iterator;
        }
    }

}());
