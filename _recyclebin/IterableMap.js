/**
 * Created by elyde on 1/11/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,

        sjl = isNodeEnv ? require('../src/sjl.js') : window.sjl || {},

        SjlMap = sjl.ns.stdlib.SjlMap,

        // Constructor to augment
        IterableMap = function IterableMap (iterable, pointer, LIFO) {
            var self = this,
                _pointer = 0;

            // Define properties before setting values
            Object.defineProperties(this, {
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
                        _pointer = sjl.constrainPointerWithinBounds(pointer, 0, this._values.length);
                    }
                },
                LIFO: {
                    /**
                     * @type {Boolean}
                     */
                    value: sjl.classOfIs(LIFO, Boolean) ? LIFO : false
                }
            }); // End of properties define

            // Extend with SjlMap
            SjlMap.apply(
                this.pointer(
                    sjl.classOfIs(pointer, Number) ? pointer : 0), arguments);
        };

    /**
     * 'Simple Javascript Library Iteraable Map' object (stand-in object
     *  for es6 `Maps` until they're support is more widely accepted which also
     *  offers an iterable interface).
     *
     * @param iterable {Array|Object} - The object to populate itself from (either an `Array<[[key, value]]>`
     *  or an `Object` hash).
     * @constructor sjl.ns.stdlib.IterableMap
     */
    IterableMap = SjlMap.extend(IterableMap, {

        /**
         * Returns the current key and value that `pointer()` is pointing to as an array [key, value].
         * @method sjl.ns.stdlib.IterableMap#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var self = this,
                pointer = self._pointer;
            return self.valid() ? {
                done: false,
                value: [self._keys[pointer], self._values[pointer]]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.ns.stdlib.IterableMap#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var self = this,
                pointer = self._pointer,
                retVal = self.valid() ? {
                    done: false,
                    value: [self._keys[pointer], self._values[pointer]]
                } : {
                    done: true
                };
            self._pointer = pointer + 1;
            return retVal;
        },

        /**
         * Returns whether the pointer hasn't reached the end of the list or not
         * @returns {boolean}
         */
        valid: function () {
            var pointer = this._pointer;
            return pointer < this._values.length && pointer < this._keys.length;
        },

        /**
         * Rewinds the iterator.
         * @method sjl.ns.stdlib.IterableMap#rewind
         * @returns {sjl.ns.stdlib.IterableMap}
         */
        rewind: function () {
            return this.pointer(0);
        },

        /**
         * Overloaded getter and setter for `_pointer` property.
         * @param pointer {Number|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.ns.stdlib.IterableMap}
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
        }

    });


    if (isNodeEnv) {
        module.exports = IterableMap;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.IterableMap', IterableMap);

        // Set shortcut to class on `sjl`
        sjl.makeNotSettableProp(sjl, 'IterableMap', IterableMap);

        // If `Amd` return the class
        if (window.__isAmd) {
            return IterableMap;
        }
    }

})();
