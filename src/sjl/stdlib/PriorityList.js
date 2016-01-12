/**
 * Created by elyde on 1/11/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Extendable = sjl.ns.stdlib.Extendable,
        SjlMap = sjl.ns.stdlib.SjlMap,
        priorityItemSerial = 0,
        PriorityListItem = function PriorityListItem (key, value, priority) {
            var _priority;
            Object.defineProperty({
                key: {
                    value: key
                },
                serial: {
                    value: priorityItemSerial++
                },
                value: {
                    value: value
                },
                priority: {
                    get: function () {
                        return _priority;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityListItem.name, 'priority', value, Number);
                        _priority = priority;
                    }
                }
            });
            this.priority = priority;
        },
        PriorityList = function PriorityList (objOrArray, LIFO) {
            LIFO = sjl.classOfIs(LIFO, Boolean) ? LIFO : false;
            var _sorted = false;
            Object.defineProperties(this, {
                originallyPassedInIterableType: {
                    value: sjl.classOf(objOrArray)
                },
                itemsMap: {
                    value: new SjlMap(objOrArray)
                },
                LIFO: {
                    value: LIFO ? 1 : -1
                },
                sorted: {
                    get: function () {
                        return _sorted;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'sorted', value, Boolean);
                        _sorted = value;
                    }
                },
                size: {
                    get: function () {
                        return this.itemsMap.size;
                    }
                }
            });
        };

    PriorityListItem = Extendable.extend(PriorityListItem);

    PriorityList = Extendable.extend(PriorityList, {
        // Own Api functions
        // -------------------------------------------
        sort: function () {
            var retVal = this,
                sortedValues,
                sortedKeys;
            if (this.sorted) {
                return retVal;
            }
            sortedValues = [].concat(this.itemsMap._values).sort(function (a, b) {
                return ((a.priority === b.priority ? -1 : 1) * retVal.LIFO > 0)
                    ? (a.serial > b.serial ? -1 : 1)
                    : (a.priority > a.priority ? -1 : 1);
            }, this);
            sortedKeys = sortedValues.map(function (item) {
                return item.key;
            });
            this.itemsMap._keys = sortedKeys;
            this.itemsMap._values = sortedValues;
            this.sorted = true;
            return this;
        },

        isLIFO: function () {
            return this.LIFO === 1;
        },

        // Iterator functions
        // -------------------------------------------
        /**
         * Returns the current key and value that `pointer()` is pointing to as an array [key, value].
         * @method sjl.ns.stdlib.SjlMap#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var current = this.itemsMap.current();
            return !current.done ? current.value.value : current;
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.ns.stdlib.SjlMap#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var next = this.itemsMap.next();
            return !next.done ? next.value.value : next;
        },

        /**
         * Returns whether the pointer hasn't reached the end of the list or not
         * @returns {boolean}
         */
        valid: function () {
            return this.itemsMap.valid();
        },

        /**
         * Rewinds the iterator.
         * @method sjl.ns.stdlib.SjlMap#rewind
         * @returns {sjl.ns.stdlib.SjlMap}
         */
        rewind: function () {
            this.itemsMap.rewind();
            return this;
        },

        /**
         * Overloaded getter and setter for internal maps `_pointer` property.
         * @param pointer {Number|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.ns.stdlib.PriorityList}
         * @throws {TypeError} - If `pointer` is set and is not of type `Number`.
         */
        pointer: function (pointer) {
            var retVal = this;
            // If is a getter call get the value
            if (typeof pointer === _undefined) {
                retVal = this.itemsMap._pointer;
            }
            // If is a setter call
            else {
                // Set and validate pointer (validated via `_pointer` getter property definition)
                this.itemsMap._pointer = pointer;
            }
            return retVal;
        },

        // Map functions
        // -------------------------------------------
        clear: function () {
            this.pointer(0).itemsMap.clear();
            this.sorted = false;
            return this;
        },
        entries: function () {
            var out = [];
            this.sort().itemsMap.forEach(function (key, value) {
                out.push([key, value.value]);
            });
            return sjl.iterable(out)
        },
        forEach: function (callback, context) {
            return this.sort().itemsMap.forEach(callback, context);
        },
        has: function (key) {
            return this.itemsMap.has(key);
        },
        keys: function () {
            return sjl.iterable(this.sort().itemsMap.keys().map(function (value) {
                return value.value.value;
            }));
        },
        values: function () {
            return sjl.iterable(this.sort().itemsMap.values().map(function (value) {
                return value.value.value;
            }));
        },
        get: function (key) {
            return this.itemsMap.get(key).value;
        },
        set: function (key, value, priority) {
            this.sorted = false;
            this.itemsMap.set(key, new PriorityListItem(key, value, priority));
            return this;
        },
        delete: function (key) {
            this.itemsMap.delete(key);
            return this;
        },

        // Non api specific functions
        // -------------------------------------------
        toJSON: function () {}
    });

    if (isNodeEnv) {
        module.exports = PriorityList;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.PriorityList', PriorityList);

        // Set shortcut to class on `sjl`
        sjl.makeNotSettableProp(sjl, 'PriorityList', PriorityList);

        // If `Amd` return the class
        if (window.__isAmd) {
            return PriorityList;
        }
    }

})();
