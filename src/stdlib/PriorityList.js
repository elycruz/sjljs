/**
 * Created by elyde on 1/11/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl,
        Extendable = sjl.stdlib.Extendable,
        ObjectIterator = sjl.stdlib.ObjectIterator,
        SjlMap = sjl.stdlib.SjlMap,
        Iterator = sjl.stdlib.Iterator,
        PriorityListItem = function PriorityListItem (key, value, priority, serial) {
            var _priority,
                _serial,
                contextName = 'sjl.stdlib.PriorityListItem';
            Object.defineProperties(this, {
                key: {
                    value: key
                },
                serial: {
                    get: function () {
                        return _serial;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'serial', value, Number);
                        _serial = value;
                    }
                },
                value: {
                    value: value
                },
                priority: {
                    get: function () {
                        return _priority;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'priority', value, Number);
                        _priority = value;
                    }
                }
            });
            this.priority = priority;
            this.serial = serial;
        },
        PriorityList = function PriorityList (objOrArray, LIFO, wrapItems) {
            var _sorted = false,
                __internalPriorities = 0,
                __internalSerialNumbers = 0,
                _LIFO = sjl.isset(LIFO) ? LIFO : false,
                _LIFO_modifier,
                _itemWrapperConstructor = PriorityListItem,
                _wrapItems = sjl.isset(wrapItems) ? wrapItems : true,
                contextName = 'sjl.stdlib.PriorityList',
                classOfIterable = sjl.classOf(objOrArray);

            Object.defineProperties(this, {
                originallyPassedInIterableType: {
                    value: classOfIterable
                },
                itemWrapperConstructor: {
                    get: function () {
                        return _itemWrapperConstructor;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'itemWrapperConstructor', value, Function);
                        _itemWrapperConstructor = value;
                    }
                },
                wrapItems: {
                    get: function () {
                        return _wrapItems;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'wrapItems', value, Boolean);
                        _wrapItems = value;
                    }
                },
                _internalSerialNumbers: {
                    get: function () {
                        return __internalSerialNumbers;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, '__internalSerialNumbers', value, Number);
                        __internalSerialNumbers = value;
                    }
                },
                _internalPriorities: {
                    get: function () {
                        return __internalPriorities;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, '_internalPriorities', value, Number);
                        __internalPriorities = value;
                    }
                },
                LIFO: {
                    get: function () {
                        return _LIFO;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'LIFO', value, Boolean);
                        _LIFO = value;
                        this.sorted = false;
                    }
                },
                LIFO_modifier: {
                    get: function () {
                        return this.LIFO ? 1 : -1;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'LIFO_modifier', value, Number);
                        _LIFO_modifier = value;
                        this.sorted = false;
                    }
                },
                sorted: {
                    get: function () {
                        return _sorted;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'sorted', value, Boolean);
                        _sorted = value;
                    }
                }
            });

            // Validate these via their setters
            this.LIFO = _LIFO;
            this.wrapItems = _wrapItems;

            // Extend instance properties
            SjlMap.call(this);
            Iterator.call(this, this._values);

            // Inject incoming iterable(s)
            if (classOfIterable === 'Object') {
                this.addFromObject(objOrArray);
            }
            else if (classOfIterable === 'Array') {
                this.addFromArray(objOrArray);
            }
        };

    PriorityListItem = Extendable.extend(PriorityListItem);

    PriorityList = SjlMap.extend(PriorityList, {
        // Iterator interface
        // -------------------------------------------
        current: function () {
            var current = Iterator.prototype.current.call(this);
            if (!current.done && this.wrapItems) {
                current.value = current.value.value;
            }
            return current;
        },
        next: function () {
            var next = Iterator.prototype.next.call(this);
            if (!next.done && this.wrapItems) {
                next.value = next.value.value;
            }
            return next;
        },
        valid: function () {
            return Iterator.prototype.valid.call(this);
        },
        rewind: function () {
            return Iterator.prototype.rewind.call(this);
        },
        // forEach doesn't get added as SjlMap already has an implementation of it

        // Overridden Map functions
        // -------------------------------------------
        clear: function () {
            SjlMap.prototype.clear.call(this);
            this.sorted = false;
            return this;
        },
        entries: function () {
            return this.sort().wrapItems ?
                new ObjectIterator(this._keys, this._values.map(function (item) {
                    return item.value;
                })) :
                new SjlMap.prototype.entries.call(this.sort());
        },
        forEach: function (callback, context) {
            SjlMap.prototype.forEach.call(this.sort(), function (value, key, map) {
                callback.call(context, this.wrapItems ? value.value : value, key, map);
            }, this);
            return this;
        },
        keys: function () {
            return SjlMap.prototype.keys.call(this.sort());
        },
        values: function () {
            if (this.wrapItems) {
                return new Iterator(this.sort()._values.map(function (item) {
                    return item.value;
                }));
            }
            return new SjlMap.prototype.values.call(this.sort());
        },
        get: function (key) {
            var result = SjlMap.prototype.get.call(this, key);
            return this.wrapItems && result ? result.value : result;
        },
        set: function (key, value, priority) {
            SjlMap.prototype.set.call(this, key, this.resolveItemWrapping(key, value, priority));
            this.sorted = false;
            return this;
        },

        // Non api specific functions
        // -------------------------------------------
        // Own Api functions
        // -------------------------------------------
        sort: function () {
            var self = this,
                LIFO_modifier = self.LIFO_modifier;

            // If already sorted return self
            if (self.sorted) {
                return self;
            }

            // Sort entries
            self._values.sort(function (a, b) {
                    var retVal;
                    if (a.priority === b.priority) {
                        retVal = a.serial > b.serial;
                    }
                    else {
                        retVal = a.priority > b.priority;
                    }
                    return (retVal ? -1 : 1) * LIFO_modifier;
                })
                .forEach(function (item, index) {
                    self._keys[index] = item.key;
                    item.serial = index;
                });

            // Set sorted to true and pointer to 0
            self.sorted = true;
            self.pointer = 0;
            return self;
        },

        /**
         * Ensures priority returned is a number or increments it's internal priority counter
         * and returns it.
         * @param priority {Number}
         * @returns {Number}
         */
        normalizePriority: function (priority) {
            var retVal;
            if (sjl.classOfIs(priority, Number)) {
                retVal = priority;
            }
            else {
                this._internalPriorities += 1;
                retVal = +this._internalPriorities;
            }
            return retVal;
        },

        resolveItemWrapping: function (key, value, priority) {
            var normalizedPriority = this.normalizePriority(priority),
                serial = this._internalSerialNumbers++;
            if (this.wrapItems) {
                return new (this.itemWrapperConstructor) (key, value, normalizedPriority, serial);
            }
            try {
                value.key = key;
                value.priority = priority;
                value.serial = serial;
            }
            catch (e) {
                throw new TypeError('PriorityList can only work in "unwrapped" mode with values/objects' +
                    ' that can have properties created/set on them.  Type encountered: `' + sjl.classOf(value) + '`;' +
                    '  Original error: ' + e.message);
            }
            return value;
        },

        /**
         * Adds key-value array pairs in an array to this instance.
         * @method sjl.stdlib.PriorityList#addFromArray
         * @param array {Array<Array<*, *>>} - Array of key-value array entries to parse.
         * @returns {PriorityList}
         */
        addFromArray: function (array) {
            this.sorted = false;
            return SjlMap.prototype.addFromArray.call(this, array);
        },

        /**
         * Add all the `object`'s instance's own property key-value pairs to this instance.
         * @method sjl.stdlib.PriorityList#addFromObject
         * @param object {Object} - Object to operate on.
         * @returns {PriorityList}
         */
        addFromObject: function (object) {
            this.sorted = false;
            return SjlMap.prototype.addFromObject.call(this, object);
        }
    });

    if (isNodeEnv) {
        module.exports = PriorityList;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.PriorityList', PriorityList);

        // If `Amd` return the class
        if (window.__isAmd) {
            return PriorityList;
        }
    }

})();
