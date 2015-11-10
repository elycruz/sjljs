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
        SjlSet = function SjlSet (iterable) {
            var self = this;
            self._values = [];
            self.size = 0;

            // If an array was passed in inject values
            if (sjl.classOfIs(iterable, 'Array')) {
                self.addFromArray(iterable);
            }

            // If anything other than an array is passed in throw an Error
            else if (typeof iterable !== 'undefined') {
                throw new Error ('Type Error: sjl.SjlSet takes only iterable objects as it\'s first parameter. ' +
                    ' Parameter received: ', iterable);
            }

            // Make our `_values` array inherit our special iterator
            makeIterable(self._values, 0);

            // Set custom iterator function on `this`
            self[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(self._values, self._values, 0);
            };

            // Set flag to remember that original iterator was overridden
            self._iteratorOverridden = true;
        };

    /**
     * SjlSet constructor.  This object has the same interface as the es6 `Set`
     * object.  The only difference is this one uses a more sugery iterator which
     * has, in addition to the `next` method, `current`, `iterator`, `pointer`, `rewind`, and
     * `valid` methods (@see sjl.Iterator)
     * @class sjl.SjlSet
     * @extends sjl.Extendable
     * @param iterable {Array}
     */
    SjlSet = Extendable.extend(SjlSet, {
        add: function (value) {
            if (!this.has(value)) {
                this._values.push(value);
                this.size += 1;
            }
            return this;
        },
        clear: function () {
            while (this._values.length > 0) {
                this._values.pop();
            }
            this.size = 0;
            return this;
        },
        delete: function (value) {
            var _index = sjl.indexOf(value, this._values);
            if (_index > -1) {
                delete this._values[_index];
                this.size -= 1;
                this.size = this.size < 0 ? 1 : 0;
            }
            return this;
        },
        entries: function () {
            return new ObjectIterator(this._values, this._values, 0);
        },
        forEach: function (callback, context) {
            sjl.forEach(this._values, callback, context);
            return this;
        },
        has: function (value) {
            return sjl.indexOf(this._values, value) > -1 ? true : false;
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
            var iterator =makeIterable(value, 0)[sjl.Symbol.iterator]();

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
        sjl.package('stdlib.SjlSet', SjlSet);
        if (window.__isAmd) {
            return SjlSet;
        }
    }

})();
