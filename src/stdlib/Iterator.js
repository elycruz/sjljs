/**
 * Created by Ely on 4/12/2014.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        errorContextName = 'sjl.ns.stdlib.Iterator',

        Iterator = function Iterator(values, pointer) {
            var _values,
                _pointer = 0;

            // Define properties before setting values
            Object.defineProperties(this, {
                _values: {
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
                        this._pointer = _pointer; // Force pointer within bounds (if it is out of bounds)
                    }
                },
                _pointer: {
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
                        _pointer = sjl.constrainPointerWithinBounds(pointer, 0, _values.length);
                    }
                },
                size: {
                    get: function () {
                        return _values.length;
                    }
                }
            }); // End of properties define

            // Set values
            this._values = values || [];
        };

    /**
     * @class sjl.ns.stdlib.Iterator
     * @extends sjl.ns.stdlib.Extendable
     * @type {void|Object|*}
     */
    Iterator = sjl.ns.stdlib.Extendable.extend(Iterator, {
        /**
         * Returns the current value that `pointer` is pointing to.
         * @method sjl.ns.stdlib.Iterator#current
         * @returns {{done: boolean, value: *}}
         */
        current: function () {
            var self = this;
            return self.valid() ? {
                done: false,
                value: self._values[self._pointer]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.ns.stdlib.Iterator#next
         * @returns {{done: boolean, value: *}}
         */
        next: function () {
            var self = this,
                pointer = self._pointer,
                retVal = self.valid() ? {
                    done: false,
                    value: self._values[pointer]
                } : {
                    done: true
                };
            self._pointer += 1;
            return retVal;
        },

        /**
         * Rewinds the iterator.
         * @method sjl.ns.stdlib.Iterator#rewind
         * @returns {sjl.ns.stdlib.Iterator}
         */
        rewind: function () {
            return this.pointer(0);
        },

        /**
         * Returns whether the iterator has reached it's end.
         * @method sjl.ns.stdlib.Iterator#valid
         * @returns {boolean}
         */
        valid: function () {
            return this._pointer < this._values.length;
        },

        /**
         * Overloaded getter and setter for `_pointer` property.
         * @param pointer {Number|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.ns.stdlib.Iterator}
         * @throws {TypeError} - If `pointer` is set and is not of type `Number`.
         */
        pointer: function (pointer) {
            var retVal = this;
            // If is a getter call get the value
            if (typeof pointer === _undefined) {
                retVal = this._pointer;
            }
            // If is a setter call
            else {
                // Set and validate pointer (validated via `_pointer` getter property definition)
                this._pointer = pointer;
            }
            return retVal;
        },

        /**
         * Overloaded getter and setter for `_values` property.
         * @param values {Array|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.ns.stdlib.Iterator}
         * @throws {TypeError} - If `values` is set and is not of type `Array`.
         */
        values: function (values) {
            var retVal = this;
            // If is a getter call get the value
            if (typeof values === _undefined) {
                retVal = this._values;
            }
            // If is a setter call
            else {
                // Set and check if value is of expected type and throw error if
                // it is not (done via `_values` property definition).
                this._values = values;
            }
            return retVal;
        },

        /**
         * Iterates through all elements in iterator.  @note Delegates to it's values `forEach` method.
         * @param callback {Function}
         * @param context {Object}
         * @returns {sjl.ns.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            this._values.forEach(callback, context);
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = Iterator;
    }
    else {
        sjl.ns('stdlib.Iterator', Iterator);
        sjl.defineEnumProp(sjl, 'Iterator', Iterator);
        if (window.__isAmd) {
            return sjl.ns.stdlib.Iterator;
        }
    }


}());
