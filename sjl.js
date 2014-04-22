/**! sjl.min.js Mon Apr 21 2014 21:50:01 GMT-0400 (Eastern Daylight Time) **//**
 * Created by Ely on 4/19/2014.
 */

/**
 * Defines argsToArray, classOfIs, classOf, empty, isset, and namespace, on the passed in context.
 * @param {Object} context
 * @returns void
 * @todo make all functions ecmascript < 5 compatible
 */
(function (context) {

    context.sjl = context.sjl || {};

    var slice = Array.prototype.slice;

    if (typeof context.sjl.argsToArray !== 'function') {
        context.sjl.argsToArray = function (args) {
            return slice.call(args, 0, args.length);
        };
    }

    if (typeof context.sjl.isset !== 'function') {

        /**
         * Checks to see if value is set (not null and not undefined).
         * @param value
         * @returns {boolean}
         */
        function isSet(value) {
            return (value !== undefined && value !== null);
        }

        /**
         * Checks to see if any of the arguments passed in are
         * set (not undefined and not null).
         * Returns false on the first argument encountered that
         * is null or undefined.
         * @returns {boolean}
         */
        context.sjl.isset = function () {
            var retVal = false,
                check;

            if (arguments.length > 1) {
                for (var i in arguments) {
                    i = arguments[i];
                    check = isSet(i);
                    if (!check) {
                        retVal = check;
                        break;
                    }
                }
            }
            else if (arguments.length === 1) {
                retVal = isSet(arguments[0]);
            }

            return retVal;
        };
    }

    if (typeof context.sjl.classOf !== 'function') {
        /**
         * Returns the class name of an object from it's class string.
         * @param val {mixed}
         * @returns {string}
         */
        context.sjl.classOf = function (val) {
            return typeof val === 'undefined' ? 'Undefined' :
                Object.prototype.toString.call(val).split(/\[object\s/)[1].split(']')[0];
        };
    }

    if (typeof context.sjl.classOfIs !== 'function') {

        /**
         * Checks to see if an object is of type humanString (class name) .
         * @param humanString {string} (class string; I.e., "Number", "Object", etc.)
         * @param obj {mixed}
         * @returns {boolean}
         */
        context.sjl.classOfIs = function (obj, humanString) {
            return classOf(obj) === humanString;
        };
    }

    if (typeof context.sjl.empty !== 'function') {
        /**
         * Checks object's own properties to see if it is empty.
         * @param obj object to be checked
         * @returns {boolean}
         */
        function isEmptyObj(obj) {
            var retVal = obj === true ? false : true;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    retVal = false;
                    break;
                }
            }
            return retVal;
        }

        /**
         * Checks to see if value is empty (objects, arrays,
         * strings etc.).
         * @param value
         * @returns {boolean}
         */
        function isEmptyValue(value) {
            var retVal;

            // If value is an array or a string
            if (classOfIs(value, 'Array') || classOfIs(value, 'String')) {
                retVal = value.length === 0;
            }

            // If value is a number and is not 0
            else if (classOfIs(value, 'Number') && value !== 0) {
                retVal = false;
            }

            // Else
            else {
                retVal = (value === 0 || value === false
                    || value === undefined || value === null
                    || isEmptyObj(value));
            }

            return retVal;
        }

        /**
         * Checks to see if any of the arguments passed in are empty.
         * @returns {boolean}
         */
        context.sjl.empty = function () {
            var retVal, check,
                i, item,
                args = argsToArray(arguments);

            // If multiple arguments
            if (args.length > 1) {

                // No empties empties until proven otherwise
                retVal = false;

                // Loop through args and check their values
                for (i = 0; i < args.length - 1; i += 1) {
                    item = args[i];
                    check = isEmptyValue(item);
                    if (check) {
                        retVal = true;
                        break;
                    }
                }
            }

            // If one argument
            else if (args.length === 1) {
                retVal = isEmptyValue(args[0]);
            }

            // If no arguments
            else {
                retVal = true;
            }

            return retVal;
        };
    }

    if (typeof context.sjl.namespace !== 'function') {
        /**
         * Takes a namespace string and fetches that location out from
         * an object/Map.  If the namespace doesn't exists it is created then
         * returned.
         * Example: namespace('hello.world.how.are.you.doing', obj) will
         * create/fetch within `obj`:
         * hello: { world: { how: { are: { you: { doing: {} } } } } }
         * @param ns_string {String} the namespace you wish to fetch
         * @param objToSearch {Object} object to search for namespace on
         * @param valueToSet {Object} optional, a value to set on the key
         *  (last key if key string (a.b.c.d = value))
         * @returns {Object}
         */
        context.sjl.namespace = function (ns_string, objToSearch, valueToSet) {
            var parts = ns_string.split('.'),
                parent = objToSearch,
                shouldSetValue = classOfIs(valueToSet, 'Undefined')
                    ? false : true,
                i;

            for (i = 0; i < parts.length; i += 1) {
                if (classOfIs(parent[parts[i]], 'Undefined') && !shouldSetValue) {
                    parent[parts[i]] = {};
                }
                else if (i === parts.length - 1 && shouldSetValue) {
                    parent[parts[i]] = valueToSet;
                }
                parent = parent[parts[i]];
            }

            return parent;
        };
    }

    if (typeof context.sjl.lcaseFirst !== 'function') {
        /**
         * Lower cases first character of a string.
         * @param {String} str
         * @returns {String}
         */
        context.lcaseFirst = function (str) {
            var retVal = str = str ? str + "" : "";
            if (str.length > 0) {
                var rslt = str.match(/[a-z]/i);
                retVal = rslt.length > 0 ? rslt[0].toLowerCase() + str.substr(1) : str;
            }
            return retVal;
        };
    }

    if (typeof context.sjl.ucaseFirst !== 'function') {
        /**
         * Upper cases first character of a string.
         * @param {String} str
         * @returns {String}
         */
        context.ucaseFirst = function (str) {
            str = str + "";
            s0 = str.match(/^[a-z]/i);
            if (!s0 instanceof Array) {
                return null;
            }
            return s0[0].toUpperCase() + str.substr(1);
        };
    }

    if (typeof context.sjl.camelCase) {

        /**
         * Make a string code friendly. Camel cases a dirty string into
         * a valid javascript variable/constructor name;  Uses `replaceStrRegex`
         * to replace unwanted characters with a '-' and then splits and merges
         * the parts with the proper casing, pass in `true` for lcaseFirst
         * to lower case the first character.
         * @param {String} str
         * @param {Boolean} lowerFirst default `false`
         * @param {Regex} replaceStrRegex default /[^a-z0-9\-_] * /i (without spaces before and after '*')
         * @returns {String}
         */
        context.camelCase = function (str, lowerFirst, replaceStrRegex) {
            lowerFirst = lowerFirst || false;
            replaceStrRegex = replaceStrRegex || /[^a-z0-9\-_]*/i;
            var newStr = "";
            str = str + "";
            str = str.replace(replaceStrRegex, '-');
            for (_str in str.split('-')) {
                if (/^[a-z]/i.test(_str)) {
                    newStr += context.sjl.ucaseFirst(_str);
                }
                else {
                    newStr += _str;
                }
            }
            ;
            if (lowerFirst) {
                newStr = context.sjl.lcaseFirst(newStr);
            }
            return newStr;
        };
    }

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */
(function (context) {

    /**
     * Make functions/constructors extendable
     * @param constructor {function}
     * @param methods {object} - optional
     * @param statics {mixed|object|null|undefined} - optional
     * @todo refactor this.  Figure out a way not to extend `Function`
     * @returns {*}
     */
    Function.prototype.extend = function (constructor, methods, statics) {
        return defineSubClass(this, constructor, methods, statics);
    };

    /*
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is overwritten.
     * This function does not handle getters and setters or copy attributes.
     */
    function extend(o, p) {
        for (prop in p) { // For all props in p.
            o[prop] = p[prop]; // Add the property to o.
        }
        return o;
    }

    /*
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is left alone.
     * This function does not handle getters and setters or copy attributes.
     */
    function merge(o, p) {
        for (prop in p) { // For all props in p.
            if (o.hasOwnProperty[prop]) continue; // Except those already in o.
            o[prop] = p[prop]; // Add the property to o.
        }
        return o;
    }

    /*
     * Remove properties from o if there is not a property with the same name in p.
     * Return o.
     */
    function restrict(o, p) {
        for (prop in o) { // For all props in o
            if (!(prop in p)) delete o[prop]; // Delete if not in p
        }
        return o;
    }

    /*
     * For each property of p, delete the property with the same name from o.
     * Return o.
     */
    function subtract(o, p) {
        for (prop in p) { // For all props in p
            delete o[prop]; // Delete from o (deleting a
            // nonexistent prop is harmless)
        }
        return o;
    }

    /*
     * Return a new object that holds the properties of both o and p.
     * If o and p have properties by the same name, the values from p are used.
     */
    function union(o, p) {
        return extend(extend({}, o), p);
    }

    /*
     * Return a new object that holds only the properties of o that also appear
     * in p. This is something like the intersection of o and p, but the values of
     * the properties in p are discarded
     */
    function intersection(o, p) {
        return restrict(extend({}, o), p);
    }

    /*
     * Return an array that holds the names of the enumerable own properties of o.
     */
    function keys(o) {
        if (typeof o !== "object") throw TypeError('`keys` function expects param1 to be an object.'); // Object argument required
        var result = []; // The array we will return
        for (var prop in o) { // For all enumerable properties
            if (o.hasOwnProperty(prop)) // If it is an own property
                result.push(prop); // add it to the array.
        }
        return result; // Return the array.
    }

    /**
     *
     * @param proto
     * @returns {*}
     */
    function inherit(proto) {
//        console.log(proto);
        if (proto == null) throw TypeError('`inherit` function expects param1 to be a non-null value.'); // p must be a non-null object
        if (Object.create) // If Object.create() is defined...
            return Object.create(proto); // then just use it.
        var type = typeof proto; // Otherwise do some more type checking
        if (type !== "object" && type !== "function") throw TypeError();
        function func() {
        } // Define a dummy constructor function.
        func.prototype = proto; // Set its prototype property to p.
        return new func();
    }

    /**
     * Defines a subclass using a `superclass`, `constructor`, methods and/or static methods
     * @param superclass {Function}
     * @param constructor {Function}
     * @param methods {Object} - optional
     * @param statics {Object} - optional
     * @returns {*}
     */
    function defineSubClass(superclass, // Constructor of the superclass
                            constructor, // The constructor for the new subclass
                            methods, // Instance methods: copied to prototype
                            statics) // Class properties: copied to constructor
    {
        // Set up the prototype object of the subclass
        constructor.prototype = inherit(superclass.prototype);

        constructor.prototype.constructor = constructor;

        // Copy the methods and statics as we would for a regular class
        if (methods) extend(constructor.prototype, methods);

        if (statics) extend(constructor, statics);

        // Return the class
        return constructor;
    }

    /**
     * The `Extendable` constructor
     * @constructor
     */
    function Extendable() {}

    // Get a handle to Extendable's prototype
    var proto = Extendable.prototype;

    /**
     * Creates a subclass off of `constructor`
     * @param constructor {Function}
     * @param methods {Object} - optional
     * @param statics {Object} - optional
     * @returns {*}
     */
    proto.extend = function (constructor, methods, statics) {
        return defineSubClass(this, constructor, methods, statics);
    };

    proto.intersect = intersection;

    proto.keys = keys;

    proto.merge = merge;

    proto.restrict = restrict;

    proto.subtract = subtract;

    proto.union = union;

    context.sjl.Extendable = Extendable;

})(typeof window === 'undefined' ? global : window);


/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    context.sjl.Iterator = context.sjl.Extendable.extend(
        function Iterator(values, pointer) {
            this.collection = values || [];
            this.pointer = pointer || 0;
        },
        {
            current: function () {
                var self = this;
                return {
                    done: this.valid(),
                    value: self.getCollection()[self.getPointer()]
                };
            },

            next: function () {
                var self = this,
                    pointer = self.getPointer()

                self.pointer = pointer += 1;

                return {
                    done: self.valid(),
                    value: self.getCollection()[pointer]
                };
            },

            rewind: function () {
                this.pointer = 0;
            },

            valid: function () {
                return this.getCollection().length - 1 <= this.getPointer();
            },

            getPointer: function () {
                return /^\d+$/.test(this.pointer + '') ? 0 : this.pointer;
            },

            getCollection: function () {
                return context.sjl.classOfIs(this.collection, 'Array') ? this.collection : [];
            }

        });

})(typeof window === 'undefined' ? global : window);
