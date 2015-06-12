/**! 
 * sjl-minimal.js Fri Jun 12 2015 09:51:25 GMT-0400 (Eastern Daylight Time)
 **/
/**
 * Created by Ely on 5/29/2015.
 */
(function (context) {

    'use strict';

    /**
     * @module sjl
     * @description Sjl object.
     * @type {Object}
     */
    context.sjl = !context.hasOwnProperty('sjl')
        || Object.prototype.toString.apply(context.sjl)
            .indexOf('Object') === -1 ? {} : context.sjl;

}(typeof window === 'undefined' ? global : window));

/**
 * Created by Ely on 5/24/2014.
 * Defines argsToArray, classOfIs, classOf, empty,
 *  isset, keys, and namespace, on the passed in context.
 */

'use strict';

(function (context) {

    var slice = Array.prototype.slice,
        notLCaseFirst = typeof context.sjl.lcaseFirst !== 'function',
        notUCaseFirst = typeof context.sjl.ucaseFirst !== 'function',
        noExtractBoolFromArrayStart = typeof context.sjl.extractBoolFromArrayStart !== 'function',
        noExtractBoolFromArrayEnd = typeof context.sjl.extractBoolFromArrayEnd !== 'function',
        extractBoolFromArray,
        changeCaseOfFirstChar,
        isEmptyValue,
        isEmptyObj,
        isSet;

    if (typeof context.sjl.argsToArray !== 'function') {
        /**
         * Calls Array.prototype.slice on arguments object passed in.
         * @function module:sjl.argsToArray
         * @param args {Arguments}
         * @returns {Array}
         */
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
        isSet = function (value) {
            return (value !== undefined && value !== null);
        };

        /**
         * Checks to see if any of the arguments passed in are
         * set (not undefined and not null).
         * Returns false on the first argument encountered that
         * is null or undefined.
         * @function module:sjl.isset
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

        /**
         * Checks whether a key on an object is set.
         * @function module:sjl.issetObjKey
         * @param obj {Object} - Object to search on.
         * @param key {String} - Key to search on `obj`.
         * @returns {boolean}
         */
        context.sjl.issetObjKey = function (obj, key) {
            return obj.hasOwnProperty(key) && isSet(obj[key]);
        };
    }

    if (typeof context.sjl.classOf !== 'function') {
        /**
         * Returns the class name of an object from it's class string.
         * @function module:sjl.classOf
         * @param val {mixed}
         * @returns {string}
         */
        context.sjl.classOf = function (value) {
            var typeofValue = typeof value,
                retVal;

            if (typeofValue === 'undefined') {
                retVal = 'Undefined';
            }
            else if (value === null) {
                retVal = 'Null';
            }
            else {
                value = Object.prototype.toString.call(value);
                retVal = value.substring(8, value.length - 1);
            }
            return retVal;
        };
    }

    if (typeof context.sjl.classOfIs !== 'function') {

        /**
         * Checks to see if an object is of type humanString (class name) .
         * @function module:sjl.classOfIs
         * @param obj {*} - Object to be checked.
         * @param humanString {String} - Class string to check for; I.e., "Number", "Object", etc.
         * @param ...rest {String} - Same as `humanString`.  Optional.
         * @returns {Boolean} - Whether object matches class string(s) or not.
         */
        context.sjl.classOfIs = function (obj, humanString) {
            var args = context.sjl.argsToArray(arguments),
                retVal = false;
            args.shift();
            for (var i = 0; i < args.length; i += 1) {
                humanString = args[i];
                retVal = context.sjl.classOf(obj) === humanString;
                if (retVal) {
                    break;
                }
            }
            return retVal;
        };
    }

    if (typeof context.sjl.empty !== 'function') {
        /**
         * Checks object's own properties to see if it is empty.
         * @param obj object to be checked
         * @returns {boolean}
         */
        isEmptyObj = function (obj) {
            var retVal = obj === true ? false : true;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    retVal = false;
                    break;
                }
            }
            return retVal;
        };

        /**
         * Checks to see if value is empty (objects, arrays,
         * strings etc.).
         * @param value
         * @returns {boolean}
         */
        isEmptyValue = function (value) {
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
        };

        /**
         * Checks to see if any of the arguments passed in are empty.
         * @function module:sjl.empty
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

        /**
         * Retruns a boolean based on whether a key on an object has an empty value or is empty (not set, undefined, null)
         * @function module:sjl.isEmptyObjKey
         * @param obj {Object} - Object to search on.
         * @param key {String} - Key to search for one `obj`.
         * @param type {String} - Optional.
         * @returns {boolean}
         */
        context.sjl.isEmptyObjKey = function (obj, key, type) {
            var isOfType = true,
                issetObjKey = context.sjl.issetObjKey(obj, key),
                isEmpty = !issetObjKey || context.sjl.empty(obj[key]) || false;

            // Check obj[key] type if type isset
            if (issetObjKey && typeof type !== 'undefined' && context.sjl.classOfIs(type, 'String')) {
                isOfType = context.sjl.classOfIs(obj[key], type);
            }

            return isEmpty || !isOfType;
        };
    }

    if (typeof context.sjl.namespace !== 'function') {
        /**
         * Takes a namespace string and fetches that location out from
         * an object/Map.  If the namespace doesn't exists it is created then
         * returned.
         * @example
         * // will create/fetch within `obj`: hello: { world: { how: { are: { you: { doing: {} } } } } }
         * namespace('hello.world.how.are.you.doing', obj)
         *
         * @function module:sjl.namespace
         * @param ns_string {String} - The namespace you wish to fetch
         * @param objToSearch {Object} - The object to search for namespace on
         * @param valueToSet {Object} - Optional.  A value to set on the key (last key if key string (a.b.c.d = value)).
         * @returns {Object}
         */
        context.sjl.namespace = function (ns_string, objToSearch, valueToSet) {
            var parts = ns_string.split('.'),
                parent = objToSearch,
                shouldSetValue = context.sjl.classOfIs(valueToSet, 'Undefined')
                    ? false : true,
                i;

            for (i = 0; i < parts.length; i += 1) {
                if (context.sjl.classOfIs(parent[parts[i]], 'Undefined')) {
                    parent[parts[i]] = {};
                }
                if (i === parts.length - 1 && shouldSetValue) {
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
        changeCaseOfFirstChar = function (str, func, thisFuncsName) {
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
        };
    }

    if (notLCaseFirst) {
        /**
         * Lower cases first character of a string.
         * @function module:sjl.lcaseFirst
         * @param {String} str
         * @throws {TypeError}
         * @returns {String}
         */
        context.sjl.lcaseFirst = function (str) {
            return changeCaseOfFirstChar (str, 'toLowerCase', 'lcaseFirst');
        };
    }

    if (notUCaseFirst) {
        /**
         * Upper cases first character of a string.
         * @function module:sjl.ucaseFirst
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
         * @function module:sjl.camelCase
         * @param {String} str
         * @param {Boolean} lowerFirst default `false`
         * @param {Regex} replaceStrRegex default /[^a-z0-9] * /i (without spaces before and after '*')
         * @returns {String}
         */
        context.sjl.camelCase = function (str, upperFirst, replaceStrRegex) {
            upperFirst = upperFirst || false;
            replaceStrRegex = replaceStrRegex || /[^a-z\d]/i;
            var newStr = '', i,

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
        extractBoolFromArray = function (array, startOrEndBln) {
            var expectedBool = startOrEndBln ? array[0] : array[array.length - 1],
                retVal = false;
            if (context.sjl.classOfIs(expectedBool, 'Boolean')) {
                retVal = startOrEndBln ? array.shift() : array.pop();
            }
            else if (context.sjl.classOfIs(expectedBool, 'Undefined')) {
                if (startOrEndBln) {
                    array.shift();
                }
                else {
                    array.pop();
                }
                retVal = false;
            }
            return retVal;
        };
    }

    if (noExtractBoolFromArrayStart) {
        /**
         * Returns boolean from beginning of array if any.  If item at beginning of array is undefined returns `false`.
         * @function module:sjl.extractBoolFromArrayStart
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
         * @function module:sjl.extractBoolFromArrayEnd
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
 * Cartesian functions copied from "Javascript the definitive guide"
 * getValueFromObj and setValueOnObj are not from "Javascript ..."
 */

'use strict';

(function (context) {

    /**
     * Used by sjl.extend definition
     * @type {Function}
     */
    var extend,
        getOwnPropertyDescriptor = typeof Object.getOwnPropertyDescriptor === 'function' ? Object.getOwnPropertyDescriptor : null;

    if (typeof context.sjl.getValueFromObj !== 'function') {
        /**
         * Searches obj for key and returns it's value.  If value is a function
         * calls function, with optional `args`, and returns it's return value.
         * If `raw` is true returns the actual function if value found is a function.
         * @function module:sjl.getValueFromObj
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
            var retVal = key.indexOf('.') !== -1 ? context.sjl.namespace(key, obj) :
                    (typeof obj[key] !== 'undefined' ? obj[key] : null);
            if (context.sjl.classOfIs(retVal, 'Function') && context.sjl.empty(raw)) {
                retVal = args ? retVal.apply(obj, args) : retVal.apply(obj);
            }
            return retVal;
        };
    }

    if (typeof context.sjl.setValueOnObj !== 'function') {
        /**
         * Sets a key to value on obj.
         * @function module:sjl.setValueOnObj
         * @param key {String} - Key to search for (can be a dot
         * separated string 'all.your.base' will traverse {all: {your: {base: {...}}})
         * @param value {*} - Value to set on obj
         * @param obj {Object} - Object to set key to value on
         * @returns {*|Object} returns result of setting key to value on obj or obj
         * if no value resulting from set operation
         */
        context.sjl.setValueOnObj = function (key, value, obj) {
            // Get qualified setter function name
            var overloadedSetterFunc = context.sjl.camelCase(key, false),
                setterFunc = 'set' + context.sjl.camelCase(key, true),
                retVal = obj;


            // Else set the value on the obj
            if (key.indexOf('.') !== -1) {
                retVal = context.sjl.namespace(key, obj, value);
            }

            // If obj has a setter function for key, call it
            else if (!context.sjl.isEmptyObjKey(obj, setterFunc, 'Function')) {
                retVal = obj[setterFunc](value);
            }

            else if (!context.sjl.isEmptyObjKey(obj, overloadedSetterFunc, 'Function')) {
                retVal = obj[overloadedSetterFunc](value);
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
        extend = function (o, p, deep, useLegacyGettersAndSetters) {
            deep = deep || false;
            useLegacyGettersAndSetters = useLegacyGettersAndSetters || false;

            var prop, propDescription;

            // If `o` or `p` are not set bail
            if (!sjl.isset(o) || !sjl.isset(p)) {
                return o;
            }

            for (prop in p) { // For all props in p.

                // If property is present on target (o) and is not writable, skip iteration
                if (getOwnPropertyDescriptor) {
                    propDescription = getOwnPropertyDescriptor(o, prop);
                    if (propDescription && !propDescription.writable) {
                        continue;
                    }
                }

                if (deep && !useLegacyGettersAndSetters) {
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
        };

        /**
         * Extends first object passed in with all other object passed in after.
         * First param could be a boolean indicating whether or not to perform a deep extend.
         * Last param could also be a boolean indicating whether to use legacy setters if they are available
         * when extending one object with another.
         *
         * @example
         *  var o = {setGreeting: v => this.greeting = 'Hello ' + v},
         *      otherObject = {greeting: 'Junior'};
         *  // Calls o.setGreeting when merging otherObject because `true` was passed in
         *  // as the last parameter
         *  sjl.extend(o, otherObject, true);
         *
         * @function module:sjl.extend
         * @param [, boolean, obj] {Object|Boolean} - If boolean, causes `extend` to perform a deep extend.  Optional.
         * @param [, obj, obj] {Object} - Objects to hierarchically extend.
         * @param [, boolean] {Boolean} - Optional.
         * @returns {Object} - Returns first object passed in.
         */
        context.sjl.extend = function () {
            // Return if no arguments
            if (arguments.length === 0) {
                return;
            }

            var args = context.sjl.argsToArray(arguments),
                deep = context.sjl.extractBoolFromArrayStart(args),
                useLegacyGettersAndSetters = context.sjl.extractBoolFromArrayEnd(args),
                arg0 = args.shift(),
                arg;

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
         * @function module:sjl.clone
         * @param obj {Object}
         * @returns {*} - Cloned object.
         */
        context.sjl.clone = function (obj) {
            return  context.sjl.extend(true, {}, obj);
        };
    }

    if (typeof context.sjl.jsonClone !== 'function') {
        /**
         * Returns copy of object using JSON stringify/parse.
         * @function module:sjl.jsonClone
         * @param obj {Object} - Object to clone.
         * @returns {*} - Cloned object.
         */
        context.sjl.jsonClone = function (obj) {
            return JSON.parse(JSON.stringify(obj));
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

    'use strict';

    var resolveConstructor;

    if (typeof context.sjl.copyOfProto === 'undefined') {
        /**
         * Creates a copy of a prototype to use for inheritance.
         * @function module:sjl.copyOfProto
         * @param proto {Prototype|Object} - Prototype to make a copy of.
         * @returns {*}
         */
        context.sjl.copyOfProto = function (proto) {
            if (proto === null) throw new TypeError('`copyOfProto` function expects param1 to be a non-null value.'); // p must be a non-null object
            if (Object.create) // If Object.create() is defined...
                return Object.create(proto); // then just use it.
            var type = typeof proto; // Otherwise do some more type checking
            if (type !== 'object' && type !== 'function') throw new TypeError();
            function Func() {
            } // Define a dummy constructor function.
            Func.prototype = proto; // Set its prototype property to p.
            return new Func();
        };
    }

    if (typeof context.sjl.defineSubClass === 'undefined') {

        /**
         * Helper function which creates a constructor using `val` as a string
         * or just returns the constructor if `val` is a constructor.
         * @param value {*} - Value to resolve to constructor.
         * @returns {*}
         * @throws {Error} - If can't resolve constructor from `value`
         */
        resolveConstructor = function (value) {
            // Check if is string and hold original string
            // Check if is string and hold original string
            var isString = sjl.classOfIs(value, 'String'),
                originalString = value,
                _val = value;

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
                        'In unminified source: "./src/sjl/sjl-oop-util-functions.js"');
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
        };

        /**
         * Defines a subclass using a `superclass`, `constructor`, methods and/or static methods
         * @function module:sjl.defineSubClass
         * @param superclass {Constructor} - SuperClass's constructor.  Required.
         * @param constructor {Constructor} -  Constructor.  Required.
         * @param methods {Object} - Optional.
         * @param statics {Object} - Static methods. Optional.
         * @returns {Constructor}
         */
        context.sjl.defineSubClass = function (superclass, // Constructor of the superclass
                                               constructor, // The constructor for the new subclass
                                               methods, // Instance methods: copied to prototype
                                               statics) // Class properties: copied to constructor
        {
            var _constructor = resolveConstructor(constructor);

            // Set up the prototype object of the subclass
            _constructor.prototype = context.sjl.copyOfProto(superclass.prototype || superclass);

            // Make the constructor extendable
            _constructor.extend = function (constructor_, methods_, statics_) {
                    return context.sjl.defineSubClass(this, constructor_, methods_, statics_);
                };

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
        /**
         * Throws an error using a formatted string that reports the function name,
         * the expected parameter type, and the value recieved.
         * @function module:sjl.throwNotOfTypeError
         * @param value
         * @param paramName
         * @param funcName
         * @param expectedType
         * @throws {Error}
         */
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

    'use strict';

    /**
     * The `sjl.Extendable` constructor (a constructor that has a static `extend` method for easy extending).
     * @class module:sjl.Extendable
     * @name sjl.Extendable
     */
    context.sjl.Extendable = context.sjl.defineSubClass(Function, function Extendable() {});

    /**
     * Extends a new copy of self with passed in parameters.
     * @method sjl.Extendable.extend
     * @param constructor {Constructor} - Required.
     * @param methods {Object} - Optional.
     * @param statics {Object} - Static methods. Optional.
     */

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 6/21/2014.
 */
(function (context) {

    'use strict';

    /**
     * @class sjl.Attributable
     * @extends sjl.Extendable
     * @type {void|Object|*}
     */
    context.sjl.Attributable = context.sjl.Extendable.extend(function Attributable () {},{

        /**
         * Gets or sets a collection of attributes.
         * @method sjl.Attributable#attrs
         * @param attrs {mixed|Array|Object} - Attributes to set or get from object
         * @todo add an `attr` function to this class
         * @returns {sjl.Attributable}
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
                case 'String':
                    retVal = context.sjl.getValueFromObj(attrs, self);
                    break;
                default:
                    context.sjl.extend(true, self, attrs, true);
                    break;
            }
            return retVal;
        },

        /**
         * Setter and getter for attributes on self {Optionable}.
         * @param 0 {Object|String} - Key or object to set on self.
         * @param 1 {*} - Value to set when using function as a setter.
         * @returns {*|sjl.Attributable} - If setter returns self else returned mixed.
         */
        attr: function () {
            return this.attrs(arguments);
        },

        /**
         * Gets a set of attributes hash for queried attributes.
         * @method sjl.Attributable#_getAttribs
         * @param attribsList {Array} - Attributes list to return
         * @returns {*}
         * @private
         */
        _getAttribs: function (attrsList) {
            var attrib,
                out = {},
                self = this;

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
 * @note `set` and `setOptions` are different from the `merge` function in
 *  that they force the use of legacy setters if they are available;
 *  e.g., setName, setSomePropertyName, etc..
 */
(function (context) {

    'use strict';

    /**
     * Optionable Constructor merges all objects passed in to it's `options` hash.
     * Also this class has convenience methods for querying it's `options` hash (see `get` and `set` methods.
     * @class sjl.Optionable
     * @extends sjl.Extendable
     * @type {void|context.sjl.Optionable}
     */
    context.sjl.Optionable = context.sjl.Extendable.extend(function Optionable(/*[, options]*/) {
            this.options = new context.sjl.Attributable();
            this.merge.apply(this, arguments);
        },
        {
            /**
             * Sets an option on Optionable's `options` using `sjl.setValueOnObj`;
             *  E.g., `optionable.options = value`;
             * @deprecated - Will be removed in version 1.0.0
             * @method sjl.Optionable#setOption
             * @param key
             * @param value
             * @returns {sjl.Optionable}
             */
            setOption: function (key, value) {
                context.sjl.setValueOnObj(key, value, this.options);
                return this;
            },

            /**
             * Sets each key value pair to  Optionable's `options` using
             *  `sjl.Attributable`'s `attrs` function;
             *  E.g., `optionable.options.attrs(Object);
             * @deprecated - Will be removed in version 1.0.0
             * @method sjl.Optionable#setOptions
             * @param key {String}
             * @param value {Object}
             * @returns {sjl.Optionable}
             */
            setOptions: function (options) {
                if (context.sjl.classOfIs(options, 'Object')) {
                    this.options.attrs(options);
                }
                //else {
                //    throw context.sjl.throwNotOfTypeError(options, 'options', 'setOptions', 'Object');
                //}
                return this;
            },

            /**
             * Gets an options value by key.
             * @deprecated - Slotted for removal in version 1.0.0
             * @method sjl.Optionable#getOption
             * @param key {String}
             * @returns {*}
             */
            getOption: function (key) {
                return context.sjl.getValueFromObj(key, this.options);
            },

            /**
             * Gets options by either array or just by key.
             * @deprecated - Slotted for removal in version 1.0.0
             * @method sjl.Optionable#getOptions
             * @param options {Array|String}
             * @returns {*}
             */
            getOptions: function (options) {
                var classOfOptions = sjl.classOf(options),
                    retVal = this.options;
                if (classOfOptions === 'Array' || classOfOptions === 'String') {
                    retVal = this.options.attrs(options);
                }
                return retVal;
            },

            /**
             * Gets one or many option values.
             * @method sjl.Optionable#get
             * @param keyOrArray
             * @returns {*}
             */
            get: function (keyOrArray) {
                return this.getOptions(keyOrArray);
            },

            /**
             * Sets an option (key, value) or multiple options (Object)
             * based on what's passed in.
             * @method sjl.Optionable#set
             * @param0 {String|Object}
             * @param1 {*}
             * @returns {sjl.Optionable}
             */
            set: function () {
                var self = this,
                    args = sjl.argsToArray(arguments),
                    typeOfArgs0 = sjl.classOf(args[0]);
                if (typeOfArgs0 === 'String') {
                    self.setOption(args[0], args[1]);
                }
                else if (typeOfArgs0 === 'Object') {
                    self.setOptions(args[0]);
                }
                return self;
            },

            /**
             * Checks a key/namespace string ('a.b.c') to see if `this.options`
             *  has a value (a non falsy value otherwise returns `false`).
             * @method sjl.Optionable#has
             * @param nsString - key or namespace string
             * @returns {Boolean}
             */
            has: function (nsString) {
                var parts = nsString.split('.'),
                    i, nsStr, retVal = false;
                if (parts.length > 1) {
                    nsStr = parts.shift();
                    for (i = 0; i <= parts.length; i += 1) {
                        retVal = !sjl.empty(sjl.namespace(nsStr, this.options));
                        if (!retVal) {
                            break;
                        }
                        nsStr += '.' + parts[i];
                    }
                }
                else {
                    retVal = !sjl.empty(sjl.namespace(nsString, this.options));
                }
                return retVal;
            },

            /**
             * Merges all objects passed in to `options`.
             * @method sjl.Optionable#merge
             * @param0-* {Object} - Any number of `Object`s passed in.
             * @lastParam {Object|Boolean} - If last param is a boolean then
             *  context.sjl.setValueOnObj will be used to merge each
             *  key=>value pair to `options`.
             * @returns {sjl.Optionable}
             */
            merge: function (options) {
                var args = sjl.argsToArray(arguments),
                    useLegacyGettersAndSetters = sjl.extractBoolFromArrayEnd(args),
                    tailConcat = args;
                if (useLegacyGettersAndSetters) {
                    tailConcat = args.concat([useLegacyGettersAndSetters]);
                }
                sjl.extend.apply(sjl, [true, this.options].concat(tailConcat));
                return this;
            }

        });

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    'use strict';

    /**
     * @class sjl.Iterator
     * @extends sjl.Extendable
     * @type {void|Object|*}
     */
    context.sjl.Iterator = context.sjl.Extendable.extend(
        function Iterator(values, pointer) {
            if (!(this instanceof sjl.Iterator)) {
                return new sjl.Iterator(values, pointer);
            }
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
                    pointer = self.getPointer(),
                    retVal = self.valid() ? {
                        done: false,
                        value: self.getCollection()[pointer]
                    } : {
                        done: true
                    };
                self.pointer = pointer + 1;
                return retVal;
            },

            rewind: function () {
                this.pointer = 0;
            },

            valid: function () {
                return this.getPointer() < this.getCollection().length;
            },

            getPointer: function (defaultNum) {
                defaultNum = sjl.classOfIs(defaultNum, 'Number') ?
                    (isNaN(defaultNum) ? 0 : defaultNum) : 0;
                if (!context.sjl.classOfIs(this.pointer, 'Number')) {
                    this.pointer = parseInt(this.pointer, 10);
                    if (isNaN(this.pointer)) {
                        this.pointer = defaultNum;
                    }
                }
                return this.pointer;
            },

            getCollection: function () {
                return context.sjl.classOfIs(this.collection, 'Array') ? this.collection : [];
            }

        });

})(typeof window === 'undefined' ? global : window);
