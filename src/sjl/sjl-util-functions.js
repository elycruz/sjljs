/**
 * Created by Ely on 5/24/2014.
 * Defines argsToArray, classOfIs, classOf, empty,
 *  isset, keys, and namespace, on the passed in context.
 */

'use strict';

(function (context) {

    var sjl = context.sjl,
        slice = Array.prototype.slice;

    /**
     * Calls Array.prototype.slice on arguments object passed in.
     * @function module:sjl.argsToArray
     * @param args {Arguments}
     * @returns {Array}
     */
    sjl.argsToArray = function (args) {
        return slice.call(args, 0, args.length);
    };

    /**
     * Slices passed in arguments object (not own arguments object) into array from `start` to `end`.
     * @function module:sjl.restArgs
     * @param args {Arguments|Array}
     * @param start {Number|undefined} - Optional.  Default `0`.
     * @param end {Number|undefined} - Optional.  Default `args.length`.
     * @returns {Array.<T>}
     */
    sjl.restArgs = function (args, start, end) {
        start = typeof start === 'undefined' ? 0 : start;
        end = end || args.length;
        return slice.call(args, start, end);
    };

    /**
     * Checks to see if value is set (not null and not undefined).
     * @param value
     * @returns {Boolean}
     */
    function isSet (value) {
        return (value !== undefined && value !== null);
    }

    /**
     * Checks to see if any of the arguments passed in are
     * set (not undefined and not null).
     * Returns false on the first argument encountered that
     * is null or undefined.
     * @function module:sjl.isset
     * @returns {Boolean}
     */
    sjl.isset = function () {
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
     * Checks whether a value isset and of one of the types passed in (**note the `type` params is actually `...type`)
     * @function module:sjl.issetAndOfType
     * @param value {*} - Value to check on.
     * @param type {String} - One or more type strings to match for
     * @returns {Boolean}
     */
    sjl.issetAndOfType = function (value, type) {
        // If `type` is of type array then use it else assume type is a string and possibly more
        // type strings are passed in after it.
        var args = sjl.classOfIs(type, 'Array') ? type : sjl.restArgs(arguments, 1);
        return isSet(value) && sjl.classOfIs(value, args);
    };

    /**
     * Checks whether a key on an object is set.
     * @function module:sjl.issetObjKey
     * @param obj {Object} - Object to search on.
     * @param key {String} - Key to search on `obj`.
     * @returns {Boolean}
     */
    sjl.issetObjKey = function (obj, key) {
        return obj.hasOwnProperty(key) && isSet(obj[key]);
    };

    /**
     * Checks whether an object's key is set and is of type (...type one of the types passed in)
     * @function module:sjl.issetObjKeyAndOfType
     * @param obj {Object}
     * @param key {String}
     * @param type {String|Array} - Optional.
     * @returns {Boolean}
     */
    sjl.issetObjKeyAndOfType = function (obj, key, type) {
        return sjl.issetObjKey(obj, key)
            && sjl.issetAndOfType.apply(sjl, [obj[key]].concat(sjl.restArgs(arguments, 2)));
    };

    /**
     * Returns the class name of an object from it's class string.
     * @function module:sjl.classOf
     * @param val {mixed}
     * @returns {string}
     */
    sjl.classOf = function (value) {
        var retVal;
        if (typeof value === 'undefined') {
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

    /**
     * Checks to see if an object is of type humanString (class name) .
     * @function module:sjl.classOfIs
     * @param obj {*} - Object to be checked.
     * @param humanString {String} - Class string to check for; I.e., "Number", "Object", etc.
     * @param ...rest {String} - Same as `humanString`.  Optional.
     * @returns {Boolean} - Whether object matches class string(s) or not.
     */
    sjl.classOfIs = function (obj, humanString) {
        // If `humanString` is of type Array then use it.  Else assume it is of type String and that there are possibly
        // more type strings passed in after it.
        var args = sjl.classOf(humanString) === 'Array' ? humanString : sjl.restArgs(arguments, 1),
            retVal = false;
        for (var i = 0; i < args.length; i += 1) {
            humanString = args[i];
            retVal = sjl.classOf(obj) === humanString;
            if (retVal) {
                break;
            }
        }
        return retVal;
    };

    /**
     * Checks object's own properties to see if it is empty.
     * @param obj object to be checked
     * @returns {Boolean}
     */
    function isEmptyObj (obj) {
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
     * @returns {Boolean}
     */
    function isEmptyValue (value) {
        var retVal;

        // If value is an array or a string
        if (sjl.classOfIs(value, 'Array', 'String')) {
            retVal = value.length === 0;
        }

        // If value is a number and is not 0
        else if (sjl.classOfIs(value, 'Number') && value !== 0) {
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
     * @todo change this to isempty for later version of lib.
     * @returns {Boolean}
     */
    sjl.empty = function () {
        var retVal, check,
            i, item,
            args = arguments;

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
     * Checks object's own properties to see if it is empty.
     * @param obj object to be checked
     * @returns {Boolean}
     */
    sjl.isEmptyObj = isEmptyObj;

    /**
     * Retruns a boolean based on whether a key on an object has an empty value or is empty (not set, undefined, null)
     * @function module:sjl.isEmptyObjKeyOrNotOfType
     * @param obj {Object} - Object to search on.
     * @param key {String} - Key to search for one `obj`.
     * @param type {String} - Optional. {...type} one or more types to search on.
     * @returns {Boolean}
     */
    sjl.isEmptyObjKeyOrNotOfType = function (obj, key, type) {
        var issetObjKey = arguments.length > 2
            ? sjl.issetObjKeyAndOfType.apply(sjl, arguments) : sjl.issetObjKey(obj, key);
        return !issetObjKey || sjl.empty(obj[key]);
    };

    /**
     * Retruns a boolean based on whether a key on an object has an empty value or is empty (not set, undefined, null)
     * @function module:sjl.isEmptyObjKey
     * @param obj {Object} - Object to search on.
     * @param key {String} - Key to search for one `obj`.
     * @param type {String} - Optional. {...type} one or more types to search on.
     * @note Use sjl.isEmptyObjKeyOrNotOfType when you need to ensure the type as well.  Do not use the type checking
     *  facility in this function as that functionality will be removed in a later version.
     * @returns {Boolean}
     */
    sjl.isEmptyObjKey = sjl.isEmptyObjKeyOrNotOfType;

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
    sjl.namespace = function (ns_string, objToSearch, valueToSet) {
        var parts = ns_string.split('.'),
            parent = objToSearch,
            shouldSetValue = sjl.classOfIs(valueToSet, 'Undefined')
                ? false : true,
            i;

        for (i = 0; i < parts.length; i += 1) {
            if (sjl.classOfIs(parent[parts[i]], 'Undefined')) {
                parent[parts[i]] = {};
            }
            if (i === parts.length - 1 && shouldSetValue) {
                parent[parts[i]] = valueToSet;
            }
            parent = parent[parts[i]];
        }

        return parent;
    };

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
        if (!sjl.classOfIs(str, 'String')) {
            throw new TypeError(thisFuncsName + ' expects parameter 1 ' +
                'to be of type "String".  ' +
                'Value received: "' + sjl.classOf(str) + '".');
        }

        // Search for first alpha char
        search = str.search(/[a-z]/i);

        // If alpha char
        if (sjl.classOfIs(search, 'Number') && search > -1) {

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

    /**
     * Lower cases first character of a string.
     * @function module:sjl.lcaseFirst
     * @param {String} str
     * @throws {TypeError}
     * @returns {String}
     */
    sjl.lcaseFirst = function (str) {
        return changeCaseOfFirstChar (str, 'toLowerCase', 'lcaseFirst');
    };

    /**
     * Upper cases first character of a string.
     * @function module:sjl.ucaseFirst
     * @param {String} str
     * @returns {String}
     */
    sjl.ucaseFirst = function (str) {
        return changeCaseOfFirstChar (str, 'toUpperCase', 'ucaseFirst');
    };

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
    sjl.camelCase = function (str, upperFirst, replaceStrRegex) {
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
                newStr += sjl.ucaseFirst(parts[i]);
            }
        }

        // If should not be upper case first
        if (!upperFirst) {
            // Then lower case first
            newStr = sjl.lcaseFirst(newStr);
        }

        return newStr;
    };

    /**
     * Extracts a boolean from the beginning or ending of an array depending on startOrEndBln.
     * @todo ** Note ** Closure within this function is temporary and should be removed.
     * @param array {Array}
     * @param startOrEnd {Boolean}
     * @returns {Boolean}
     */
    function extractBoolFromArray (array, startOrEndBln) {
        var expectedBool = startOrEndBln ? array[0] : array[array.length - 1],
            retVal = false;
        if (sjl.classOfIs(expectedBool, 'Boolean')) {
            retVal = startOrEndBln ? array.shift() : array.pop();
        }
        else if (sjl.classOfIs(expectedBool, 'Undefined')) {
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

    /**
     * Returns boolean from beginning of array if any.  If item at beginning of array is undefined returns `false`.
     * @function module:sjl.extractBoolFromArrayStart
     * @param array {Array}
     * @returns {Boolean}
     */
    sjl.extractBoolFromArrayStart = function (array) {
        return extractBoolFromArray(array, true);
    };

    /**
     * Returns boolean from beginning of array if any.  If item at beginning of array is undefined returns `false`.
     * @function module:sjl.extractBoolFromArrayEnd
     * @param array {Array}
     * @returns {Boolean}
     */
    sjl.extractBoolFromArrayEnd = function (array) {
        return extractBoolFromArray(array, false);
    };

})(typeof window === 'undefined' ? global : window);
