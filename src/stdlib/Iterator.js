/**
 * Created by Ely on 4/12/2014.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        errorContextName = 'sjl.stdlib.Iterator',

        Iterator = function Iterator(values, pointer) {
            var _values,
                _pointer = 0;

            // Define properties before setting values
            Object.defineProperties(this, {
                values: {
                    /**
                     * @returns {Array}
                     */
                    get: function () {
                        return _values;
                    },
                    /**
                     * @param values {Array}
                     * @throws {TypeError}
                     * @note Pointer gets constrained to bounds of `values`'s length if it is out of
                     *  bounds (if it is less than `0` gets pushed to `0` if it is greater than values.length
                     *      gets pulled back down to values.length).
                     */
                    set: function (values) {
                        sjl.throwTypeErrorIfNotOfType(errorContextName, 'values', values, Array);
                        _values = values;
                        this.pointer = _pointer; // Force pointer within bounds (if it is out of bounds)
                    }
                },
               pointer: {
                    /**
                     * @returns {Number}
                     */
                    get: function () {
                        return _pointer;
                    },
                    /**
                     * @param pointer {Number}
                     * @throws {TypeError}
                     */
                    set: function (pointer) {
                        sjl.throwTypeErrorIfNotOfType(errorContextName, 'pointer', pointer, Number);
                        _pointer = sjl.constrainPointer(pointer, 0, _values.length);
                    }
                },
                size: {
                    get: function () {
                        return _values.length;
                    }
                }
            }); // End of properties define

            // Set values
            this.values = values || [];
        };

    /**
     * @class sjl.stdlib.Iterator
     * @extends sjl.stdlib.Extendable
     * @type {void|Object|*}
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
                value: self.values[self.pointer]
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
                    value: self.values[pointer]
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
            return this.pointer < this.values.length;
        },

        /**
         * Iterates through all elements in iterator.  @note Delegates to it's values `forEach` method.
         * @param callback {Function}
         * @param context {Object}
         * @returns {sjl.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            context = context || this;
            this.values.forEach(callback, context);
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = Iterator;
    }
    else {
        sjl.ns('stdlib.Iterator', Iterator);
        if (window.__isAmd) {
            return sjl.stdlib.Iterator;
        }
    }

}());
