/**! 
 * sjl-minimal.js Wed Nov 04 2015 20:27:30 GMT-0500 (Eastern Standard Time)
 **/
/**
 * Created by Ely on 5/29/2015.
 * @todo Make frontend only functionality defined conditionally on whether we are in a browser environment or not.
 */
(function () {

    'use strict';

    var sjl = {},
        isNodeEnv = typeof window === 'undefined',
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
     * @returns {Array}
     */
    sjl.restArgs = function (args, start, end) {
        start = typeof start === 'undefined' ? 0 : start;
        end = end || args.length;
        return slice.call(args, start, end);
    };

    /**
     * Foreach loop for arrays.
     * @function module:sjl.forEach
     * @param array {Array}
     * @param callback {Function}
     * @param context {undefined|*}
     * @returns {Array}
     */
    sjl.forEach = function (array, callback, context) {
        if ('forEach' in Array.prototype) {
            Array.prototype.forEach.call(array, callback, context);
        }
        else {
            for (var i in array) {
                if (array.hasOwnProperty(i)) {
                    i = parseInt(i, 10);
                    callback.call(context, array[i], i, array);
                }
            }
        }
        return array;
    };

    /**
     * Array indexOf method.
     * @param array Array
     * @param value
     * @returns {number}
     */
    sjl.indexOf = function (array, value) {
        if ('indexOf' in Array.prototype) {
            return Array.prototype.indexOf.call(array, value);
        }
        var classOfValue = sjl.classOf(value),
            _index = -1;
        sjl.forEach(array, function (_value, i) {
            if (sjl.classOf(_value) === classOfValue
                && _value === value) {
                _index = i;
            }
        });
        return _index;
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
                if (arguments.hasOwnProperty(i)) {
                    i = arguments[i];
                    check = isSet(i);
                    if (!check) {
                        retVal = check;
                        break;
                    }
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
        return key in obj && isSet(obj[key]);
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
            && sjl.classOfIs(obj[key], sjl.restArgs(arguments, 2));
    };

    /**
     * Returns the class name of an object from it's class string.
     * **Note** - Returns 'NaN' if type is 'Number' and isNaN as of version 0.4.85.
     * @function module:sjl.classOf
     * @param value {*}
     * @returns {string} - A string representation of the type of the value; E.g., 'Number' for `0`
     */
    sjl.classOf = function (value) {
        var retVal,
            valueType;
        if (typeof value === 'undefined') {
            retVal = 'Undefined';
        }
        else if (value === null) {
            retVal = 'Null';
        }
        else {
            valueType = Object.prototype.toString.call(value);
            retVal = valueType.substring(8, valueType.length - 1);
            if (retVal === 'Number' && isNaN(value)) {
                retVal = 'NaN';
            }
        }
        return retVal;
    };

    /**
     * Checks to see if an object is of type humanString (class name) .
     * @function module:sjl.classOfIs
     * @param obj {*} - Object to be checked.
     * @param humanString {String|Array} - Class string to check for or Array of class strings to check for.
     *  Can also just be ...rest params of class strings which will be parsed internally as an array of class strings;
     *  I.e., "Number", "Object", etc.
     * @returns {Boolean} - Whether object matches class string(s) or not.
     */
    sjl.classOfIs = function (obj, humanString) {
        // If `humanString` is of type Array then use it.  Else assume it is of type String and that there are possibly
        // more type strings passed in after it.
        var args = sjl.classOf(humanString) === 'Array' ? humanString : sjl.restArgs(arguments, 1),
            retVal = false;

        args = sjl.flattenArray(args);

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
        var retVal = obj !== true;
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
        var classOfValue = sjl.classOf(value),
            retVal;

        // If value is an array or a string
        if (classOfValue === 'Array' || classOfValue === 'String') {
            retVal = value.length === 0;
        }

        else if ((classOfValue === 'Number' && value !== 0) || (classOfValue === 'Function')) {
            retVal = false;
        }

        // If value is not number and is not equal to zero or if value is not a function
        // then check for other empty values
        else {
            retVal = (value === 0 || value === false
            || value === undefined || value === null
            || isEmptyObj(value));
        }

        return retVal;
    }

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
            shouldSetValue = !sjl.classOfIs(valueToSet, 'Undefined'),
            i;

        for (i = 0; i < parts.length; i += 1) {
            if (parts[i] in parent === false || sjl.classOfIs(parent[parts[i]], 'Undefined')) {
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
    }

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
     * @param str {String}
     * @param upperFirst {Boolean} default `false`
     * @param replaceStrRegex {RegExp} default /[^a-z0-9] * /i (without spaces before and after '*')
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
     * @param startOrEndBln {Boolean}
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
    }

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

    /**
     * Ensures passed in value is a usable number (a number which is also not NaN).
     * @function module:sjl.isUsableNumber
     * Sugar for checking for 'Number' type and that the passed in value is not NaN.
     * @param value {*}
     * @returns {Boolean|boolean}
     */
    sjl.isUsableNumber = function (value) {
        return sjl.classOfIs(value, 'Number') && !isNaN(value);
    };

    /**
     * Implodes a `Set`, `Array` or `SjlSet` passed in.
     * @function module:sjl.implode
     * @param list {Array|Set|SjlSet} - Members to join.
     * @param separator {String} - Separator to join members with.
     * @returns {string} - Imploded string.  *Returns empty string if no members, to join, are found.
     */
    sjl.implode = function (list, separator) {
        var retVal = '';
        if (sjl.classOfIs(list, 'Array')) {
            retVal = list.join(separator);
        }
        else if (list.constructor.name === 'Set' || list.constructor.name === 'SjlSet') {
            retVal = [];
            list.forEach(function (value) {
                retVal.push(value);
            });
            retVal = retVal.join(separator);
        }
        return retVal;
    };

    /**
     * Searches an object for namespace string.
     * @param ns_string {String} - Namespace string;  E.g., 'all.your.base'
     * @param objToSearch {*}
     * @returns {*} - If property chain is not found then returns `null`.
     */

    sjl.searchObj = function (ns_string, objToSearch) {
        var parts = ns_string.split('.'),
            parent = objToSearch,
            i;
        for (i = 0; i < parts.length; i += 1) {
            if (parts[i] in parent === false || sjl.classOfIs(parent[parts[i]], 'Undefined')) {
                parent = null;
                break;
            }
            parent = parent[parts[i]];
        }
        return parent;
    };

    /**
     * Used by sjl.extend definition
     * @type {Function}
     */
    var getOwnPropertyDescriptor =
            typeof Object.getOwnPropertyDescriptor === 'function'
                ? Object.getOwnPropertyDescriptor : null;

    /**
     * Checks if object has method key passed.
     * @function module:sjl.hasMethod
     * @param obj {Object|*} - Object to search on.
     * @param method - Method name to search for.
     * @returns {Boolean}
     */
    sjl.hasMethod = function (obj, method) {
        return !sjl.isEmptyObjKeyOrNotOfType(obj, method, 'Function');
    };

    /**
     * Searches obj for key and returns it's value.  If value is a function
     * calls function if `raw` is set to `false`, with optional `args`, and returns it's return value.
     * If `raw` is true returns the actual function if value found is a function.
     * @function module:sjl.getValueFromObj
     * @param key {String} The hash key to search for
     * @param obj {Object} the hash to search within
     * @param args {Array} optional the array to pass to value if it is a function
     * @param raw {Boolean} optional whether to return value even if it is a function.  Default `true`.
     * @todo allow this function to use getter function for key if it exists
     * @param noLegacyGetters {Boolean} - Default false (use legacy getters).
     *  Whether to use legacy getters to fetch the value ( get{key}() or overloaded {key}() )
     *
     * @returns {*}
     */
    sjl.getValueFromObj = function (key, obj, args, raw, noLegacyGetters) {
        // Warn user(s) of new update to this function where `raw` is not being passed in.
        //if (typeof raw === 'undefined') {
        //    console.warn('`sjl.getValueFromObj` now has it\'s `raw` parameter set to `true` by default.  ' +
        //        'This warning will be removed in the next library update.');
        //}
        args = args || null;
        raw = raw || true;
        noLegacyGetters = typeof noLegacyGetters === 'undefined' ? false : noLegacyGetters;

        // Get qualified getter function names
        var overloadedGetterFunc = sjl.camelCase(key, false),
            getterFunc = 'get' + sjl.camelCase(key, true),
            retVal = null;

        // Resolve return value
        if (key.indexOf('.') !== -1) {
            retVal = sjl.namespace(key, obj);
        }
        // If obj has a getter function for key, call it
        else if (!noLegacyGetters && sjl.hasMethod(obj, getterFunc)) {
            retVal = obj[getterFunc]();
        }
        else if (!noLegacyGetters && sjl.hasMethod(obj, overloadedGetterFunc)) {
            retVal = obj[overloadedGetterFunc]();
        }
        else if (typeof obj[key] !== 'undefined') {
            retVal = obj[key];
        }

        // Decide what to do if return value is a function
        if (sjl.classOfIs(retVal, 'Function') && sjl.empty(raw)) {
            retVal = args ? retVal.apply(obj, args) : retVal.apply(obj);
        }

        // Return result of setting value on obj, else return obj
        return retVal;
    };

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
    sjl.setValueOnObj = function (key, value, obj) {
        // Get qualified setter function name
        var overloadedSetterFunc = sjl.camelCase(key, false),
            setterFunc = 'set' + sjl.camelCase(key, true),
            retVal = obj;

        // Else set the value on the obj
        if (key.indexOf('.') !== -1) {
            retVal = sjl.namespace(key, obj, value);
        }
        // If obj has a setter function for key, call it
        else if (sjl.hasMethod(obj, setterFunc)) {
            retVal = obj[setterFunc](value);
        }
        else if (sjl.hasMethod(obj, overloadedSetterFunc)) {
            retVal = obj[overloadedSetterFunc](value);
        }
        else {
            obj[key] = typeof value !== 'undefined' ? value : null;
        }

        // Return result of setting value on obj, else return obj
        return retVal;
    };

    /**
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is overwritten.
     * This function does not handle getters and setters or copy attributes but
     * does search for setter methods in the format "setPropertyName" and uses them
     * if they are available for property `useLegacyGettersAndSetters` is set to true.
     * @param o {mixed} - *object to extend
     * @param p {mixed} - *object to extend from
     * @param deep {Boolean} - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
     * @param useLegacyGettersAndSetters {Boolean} - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
     * @returns {*} - returns o
     */
    function extend (o, p, deep, useLegacyGettersAndSetters) {
        deep = deep || false;
        useLegacyGettersAndSetters = useLegacyGettersAndSetters || false;

        var prop, propDescription,
            classOf_p_prop,
            classOf_o_prop;

        // If `o` or `p` are not set bail
        if (!sjl.isset(o) || !sjl.isset(p)) {
            return o;
        }

        for (prop in p) { // For all props in p.
            classOf_p_prop = sjl.issetObjKey(p, prop) ? sjl.classOf(p[prop]) : 'Empty';
            classOf_o_prop = sjl.issetObjKey(o, prop) ? sjl.classOf(o[prop]) : 'Empty';

            // If property is present on target (o) and is not writable, skip iteration
            if (getOwnPropertyDescriptor) {
                propDescription = getOwnPropertyDescriptor(o, prop);
                if (propDescription && !propDescription.writable) {
                    continue;
                }
            }

            if (deep) {
                if (classOf_o_prop === 'Object'
                    && classOf_p_prop === 'Object'
                    && !sjl.isEmptyObj(p[prop])) {
                    extend(o[prop], p[prop], deep);
                }
                else if (useLegacyGettersAndSetters) {
                    sjl.setValueOnObj(prop, sjl.getValueFromObj(prop, p, null, useLegacyGettersAndSetters), o);
                }
                else {
                    o[prop] = p[prop];
                }
            }

            // Else set
            else {
                o[prop] = p[prop];
            }
        }

        return o;
    }

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
     * @param [, Boolean, obj] {Object|Boolean} - If boolean, causes `extend` to perform a deep extend.  Optional.
     * @param [, obj, obj] {Object} - Objects to hierarchically extend.
     * @param [, Boolean] {Boolean} - Optional.
     * @returns {Object} - Returns first object passed in.
     */
    sjl.extend = function () {
        // Return if no arguments
        if (arguments.length === 0) {
            return;
        }

        var args = sjl.argsToArray(arguments),
            deep = sjl.extractBoolFromArrayStart(args),
            useLegacyGettersAndSetters = sjl.extractBoolFromArrayEnd(args),// Can't remove this until version 0.5 cause it may cause breaking changes in dependant projects
            arg0 = args.shift();

        // Extend object `0` with other objects
        sjl.forEach(args, function (arg) {
            // Extend `arg0` if `arg` is an object
            if (sjl.classOfIs(arg, 'Object')) {
                extend(arg0, arg, deep, useLegacyGettersAndSetters);
            }
        });

        return arg0;
    };

    /**
     * Returns copy of object.
     * @function module:sjl.clone
     * @param obj {Object}
     * @returns {*} - Cloned object.
     */
    sjl.clone = function (obj) {
        return  sjl.extend(true, {}, obj);
    };

    /**
     * Returns copy of object using JSON stringify/parse.
     * @function module:sjl.jsonClone
     * @param obj {Object} - Object to clone.
     * @returns {*} - Cloned object.
     */
    sjl.jsonClone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };

    /**
     * Creates a copy of a prototype to use for inheritance.
     * @function module:sjl.copyOfProto
     * @param proto {Prototype|Object} - Prototype to make a copy of.
     * @returns {*}
     */
    sjl.copyOfProto = function (proto) {
        if (proto === null) throw new TypeError('`copyOfProto` function expects param1 to be a non-null value.'); // proto must be a non-null object
        if (Object.create) // If Object.create() is defined...
            return Object.create(proto); // then just use it.
        var type = typeof proto; // Otherwise do some more type checking
        if (type !== 'object' && type !== 'function') throw new TypeError('`copyOfProto` function expects param1 ' +
            'to be of type "Object" or of type "Function".');
        function Func() {} // Define a dummy constructor function.
        Func.prototype = proto; // Set its prototype property to p.
        return new Func();
    };

    /**
     * Defines a class using a `superclass`, `constructor`, methods and/or static methods
     * @function module:sjl.defineSubClass
     * @param superclass {Constructor} - SuperClass's constructor.  Optional.
     * @param constructor {Constructor} -  Constructor.  Required.
     * @param methods {Object} - Optional.
     * @param statics {Object} - Static methods. Optional.
     * @returns {Constructor}
     */
    sjl.defineSubClass = function (superclass,  // Constructor of the superclass
                                   constructor, // The constructor for the new subclass
                                   methods,     // Instance methods: copied to prototype
                                   statics)     // Class properties: copied to constructor
    {
        // Resolve superclass
        superclass = superclass || sjl.copyOfProto(Object.prototype);

        // If `constructor` is a string give deprecation notice to user
        if (sjl.classOfIs(constructor, 'String')) {
            throw new Error('`sjl.defineSubClass` no longer allows a string value in the `constructor` param position.  ' +
                'This functionality is now deprecated.  Please pass in an actual constructor instead.');
        }

        // Set up the prototype object of the subclass
        constructor.prototype = sjl.copyOfProto(superclass.prototype || superclass);

        // Make the constructor extendable
        constructor.extend = function (constructor_, methods_, statics_) {
            return sjl.defineSubClass(this, constructor_, methods_, statics_);
        };

        // Define constructor's constructor
        constructor.prototype.constructor = constructor;

        // Copy the methods and statics as we would for a regular class
        if (methods) sjl.extend(constructor.prototype, methods);

        // If static functions set them
        if (statics) sjl.extend(constructor, statics);

        // Return the class
        return constructor;
    };

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
    sjl.throwNotOfTypeError = function (value, paramName, funcName, expectedType) {
        throw Error(funcName + ' expects ' + paramName +
            ' to be of type "' + expectedType + '".  Value received: ' + value);
    };

    /**
     * Makes a property non settable on `obj` and sets `value` as the returnable property.
     * @param obj {Object}
     * @param key {String}
     * @param value {*}
     */
    function makeNotSettableProp(obj, key, value) {
        (function (_obj, _key, _value) {
            Object.defineProperty(_obj, _key, {
                get: function () {
                    return _value;
                }
            });
        }(obj, key, value));
    }

    /**
     * Sets properties on obj passed in and makes those properties unsettable.
     * @param ns_string {String} - Namespace string; E.g., 'all.your.base'
     * @param objToSearch {Object}
     * @param valueToSet {*|undefined}
     * @returns {*} - Found or set value in the object to search.
     * @private
     */
    function namespace(ns_string, objToSearch, valueToSet) {
        var parts = ns_string.split('.'),
            parent = objToSearch,
            shouldSetValue = typeof valueToSet !== 'undefined',
            hasOwnProperty;

        sjl.forEach(parts, function (key, i) {
            hasOwnProperty = parent.hasOwnProperty(key);
            if (i === parts.length - 1
                && shouldSetValue && !hasOwnProperty) {
                makeNotSettableProp(parent, key, valueToSet);
            }
            else if (typeof parent[key] === 'undefined' && !hasOwnProperty) {
                makeNotSettableProp(parent, key, {});
            }
            parent = parent[key];
        });

        return parent;
    }

    /**
     * Package factory method.  Allows object to have a `package` method
     * which acts like java like namespace except it allows you to set
     * it's members (once) and then protects it's members.
     * @function module:sjl.createTopLevelPackage
     * @param obj {Object|*} - Object to set the `package` method on.
     * @return {Object|*} - Returns passed in `obj`.
     */
    sjl.createTopLevelPackage = function (obj, funcKey, altFuncKey, dirPath) {
        funcKey = funcKey || 'package';
        altFuncKey = altFuncKey || 'ns';
        if (isNodeEnv) {
            dirPath = dirPath || __dirname;
            obj[altFuncKey] = obj[funcKey] =
                require('../sjl-nodejs/Namespace.js')(dirPath);
            return obj[altFuncKey];
        }
        return (function () {

            /**
             * Returns a property from sjl packages.
             * @note If `nsString` is undefined returns the protected packages object itself.
             * @function module:sjl.package
             * @param propName {String}
             * @param value {*}
             * @returns {*}
             */
            obj[altFuncKey] =
                obj[funcKey] = function (nsString, value) {
                return typeof nsString === 'undefined' ? obj[funcKey]
                    : namespace(nsString, obj[funcKey], value);
            };

            // Return passed in obj
            return obj;
        }());
    };

    //filterWhereType: function (obj, type) {},

    /**
     * Flattens passed in array.
     * @function module:sjl.flattenArray
     * @param array {Array}
     * @returns {Array}
     */
    sjl.flattenArray = function (array) {
        var newArray = [];
        // Flatten ...humanString if length > 1
        for (var i = 0; i < array.length; i += 1) {
            if (sjl.classOf(array[i]) === 'Array') {
                newArray = sjl.flattenArray(array[i]).concat(newArray);
            }
            else {
                newArray.push(array[i]);
            }
        }
        return newArray;
    };

    //primitives: new Set('Array', 'Object', 'Boolean', 'String', 'Map', 'Set', 'WeakMap', 'Function'),

    /**
     * Creates a new primitive based on passed in string representation of type.  E.g., sjl.newPrimitive('Map')
     * @note Used internally when needing to flatten an object of a particular type (@see sjl.flatten)
     * @param type
     */
    //sjl.newPrimitive = function (type) {
    //    var retVal = {};
    //    switch(type) {
    //        case 'Array':
    //            retVal = [];
    //            break;
    //        case 'String':
    //            retVal = '';
    //            break;
    //        case 'Map':
    //            retVal = new Map();
    //            break;
    //        case 'Set':
    //            retVal = new Set();
    //            break;
    //        case 'WeakMap':
    //            retVal = new WeakMap();
    //            break;
    //        case 'Function':
    //            retVal = function () {};
    //            break;
    //        case 'Object':
    //        default:
    //            retVal = {};
    //            break;
    //    }
    //};

    // Ensure we have access to the `Symbol`
    if (typeof Symbol === 'undefined') {
        sjl.Symbol = {
            iterator: '@@iterator'
        };
    }
    else {
        sjl.Symbol = Symbol;
    }

    // If nodejs environment export `sjl`
    if (isNodeEnv) {
        module.exports = sjl;
    }

    // Export sjl globally (the node global export will be deprecated at a later version)
    Object.defineProperty(isNodeEnv ? global : window, 'sjl', {
        value: sjl
    });

    // Create top level frontend package
    sjl.createTopLevelPackage(sjl, 'package', 'ns', __dirname);

}());
