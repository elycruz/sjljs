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
