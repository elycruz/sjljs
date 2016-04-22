(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        stdlib = sjl.ns.stdlib,
        Extendable = stdlib.Extendable,
        ObjectIterator = stdlib.ObjectIterator,
        makeIterable = stdlib.iterable,
        SjlSet = function SjlSet (iterable) {
            var self = this,
                _values = [];

            Object.defineProperties(this, {
                _values: {
                    get: function () {
                        return _values;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(SjlSet.name, '_values', value, Array);
                        _values = makeIterable(value);
                    }
                },
                size: {
                    get: function () {
                        return _values.length;
                    }
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

            // Set flag to remember that original iterator was overridden
            self._iteratorOverridden = true;
        };

    /**
     * SjlSet constructor.  This object has the same interface as the es6 `Set`
     * object.  The only difference is this one uses a more sugery iterator which
     * has, in addition to the `next` method, `current`, `iterator`, `pointer`, `rewind`, and
     * `valid` methods (@see sjl.Iterator)
     * @constructor SjlSet
     * @memberof namespace:sjl.ns.stdlib
     * @extends sjl.ns.stdlib.Extendable
     * @param iterable {Array}
     */
    SjlSet = Extendable.extend(SjlSet, {
        add: function (value) {
            if (!this.has(value)) {
                this._values.push(value);
            }
            return this;
        },
        clear: function () {
            while (this._values.length > 0) {
                this._values.pop();
            }
            return this;
        },
        delete: function (value) {
            var _index = this._values.indexOf(value);
            if (_index > -1 && _index <= this._values.length) {
                this._values.splice(_index, 1);
            }
            return this;
        },
        entries: function () {
            return new ObjectIterator(this._values, this._values, 0);
        },
        forEach: function (callback, context) {
            this._values.forEach(callback, context);
            return this;
        },
        has: function (value) {
            return this._values.indexOf(value) > -1 ? true : false;
        },
        keys: function () {
            return this._values[sjl.Symbol.iterator]();
        },
        values: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**************************************************
         * METHODS NOT PART OF THE `Set` spec for ES6:
         **************************************************/

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

        iterator: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        toJSON: function () {
            return this._values;
        }
    });

    if (isNodeEnv) {
        module.exports = SjlSet;
    }
    else {
        sjl.ns('stdlib.SjlSet', SjlSet);
        sjl.defineEnumProp(sjl, 'SjlSet', SjlSet);
        if (window.__isAmd) {
            return SjlSet;
        }
    }


})();
