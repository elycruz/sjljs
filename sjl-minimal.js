/**! 
 * sjl-minimal.js Tue Dec 02 2014 00:12:48 GMT-0500 (Eastern Standard Time)
 **/
/**
 * Created by Ely on 5/24/2014.
 * Defines argsToArray, classOfIs, classOf, empty,
 *  isset, keys, and namespace, on the passed in context.
 * @param {Object} context
 * @returns void
 */
(function (context) {

    context.sjl = context.sjl || {};

    var slice = Array.prototype.slice,
        notLCaseFirst = typeof context.sjl.lcaseFirst !== 'function',
        notUCaseFirst = typeof context.sjl.ucaseFirst !== 'function',
        noExtractBoolFromArrayStart = typeof context.sjl.extractBoolFromArrayStart !== 'function',
        noExtractBoolFromArrayEnd = typeof context.sjl.extractBoolFromArrayEnd !== 'function';

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
                (val === null ? 'Null' :
                    (function () {
                        var retVal = Object.prototype.toString.call(val);
                        return retVal.substring(8, retVal.length - 1);
                    }()));
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
            return context.sjl.classOf(obj) === humanString;
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
            if (context.sjl.classOfIs(value, 'Array') || context.sjl.classOfIs(value, 'String')) {
                retVal = value.length === 0;
            }

            // If value is a number and is not 0
            else if (context.sjl.classOfIs(value, 'Number') && value !== 0) {
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
                args = context.sjl.argsToArray(arguments);

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
                shouldSetValue = context.sjl.classOfIs(valueToSet, 'Undefined')
                    ? false : true,
                i;

            for (i = 0; i < parts.length; i += 1) {
                if (context.sjl.classOfIs(parent[parts[i]], 'Undefined') && !shouldSetValue) {
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

    if (notLCaseFirst || notUCaseFirst) {
        /**
         * Used when composing a function that needs to operate on the first character found and needs to
         * return the original string with the modified character within it.
         * @see sjl.lcaseFirst or sjl.ucaseFirst (search within this file)
         * @param str {String} - string to search for first alpha char on
         * @param func {String} - function to run on first alpha char found; i.e., found[func]()
         * @param thisFuncsName {String} - the function name that is using this function (in order
         *      to present a prettier error message on `TypeError`)
         * @throws {TypeError} - If str is not of type "String"
         * @returns {String} - composed string
         */
        function changeCaseOfFirstChar (str, func, thisFuncsName) {
            var search, char, right, left;

            // If typeof `str` is not of type "String" then bail
            if (!context.sjl.classOfIs(str, 'String')) {
                throw new TypeError(thisFuncsName + ' expects parameter 1 ' +
                    'to be of type "String".  ' +
                    'Value received: "' + context.sjl.classOf(str) + '".');
            }

            // Search for first alpha char
            search = str.search(/[a-z]/i);

            // If alpha char
            if (context.sjl.classOfIs(search, 'Number') && search > -1) {

                // Make it lower case
                char = str.substr(search, 1)[func]();

                // Get string from `char`'s index
                right = str.substr(search + 1, str.length - 1);

                // Get string upto `char`'s index
                left = search !== 0 ? str.substr(0, search) : '';

                // Concatenate original string with lower case char in it
                str = left + char + right;
            }

            return str;
        }
    }

    if (notLCaseFirst) {
        /**
         * Lower cases first character of a string.
         * @param {String} str
         * @throws {TypeError}
         * @returns {String}
         */
        context.sjl.lcaseFirst = function (str) {
            return changeCaseOfFirstChar (str, 'toLowerCase', 'lcaseFirst');
        }
    }

    if (notUCaseFirst) {
        /**
         * Upper cases first character of a string.
         * @param {String} str
         * @returns {String}
         */
        context.sjl.ucaseFirst = function (str) {
            return changeCaseOfFirstChar (str, 'toUpperCase', 'ucaseFirst');
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
         * @param {Regex} replaceStrRegex default /[^a-z0-9] * /i (without spaces before and after '*')
         * @returns {String}
         */
        context.sjl.camelCase = function (str, upperFirst, replaceStrRegex) {
            upperFirst = upperFirst || false;
            replaceStrRegex = replaceStrRegex || /[^a-z\d]/i;
            var newStr = "", i,

            // Get clean string
                parts = str.split(replaceStrRegex);

            // Upper Case First char for parts
            for (i = 0; i < parts.length; i += 1) {

                // If alpha chars
                if (/[a-z\d]/.test(parts[i])) {

                    // ucase first char and append to new string,
                    // if part is a digit just gets returned by `ucaseFirst`
                    newStr += context.sjl.ucaseFirst(parts[i]);
                }
            }

            // If should not be upper case first
            if (!upperFirst) {
                // Then lower case first
                newStr = context.sjl.lcaseFirst(newStr);
            }

            return newStr;
        };
    }

    if (noExtractBoolFromArrayStart || noExtractBoolFromArrayEnd) {
        /**
         * Extracts a boolean from the beginning or ending of an array depending on startOrEndBln.
         * @todo ** Note ** Closure within this function is temporary and should be removed.
         * @param array {Array}
         * @param startOrEnd {Boolean}
         * @returns {Boolean}
         */
        function extractBoolFromArray(array, startOrEndBln) {
            var expectedBool = startOrEndBln ? array[0] : array[array.length - 1],
                retVal = false;
            if (context.sjl.classOfIs(expectedBool, 'Boolean')) {
                retVal = startOrEndBln ? array.shift() : array.pop();
            }
            else if (context.sjl.classOfIs(expectedBool, 'Undefined')) {
                startOrEndBln ? array.shift() : array.pop();
                retVal = false;
            }
            return retVal;
        }
    }

    if (noExtractBoolFromArrayStart) {
        /**
         * Returns boolean from beginning of array if any.  If item at beginning of array is undefined returns `false`.
         * @param array {Array}
         * @returns {Boolean}
         */
        context.sjl.extractBoolFromArrayStart = function (array) {
            return extractBoolFromArray(array, true);
        };
    }

    if (noExtractBoolFromArrayEnd) {
        /**
         * Returns boolean from beginning of array if any.  If item at beginning of array is undefined returns `false`.
         * @param array {Array}
         * @returns {Boolean}
         */
        context.sjl.extractBoolFromArrayEnd = function (array) {
            return extractBoolFromArray(array, false);
        };
    }

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 5/24/2014.
 * ** Cartesian functions copied from "Javascript the definitive guide"
 * ** getValueFromObj and setValueOnObj are not from "Javascript ..."
 */
(function (context) {

    context.sjl = context.sjl || {};

    if (typeof context.sjl.getValueFromObj !== 'function') {
        /**
         * Searches obj for key and returns it's value.  If value is a function
         * calls function, with optional `args`, and returns it's return value.
         * If `raw` is true returns the actual function if value found is a function.
         * @method getValueFromObj
         * @param key {String} The hash key to search for
         * @param obj {Object} the hash to search within
         * @param args {Array} optional the array to pass to value if it is a function
         * @param raw {Boolean} optional whether to return value even if it is a function
         * @todo allow this function to use getter function for key if it exists
         * @returns {*}
         */
        context.sjl.getValueFromObj = function (key, obj, args, raw) {
            args = args || null;
            raw = raw || false;
            var retVal = null;
            if (context.sjl.classOfIs(key, 'String') && context.sjl.isset(obj)) {
                retVal = key.indexOf('.') !== -1 ? context.sjl.namespace(key, obj) :
                    (typeof obj[key] !== 'undefined' ? obj[key] : null);
                if (context.sjl.classOfIs(retVal, 'Function') && context.sjl.empty(raw)) {
                    retVal = args ? retVal.apply(obj, args) : retVal.apply(obj);
                }
            }
            return retVal;
        };
    }

    if (typeof context.sjl.setValueOnObj !== 'function') {
        /**
         * Sets a key to value on obj.
         * @param key {String} - Key to search for (can be a dot
         * separated string 'all.your.base' will traverse {all: {your: {base: {...}}})
         * @param value {*} - Value to set on obj
         * @param obj {Object} - Object to set key to value on
         * @returns {*|Object} returns result of setting key to value on obj or obj
         * if no value resulting from set operation
         */
        context.sjl.setValueOnObj = function (key, value, obj) {
            // Get qualified setter function name
            var setterFunc = 'set' + context.sjl.camelCase(key, true),
                retVal = obj;

            // If obj has a setter function for key, call it
            if (context.sjl.isset(obj[setterFunc])) {
                retVal = obj[setterFunc](value);
            }

            // Else set the value on the obj
            else if (key.indexOf('.') !== -1) {
                retVal = context.sjl.namespace(key, value, obj);
            }

            else {
                obj[key] = typeof value !== 'undefined' ? value : null;
            }

            // Return result of setting value on obj, else return obj
            return retVal;
        };
    }

    if (typeof context.sjl.extend === 'undefined') {
        /**
         * Copy the enumerable properties of p to o, and return o.
         * If o and p have a property by the same name, o's property is overwritten.
         * This function does not handle getters and setters or copy attributes but
         * does search for setter methods in the format "setPropertyName" and uses them
         * if they are available for property `useLegacyGettersAndSetters` is set to true.
         * @param o {mixed} - *object to extend
         * @param p {mixed} - *object to extend from
         * @param deep {Boolean} - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
         * @param useLegacyGettersAndSetters {Boolean} - Whether or not to use sjl.setValueOnObj for setting values (only works if not using the `deep` the feature or `deep` is `false`)
         * @returns {*} - returns o
         */
        function extend (o, p, deep, useLegacyGettersAndSetters) {
            deep = deep || false;
            useLegacyGettersAndSetters = useLegacyGettersAndSetters || false;

            // If `o` or `p` are not set bail
            if (!sjl.isset(o) || !sjl.isset(p)) {
                return o;
            }

            for (var prop in p) { // For all props in p.
                if (deep) {
                    if (!context.sjl.empty(o[prop])
                        && !context.sjl.empty(o[prop])
                        && context.sjl.classOfIs(o[prop], 'Object')
                        && context.sjl.classOfIs(p[prop], 'Object')) {
                        context.sjl.extend(deep, o[prop], p[prop]);
                    }
                    else {
                        o[prop] = p[prop];
                    }
                }
                else if (useLegacyGettersAndSetters) {
                    context.sjl.setValueOnObj(prop,
                        context.sjl.getValueFromObj(prop, p), o); // Add the property to o.
                }
                else {
                    o[prop] = p[prop];
                }
            }
            return o;
        }

        context.sjl.extend = function () {
            // Return if no arguments
            if (arguments.length === 0) {
                return;
            }

            var args = context.sjl.argsToArray(arguments),
                deep = context.sjl.extractBoolFromArrayStart(args),
                useLegacyGettersAndSetters = context.sjl.extractBoolFromArrayEnd(args),
                arg0 = args.shift();

            // Extend object `0` with other objects
            for (arg in args) {
                arg = args[arg];

                // Extend `arg0` if `arg` is an object
                if (sjl.classOfIs(arg, 'Object')) {
                    extend(arg0, arg, deep, useLegacyGettersAndSetters);
                }
            }

            return arg0;
        };
    }

    if (typeof context.sjl.clone !== 'function') {
        /**
         * Returns copy of object.
         * @param obj
         * @returns {*}
         */
        context.sjl.clone = function (obj) {
            return  context.sjl.extend(true, {}, obj);
        };
    }

//    if (typeof context.sjl.merge === 'undefined') {
        /**
         * Copy the enumerable properties of p to o, and return o.
         * If o and p have a property by the same name, o's property is left alone.
         * This function does not handle getters and setters or copy attributes.
         * @param o {mixed} - *object to merge to
         * @param p {mixed} - *object to merge from
         * @returns {*} - returns o
         */
//        context.sjl.merge = function (o, p) {
//            for (prop in p) { // For all props in p.
//                if (o.hasOwnProperty[prop]) continue; // Except those already in o.
//                o[prop] = p[prop]; // Add the property to o.
//            }
//            return o;
//        };
//    }

//    if (typeof context.sjl.subtract === 'undefined') {
        /**
         * For each property of p, delete the property with the same name from o.
         * Return o.
         */
//        context.sjl.subtract = function (o, p) {
//            for (prop in p) { // For all props in p
//                delete o[prop]; // Delete from o (deleting a
//                // nonexistent prop is harmless)
//            }
//            return o;
//        };
//    }

//    if (typeof context.sjl.restrict === 'undefined') {
        /**
         * Remove properties from o if there is not a property with the same name in p.
         * Return o.
         */
//        context.sjl.restrict = function (o, p) {
//            for (prop in o) { // For all props in o
//                if (!(prop in p)) delete o[prop]; // Delete if not in p
//            }
//            return o;
//        };
//    }

//    if (typeof context.sjl.union === 'undefined') {
        /**
         * Return a new object that holds the properties of both o and p.
         * If o and p have properties by the same name, the values from p are used.
         */
//        context.sjl.union = function (o, p, deep, useLegacyGettersAndSetters) {
//            return context.sjl.extend(deep, context.sjl.clone(o), p, useLegacyGettersAndSetters);
//        };
//    }

//    if (typeof context.sjl.intersection === 'undefined') {
        /**
         * Return a new object that holds only the properties of o that also appear
         * in p. This is something like the intersection of o and p, but the values of
         * the properties in p are discarded
         */
//        context.sjl.intersection = function (o, p) {
//            return context.sjl.restrict(context.sjl.clone(o), p);
//        };
//    }

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 5/24/2014.
 */
(function (context) {

    if (typeof Function.prototype.extend === 'undefined') {
        /**
         * Make functions/constructors extendable
         * @param constructor {function}
         * @param methods {object} - optional
         * @param statics {mixed|object|null|undefined} - optional
         * @todo refactor this.  Figure out a way not to extend `Function`
         * @returns {*}
         */
        Function.prototype.extend = function (constructor, methods, statics) {
            return context.sjl.defineSubClass(this, constructor, methods, statics);
        };
    }

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 5/24/2014.
 */
(function (context) {

    if (typeof context.sjl.copyOfProto === 'undefined') {
        /**
         * Creates a copy of a prototype to use for inheritance.
         * @param proto
         * @returns {*}
         */
        context.sjl.copyOfProto = function (proto) {
            if (proto == null) throw TypeError('`inherit` function expects param1 to be a non-null value.'); // p must be a non-null object
            if (Object.create) // If Object.create() is defined...
                return Object.create(proto); // then just use it.
            var type = typeof proto; // Otherwise do some more type checking
            if (type !== "object" && type !== "function") throw TypeError();
            function func() {
            } // Define a dummy constructor function.
            func.prototype = proto; // Set its prototype property to p.
            return new func();
        };
    }

    if (typeof context.sjl.defineSubClass === 'undefined') {

        /**
         * Helper function which creates a constructor using `val` as a string
         * or just returns the constructor if `val` is a constructor.
         * @param val
         * @returns {*}
         * @throws {Error} - If can't resolve constructor from `val`
         */
        function resolveConstructor (val) {
            // Check if is string and hold original string
            // Check if is string and hold original string
            var isString = sjl.classOfIs(val, 'String'),
                originalString = val,
                _val = val;

            // If constructor is a string, create it from string
            if (isString) {

                // Make sure constructor has uppercased first letter
                _val = sjl.camelCase(_val, true);

                try {
                    // Evaluate string as constructor
                    eval('_val = function ' + _val + '(){}');
                }
                catch (e) {
                    // Else throw error
                    throw new Error('An error occurred while trying to define a ' +
                        'sub class using: "' + originalString + '" as a sub class in `sjl.defineSubClass`.  ' +
                        'In unminified source: "./src/sjl/sjl-oop-util-functions.js"')
                }
            }

            // If not a constructor and is original string
            if (!sjl.classOfIs(_val, 'Function') && isString) {
                throw new Error ('Could not create constructor from string: "' + originalString + '".');
            }

            // If not a constructor and not a string
            else if (!sjl.classOfIs(_val, 'Function') && !isString) {
                throw new Error ('`sjl.defineSubClass` requires constructor ' +
                    'or string to create a subclass of "' +
                    '.  In unminified source "./src/sjl/sjl-oop-util-functions.js"');
            }

            return _val;
        }

        /**
         * Defines a subclass using a `superclass`, `constructor`, methods and/or static methods
         * @param superclass {Function}
         * @param constructor {Function}
         * @param methods {Object} - optional
         * @param statics {Object} - optional
         * @returns {*}
         */
        context.sjl.defineSubClass = function (superclass, // Constructor of the superclass
                                               constructor, // The constructor for the new subclass
                                               methods, // Instance methods: copied to prototype
                                               statics) // Class properties: copied to constructor
        {
            var _constructor = resolveConstructor(constructor);

            // Set up the prototype object of the subclass
            _constructor.prototype = context.sjl.copyOfProto(superclass.prototype || superclass);

            // Define constructor's constructor
            _constructor.prototype.constructor = constructor;

            // Copy the methods and statics as we would for a regular class
            if (methods) context.sjl.extend(_constructor.prototype, methods);

            // If static functions set them
            if (statics) context.sjl.extend(_constructor, statics);

            // Return the class
            return _constructor;
        };

    }

    if (typeof context.sjl.throwNotOfTypeError === 'undefined') {
        context.sjl.throwNotOfTypeError = function (value, paramName, funcName, expectedType) {
            throw Error(funcName + ' expects ' + paramName +
                ' to be of type "' + expectedType + '".  Value received: ' + value);
        };
    }

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */
(function (context) {
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
        return context.sjl.defineSubClass(this, constructor, methods, statics);
    };

    context.sjl.Extendable = Extendable;

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 6/21/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.Attributable = context.sjl.Extendable.extend(function Attributable () {},{

        /**
         * Gets or sets a collection of attributes.
         * @param attrs {mixed|Array|Object} - Attributes to set or get from object
         * @todo add an `attr` function to this class
         * @returns {context.sjl.Attributable}
         */
        attrs: function (attrs) {
            var self = this,
                retVal = self;
            switch(context.sjl.classOf(attrs)) {
                case 'Array':
                    retVal = self._getAttribs(attrs);
                    break;
                case 'Object':
                    context.sjl.extend(true, self, attrs, true);
                    break;
                default:
                    retVal = self._getAttribs(attrs);
                    break;
            }
            return retVal;
        },

        attr: function (attrs) {
            return this.attrs(attrs);
        },

        /**
         * Gets a set of attributes hash for queried attributes.
         * @param attribsList {Array} - Attributes list to return
         * @returns {*}
         * @private
         */
        _getAttribs: function (attrsList) {
            var attrib,
                out = {},
                self = this;

            // If attribute list is not an array
            if (!context.sjl.classOfIs(attrsList, 'Array')) {
                return;
            }

            // Loop through attributes to get and set them for return
            for (attrib in attrsList) {
                attrib = attrsList[attrib];
                out[attrib] = typeof self[attrib] !== 'undefined'
                    ? context.sjl.getValueFromObj(attrib, self) : null;
            }

            // Return queried attributes
            return out;
        }

    });
})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 7/21/2014.
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.Optionable = context.sjl.Extendable.extend(function Optionable(options) {
            this.options = new context.sjl.Attributable();
            if (context.sjl.classOfIs(options, 'Object')) {
                this.setOptions(options);
            }
        },
        {
            setOption: function (key, value) {
                context.sjl.setValueOnObj(key, value, this.options);
                return this;
            },

            setOptions: function (options) {
                if (context.sjl.classOfIs(options, 'Object')) {
                    this.options.attrs(options);
                }
                return this;
            },

            getOption: function (key) {
                return context.sjl.getValueFromObj(key, this.options);
            },

            getOptions: function (options) {
                var retVal = null;
                if (context.sjl.classOfIs(options, 'Array')) {
                    retVal = this.options.attrs(options);
                }
                return retVal;
            }
        });

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    context.sjl.Iterator = context.sjl.Extendable.extend(
        function Iterator(values, pointer) {
            this.collection = values || [];
            this.pointer = sjl.classOfIs(pointer, 'Number') ? parseInt(pointer, 10) : 0;
        },
        {
            current: function () {
                var self = this;
                return self.valid() ? {
                    done: false,
                    value: self.getCollection()[self.getPointer()]
                } : {
                    done: true
                };
            },

            next: function () {
                var self = this,
                    pointer = self.getPointer();

                pointer += 1;

                self.pointer = pointer;

                return self.valid() ? {
                    done: false,
                    value: self.getCollection()[pointer]
                } : {
                    done: true
                };
            },

            rewind: function () {
                this.pointer = 0;
            },

            valid: function () {
                return this.getPointer() < this.getCollection().length;
            },

            getPointer: function () {
                return context.sjl.classOfIs(this.pointer, 'Number') ? this.pointer : 0;
            },

            getCollection: function () {
                return context.sjl.classOfIs(this.collection, 'Array') ? this.collection : [];
            }

        });

})(typeof window === 'undefined' ? global : window);