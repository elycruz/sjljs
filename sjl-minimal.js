/**! 
 * sjl-minimal.js Mon Jun 15 2015 09:59:11 GMT-0400 (Eastern Daylight Time)
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
     * @param start {Number}
     * @param end {Number}
     * @param args {Arguments|Array}
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
     * @function module:sjl.issetAndOfType
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
        return !issetObjKey || sjl.empty(obj[key]) || false;
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

/**
 * Created by Ely on 5/24/2014.
 * Cartesian functions copied from "Javascript the definitive guide"
 * getValueFromObj and setValueOnObj are not from "Javascript ..."
 * @note using legacy getters and setters from within `extend` method requires a refactor
 * as it does not work with the deep option and should.
 */

'use strict';

(function (context) {

    /**
     * Used by sjl.extend definition
     * @type {Function}
     */
    var getOwnPropertyDescriptor =
            typeof Object.getOwnPropertyDescriptor === 'function'
                ? Object.getOwnPropertyDescriptor : null,
        sjl = context.sjl;

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
     * Returns whether `obj` has a getter method for key passed in.
     * Method formats searched for: getKeyName or keyName
     * @param obj {Object|*} - Object to search on.
     * @param key - Key to normalize to method name to search for.
     * @returns {Boolean}
     */
    //sjl.hasGetterMethodForKey = function (obj, key) {
    //    // Camel case and uppercase first letter
    //    key = sjl.camelCase(key, true);
    //    return sjl.hasMethod(obj, key) || sjl.hasMethod(obj, 'get' + key);
    //};

    /**
     * Returns whether `obj` has a setter method for key passed in.
     * Method formats searched for: setKeyName or keyName
     * @param obj {Object|*} - Object to search on.
     * @param key - Key to normalize to method name to search for.
     * @returns {Boolean}
     */
    //sjl.hasSetterMethodForKey = function (obj, key) {
    //    // Camel case and uppercase first letter
    //    key = sjl.camelCase(key, true);
    //    return sjl.hasMethod(obj, key) || sjl.hasMethod(obj, 'set' + key);
    //};

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
     * @param noLegacyGetters {Boolean} - Default false (use legacy getters).
     *  Whether to use legacy getters to fetch the value ( get{key}() or overloaded {key}() )
     * @returns {*}
     */
    sjl.getValueFromObj = function (key, obj, args, raw, noLegacyGetters) {
        args = args || null;
        raw = raw || false;
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
     * @returns {*} - returns o
     */
     function extend (o, p, deep) {
        deep = deep || false;

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
                else {
                    sjl.setValueOnObj(prop, sjl.getValueFromObj(prop, p, null, true), o);
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
            arg0 = args.shift(),
            arg;

        // Extend object `0` with other objects
        for (arg in args) {
            arg = args[arg];

            // Extend `arg0` if `arg` is an object
            if (sjl.classOfIs(arg, 'Object')) {
                extend(arg0, arg, deep);
            }
        }

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

//    if (typeof sjl.merge === 'undefined') {
        /**
         * Copy the enumerable properties of p to o, and return o.
         * If o and p have a property by the same name, o's property is left alone.
         * This function does not handle getters and setters or copy attributes.
         * @param o {mixed} - *object to merge to
         * @param p {mixed} - *object to merge from
         * @returns {*} - returns o
         */
//        sjl.merge = function (o, p) {
//            for (prop in p) { // For all props in p.
//                if (o.hasOwnProperty[prop]) continue; // Except those already in o.
//                o[prop] = p[prop]; // Add the property to o.
//            }
//            return o;
//        };
//    }

//    if (typeof sjl.subtract === 'undefined') {
        /**
         * For each property of p, delete the property with the same name from o.
         * Return o.
         */
//        sjl.subtract = function (o, p) {
//            for (prop in p) { // For all props in p
//                delete o[prop]; // Delete from o (deleting a
//                // nonexistent prop is harmless)
//            }
//            return o;
//        };
//    }

//    if (typeof sjl.restrict === 'undefined') {
        /**
         * Remove properties from o if there is not a property with the same name in p.
         * Return o.
         */
//        sjl.restrict = function (o, p) {
//            for (prop in o) { // For all props in o
//                if (!(prop in p)) delete o[prop]; // Delete if not in p
//            }
//            return o;
//        };
//    }

//    if (typeof sjl.union === 'undefined') {
        /**
         * Return a new object that holds the properties of both o and p.
         * If o and p have properties by the same name, the values from p are used.
         */
//        sjl.union = function (o, p, deep, useLegacyGettersAndSetters) {
//            return sjl.extend(deep, sjl.clone(o), p, useLegacyGettersAndSetters);
//        };
//    }

//    if (typeof sjl.intersection === 'undefined') {
        /**
         * Return a new object that holds only the properties of o that also appear
         * in p. This is something like the intersection of o and p, but the values of
         * the properties in p are discarded
         */
//        sjl.intersection = function (o, p) {
//            return sjl.restrict(sjl.clone(o), p);
//        };
//    }

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 5/24/2014.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

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
     * Helper function which creates a constructor using `val` as a string
     * or just returns the constructor if `val` is a constructor.
     * @param value {*} - Value to resolve to constructor.
     * @returns {*}
     * @throws {Error} - If can't resolve constructor from `value`
     */
    function resolveConstructor (value) {
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
    }

    /**
     * Defines a subclass using a `superclass`, `constructor`, methods and/or static methods
     * @function module:sjl.defineSubClass
     * @param superclass {Constructor} - SuperClass's constructor.  Required.
     * @param constructor {Constructor} -  Constructor.  Required.
     * @param methods {Object} - Optional.
     * @param statics {Object} - Static methods. Optional.
     * @returns {Constructor}
     */
    sjl.defineSubClass = function (superclass, // Constructor of the superclass
                                           constructor, // The constructor for the new subclass
                                           methods, // Instance methods: copied to prototype
                                           statics) // Class properties: copied to constructor
    {
        var _constructor = resolveConstructor(constructor);

        // Set up the prototype object of the subclass
        _constructor.prototype = sjl.copyOfProto(superclass.prototype || superclass);

        // Make the constructor extendable
        _constructor.extend = function (constructor_, methods_, statics_) {
                return sjl.defineSubClass(this, constructor_, methods_, statics_);
            };

        // Define constructor's constructor
        _constructor.prototype.constructor = constructor;

        // Copy the methods and statics as we would for a regular class
        if (methods) sjl.extend(_constructor.prototype, methods);

        // If static functions set them
        if (statics) sjl.extend(_constructor, statics);

        // Return the class
        return _constructor;
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

    var sjl = context.sjl;

    /**
     * @class sjl.Attributable
     * @extends sjl.Extendable
     * @param attributes {Object} - Attributes to set on instantiation of the Attributable.  Optional.
     * @type {void|Object|*}
     */
    sjl.Attributable = sjl.Extendable.extend(function Attributable (attributes) {
        this.attrs(attributes);
    },{

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
            switch(sjl.classOf(attrs)) {
                case 'Array':
                    retVal = self._getAttribs(attrs);
                    break;
                case 'Object':
                    sjl.extend(true, self, attrs);
                    break;
                case 'String':
                    retVal = sjl.getValueFromObj(attrs, self);
                    break;
                default:
                    sjl.extend(true, self, attrs);
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
                    ? sjl.getValueFromObj(attrib, self) : null;
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

    var sjl = context.sjl;

    /**
     * Optionable Constructor merges all objects passed in to it's `options` hash.
     * Also this class has convenience methods for querying it's `options` hash (see `get` and `set` methods.
     * @note when using this class you shouldn't have a nested `options` attribute directly within options
     * as this will cause adverse effects when getting and setting properties via the given methods.
     * @class sjl.Optionable
     * @extends sjl.Extendable
     * @type {void|sjl.Optionable}
     */
    sjl.Optionable = sjl.Extendable.extend(function Optionable(/*[, options]*/) {
            this.options = new sjl.Attributable();
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
                sjl.setValueOnObj(key, value, this.options);
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
                if (sjl.classOfIs(options, 'Object')) {
                    this.options.attrs(options);
                }
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
                return sjl.getValueFromObj(key, this.options);
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
             * @param ...options {Object} - Any number of `Object`s passed in.
             * @param useLegacyGettersAndSetters {Object|Boolean|undefined}
             * @returns {sjl.Optionable}
             */
            merge: function (options) {
                sjl.extend.apply(sjl, [true, this.options].concat(sjl.argsToArray(arguments)));
                return this;
            }

        });

})(typeof window === 'undefined' ? global : window);

/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    /**
     * @class sjl.Iterator
     * @extends sjl.Extendable
     * @type {void|Object|*}
     */
    sjl.Iterator = sjl.Extendable.extend(
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
                if (!sjl.classOfIs(this.pointer, 'Number')) {
                    this.pointer = parseInt(this.pointer, 10);
                    if (isNaN(this.pointer)) {
                        this.pointer = defaultNum;
                    }
                }
                return this.pointer;
            },

            getCollection: function () {
                return sjl.classOfIs(this.collection, 'Array') ? this.collection : [];
            }

        });

})(typeof window === 'undefined' ? global : window);
