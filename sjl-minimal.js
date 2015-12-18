/**! 
 * sjl-minimal.js Thu Dec 17 2015 21:56:14 GMT-0500 (Eastern Standard Time)
 **/
/**
 * Created by Ely on 5/29/2015.
 * @todo add extract value from array if of type (only extract at array start or end)
 * @todo Ensure that all methods in library classes return a value ({self|*}) (makes for a more functional library).
 * @todo Cleanup jsdocs and make them more readable where possible (some of the jsdoc definitions in sjljs's source files are old and need to be written using es5 and es6 kind of language to make them more readable to the user (also since most of the functionality is es5/es6ish makes sense to perform this upgrade).
 */
(function (undefined) {

    'use strict';

    var sjl = {},
        _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        slice = Array.prototype.slice,
        globalContext = isNodeEnv ? global : window,
        libSrcRootPath = null;

    // Check if amd is being used (store this check globally to reduce
    //  boilerplate code in other components).
    globalContext.__isAmd = typeof define === 'function' && define.amd,

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
        start = typeof start === _undefined ? 0 : start;
        end = end || args.length;
        return slice.call(args, start, end);
    };

    /**
     * Extracts a value at an `index` of passed in array (alternately only extract the value if it is of `type`).
     * Returns an array with two elements: Element `1` contains the extracted value and element `2` the resulting
     * array of the extraction (copy of original array with extracted element) of the value at `index`.
     * @param array {Array} - Array to operate on.
     * @param index {Number} - Index of element to look for in `array`.
     * @param type {String} - Optional.
     * @returns {Array<*,Array>|Null} - If passed in array has an element at `index` (and alternately) element
     *  matches `type` then returns an array with found index and resulting array of extraction of said value.
     *  Else returns `null`.
     * @todo Add readme entry for this function (`extractFromArrayAt`).
     */
    sjl.extractFromArrayAt = function (array, index, type, makeCopyOfArray) {
        var retVal = null,
            matchesType, foundElement, copyOfArray;
        makeCopyOfArray = sjl.classOfIs(makeCopyOfArray, 'Boolean') ? makeCopyOfArray : true;
        if (array.hasOwnProperty(index + '')) {
            if (makeCopyOfArray) {
                array = array.concat([]);
            }
            foundElement = array[index];
            matchesType = sjl.isset(type) ? sjl.classOfIs(foundElement, type) : true;
            foundElement = array.splice(index, 1);
            if (matchesType) {
                retVal = [foundElement, array];
            }
        }
        return retVal;
    };

    /**
     * Checks to see if value passed in is set (not undefined and not null).
     * @function module:sjl.isset
     * @returns {Boolean}
     */
    sjl.isset = function (value) {
        return typeof value !== _undefined && value !== null;
    };

    /**
     * Checks whether a value isset and if it's type is the same as the type name passed in.
     * @function module:sjl.issetAndOfType
     * @param value {*} - Value to check on.
     * @param type {String} - Type name to check for;  E.g., 'Number', 'Array', 'HTMLMediaElement' etc.
     * @returns {Boolean}
     */
    sjl.issetAndOfType = function (value, type) {
        return sjl.isset(value) && sjl.classOfIs(value, type);
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
        if (typeof value === _undefined) {
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
     * Checks to see if an object is of type 'constructor name'.
     * Note: If passing in constructors as your `type` to check, ensure they are *'named' constructors
     * as the `name` property is checked directly on them to use in the class/constructor-name comparison.
     * *'named' constructors - Not anonymous functions/constructors but ones having a name:  E.g.,
     * ```
     * (function Hello () {}) // Named function.
     * (function () {}) // Anonymous function.
     * ```
     * @function module:sjl.classOfIs
     * @param obj {*} - Object to be checked.
     * @param type {String|Function} - Either a constructor name or an constructor itself.
     * @returns {Boolean} - Whether object matches class string or not.
     * @note For devs developing the library or reviewing this source file:  Excuse the nested ternary operators!
     * They are too succinct to replace with var declarations and if,else statements :(::: hahaha!
     * Code cleanliness at it's finest!!!  Hahaha!!
     */
    sjl.classOfIs = function (obj, type) {
        return sjl.classOf(obj) === (
                sjl.classOf(type) === String.name ? type : (
                    type instanceof Function ? type.name : null
                )
            );
    };

    /**
     * Checks object's own properties to see if it is empty.
     * @param obj object to be checked
     * @returns {Boolean}
     */
    function isEmptyObj (obj) {
        return Object.keys(obj).length === 0;
    }

    /**
     * Checks to see if value is empty (objects, arrays,
     * strings etc.).
     * @param value
     * @returns {Boolean}
     */
    function isEmpty (value) {
        var classOfValue = sjl.classOf(value),
            retVal;

        // If value is an array or a string
        if (classOfValue === 'Array' || classOfValue === 'String') {
            retVal = value.length === 0;
        }

        else if ((classOfValue === 'Number' && value !== 0) || (classOfValue === 'Function')) {
            retVal = false;
        }

        else if (classOfValue === 'Object') {
            retVal = isEmptyObj(value);
        }

        // If value is `0`, `false`, or is not set (!isset) then `value` is empty.
        else {
            retVal = !sjl.isset(value) || value === 0 || value === false;
        }

        return retVal;
    }

    /**
     * Checks to see if any of the arguments passed in are empty.
     * @function module:sjl.empty
     * @param value {*} - Value to check.
     * @todo change this to isempty for later version of lib.
     * @returns {Boolean}
     */
    sjl.empty = function (value) {
        return isEmpty(value);
    };

    /**
     * Checks object's own properties to see if it is empty (Object.keys check).
     * @param obj object to be checked
     * @returns {Boolean}
     */
    sjl.isEmptyObj = isEmptyObj;

    /**
     * Retruns a boolean based on whether a key on an object has an empty value or is empty (not set, undefined, null)
     * @function module:sjl.isEmptyOrNotOfType
     * @param obj {Object} - Object to search on.
     * @param type {String} - Optional. Type Name to check for match for;  E.g., 'Number', 'Array', 'HTMLMediaElement' etc..
     * @returns {Boolean}
     */
    sjl.isEmptyOrNotOfType = function (value, type) {
        return isEmpty(value) || sjl.isset(type) ? !sjl.classOfIs(value, type) : false;
    };

    /**
     * Frees references for value and removes the property from `obj` if no references are found and if obj[propName] is configurable.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete  - Read the 'Examples' section.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty - Read description for `configurable`.
     * @param obj {*}
     * @param propName {String}
     * @returns {Boolean} - Whether deletion occurred or not (will always return true if obj[propName] is configurable.
     * @note If obj[propName] is not configurable obj[propName] isn't de-referenced and `propName` isn't deleted from `obj`.  Look at (@see)s above.
     */
    sjl.unset = function (obj, propName) {
        obj[propName] = undefined;
        return delete obj[propName];
    };

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
        sjl.throwTypeErrorIfNotOfType(thisFuncsName, 'str', str, 'String');

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
        else if (sjl.classOfIs(expectedBool, 'undefined')) {
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
     * Checks if object has method key passed.
     * @function module:sjl.hasMethod
     * @param obj {Object|*} - Object to search on.
     * @param method - Method name to search for.
     * @returns {Boolean}
     */
    sjl.hasMethod = function (obj, method) {
        return !sjl.isEmptyOrNotOfType(obj[method], 'Function');
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
     * @param noLegacyGetters {Boolean} - Default false (use legacy getters).
     *  Whether to use legacy getters to fetch the value ( get{key}() or overloaded {key}() )
     *
     * @returns {*}
     */
    sjl.getValueFromObj = function (key, obj, args, raw, noLegacyGetters) {
        args = args || null;
        raw = raw || true;
        noLegacyGetters = typeof noLegacyGetters === _undefined ? false : noLegacyGetters;

        // Get qualified getter function names
        var overloadedGetterFunc = sjl.camelCase(key, false),
            getterFunc = 'get' + sjl.camelCase(key, true),
            retVal = null;

        // Resolve return value
        if (key.indexOf('.') !== -1) {
            retVal = sjl.searchObj(key, obj);
        }
        // If obj has a getter function for key, call it
        else if (!noLegacyGetters && sjl.hasMethod(obj, getterFunc)) {
            retVal = obj[getterFunc]();
        }
        else if (!noLegacyGetters && sjl.hasMethod(obj, overloadedGetterFunc)) {
            retVal = obj[overloadedGetterFunc]();
        }
        else if (typeof obj[key] !== _undefined) {
            retVal = obj[key];
        }

        // Decide what to do if return value is a function
        if (sjl.classOfIs(retVal, 'Function') && isEmpty(raw)) {
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
            obj[key] = typeof value !== _undefined ? value : null;
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
     * @param o {*} - *object to extend
     * @param p {*} - *object to extend from
     * @param deep {Boolean} - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
     * @param useLegacyGettersAndSetters {Boolean} - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
     * @returns {*} - returns o
     */
    function extend (o, p, deep, useLegacyGettersAndSetters) {
        deep = deep || false;
        useLegacyGettersAndSetters = useLegacyGettersAndSetters || false;

        var propDescription;

        // If `o` or `p` are not set bail
        if (!sjl.isset(o) || !sjl.isset(p)) {
            return o;
        }

        Object.keys(p).forEach(function (prop) { // For all props in p.
            // If property is present on target (o) and is not writable, skip iteration
            var propDescription = Object.getOwnPropertyDescriptor(o, prop);
            if (propDescription && !propDescription.writable) {
                return;
            }

            if (deep) {
                if (sjl.classOfIs(p[prop], Object)
                    && sjl.classOfIs(o[prop], Object)
                    && !sjl.isEmptyObj(p[prop])) {
                    extend(o[prop], p[prop], deep);
                }
                else if (useLegacyGettersAndSetters) {
                    sjl.setValueOnObj(prop,
                        sjl.getValueFromObj(prop, p, null, useLegacyGettersAndSetters),
                        o);
                }
                else {
                    o[prop] = p[prop];
                }
            }
            else if (useLegacyGettersAndSetters) {
                sjl.setValueOnObj(prop,
                    sjl.getValueFromObj(prop, p, null, useLegacyGettersAndSetters),
                    o);
            }
            // Else set
            else {
                o[prop] = p[prop];
            }
        });

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
     * @returns {Object|null} - Returns first object passed in or null if no values were passed in.
     */
    sjl.extend = function () {
        // Return if no arguments
        if (arguments.length === 0) {
            return null;
        }

        var args = sjl.argsToArray(arguments),
            deep = sjl.extractBoolFromArrayStart(args),
            useLegacyGettersAndSetters = sjl.extractBoolFromArrayEnd(args),
            arg0 = args.shift();

        // Extend object `0` with other objects
        args.forEach(function (arg) {
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
     * A constructor to use when user doesn't supply a constructor or named constructor for constructor operations, which warns user
     * that they should use a named constructor.
     * @constructor StandInConstructor
     */
    function StandInConstructor () {
        console.warn(
            'An anonymous constructor was used!  Please ' +
            'replace it with a named constructor for best ' +
            'interoperability.'
        );
    }

    /**
     * Defines a class using a `superclass`, `constructor`, methods and/or static methods
     * @function module:sjl.defineSubClass
     * @param superclass {Function} - SuperClass's constructor.  Optional.
     * @param constructor {Function|Object} -  Constructor or Object containing 'own' constructor key and methods.
     *  Required.
     * @param methods {Object} - Optional.  @note: If the value for the `constructor` param passed in is an object
     *  then this object actually represents the `statics` hash.
     * @param statics {Object} - Static methods. Optional.  @note: If the value for `constructor` passed in is an
     *  instance object than the `statics` param isn't used internally.
     * @returns {Function}
     */
    sjl.defineSubClass = function (superclass,  // Constructor of the superclass
                                   constructor, // The constructor for the new subclass
                                   methods,     // Instance methods: copied to prototype
                                   statics)     // Class properties: copied to constructor
    {
        // Resolve superclass
        superclass = superclass || Object.create(Object.prototype);

        // If `constructor` param is an object then
        if (sjl.classOfIs(constructor, Object)) {

            // Set static methods, if any
            statics = methods;

            // Set methods
            methods = constructor;

            // Decide whether to use a stand in constructor or the user supplied one
            constructor = !( methods.constructor instanceof Function )
                ? StandInConstructor : methods.constructor;

            // Unset the constructor from the methods hash since we have a pointer to it
            sjl.unset(methods, 'constructor');
        }

        // Ensure a constructor is set
        constructor = constructor || function () {
                superclass.apply(this, arguments);
            };

        // Set up the prototype object of the subclass
        constructor.prototype = Object.create(superclass.prototype);

        // Make the constructor extendable
        Object.defineProperty(constructor, 'extend', {
            value: function (constructor_, methods_, statics_) {
                return sjl.defineSubClass(constructor, constructor_, methods_, statics_);
            },
            writable: true,
            configurable: true,
            enumerable: true
        });

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
     * Sets a property on `obj` as not `configurable` and not `writable` and allows you to set whether it is enumerable or not.
     * @param obj {Object}
     * @param key {String}
     * @param enumerable {Boolean} - Default `false`.
     * @param value {*}
     */
    function makeNotSettableProp(obj, key, value, enumerable) {
        (function (_obj, _key, _value) {
            Object.defineProperty(_obj, _key, {
                value: _value,
                enumerable: enumerable instanceof Boolean ? enumerable : false
            });
        }(obj, key, value));
    }

    /**
     * Sets properties on obj passed in and makes those properties not configurable.
     * @param ns_string {String} - Namespace string; E.g., 'all.your.base'
     * @param objToSearch {Object}
     * @param valueToSet {*|undefined}
     * @returns {*} - Found or set value in the object to search.
     * @private
     */
    function unConfigurableNamespace(ns_string, objToSearch, valueToSet) {
        var parts = ns_string.split('.'),
            parent = objToSearch,
            shouldSetValue = typeof valueToSet !== _undefined,
            hasOwnProperty;

        parts.forEach(function (key, i) {
            hasOwnProperty = parent.hasOwnProperty(key);
            if (i === parts.length - 1
                && shouldSetValue && !hasOwnProperty) {
                makeNotSettableProp(parent, key, valueToSet, true);
            }
            else if (typeof parent[key] === _undefined && !hasOwnProperty) {
                makeNotSettableProp(parent, key, {}, true);
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
     * @param funcKey {String} - Key to set package function to.  E.g., 'package'
     * @param altFuncKey {String} - Alternate (usually shorter) key to set package function to.  E.g., 'ns'
     * @param dirPath {String} - If using NodeJs only.  Optional.  Default `__dirname`.
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
                    return typeof nsString === _undefined ? obj[funcKey]
                        : unConfigurableNamespace(nsString, obj[funcKey], value);
                };

            // Return passed in obj
            return obj;
        }());
    };

    ///**
    // * Flattens passed in array.
    // * @function module:sjl.flattenArray
    // * @param array {Array}
    // * @returns {Array}
    // */
    //sjl.flattenArray = function (array) {
    //    var newArray = [];
    //    // Flatten ...humanString if length > 1
    //    for (var i = 0; i < array.length; i += 1) {
    //        if (sjl.classOf(array[i]) === 'Array') {
    //            newArray = sjl.flattenArray(array[i]).concat(newArray);
    //        }
    //        else {
    //            newArray.push(array[i]);
    //        }
    //    }
    //    return newArray;
    //};

    /**
     * Constrains a number within a set of bounds (range of two numbers) or returns the pointer if it is within bounds.
     * E.g., If pointer is less than `min` then returns `min`.  If pointer is greater than `max` returns `max`.
     * If pointer is within bounds returns `pointer`.
     * @param pointer {Number}
     * @param min {Number}
     * @param max {Number}
     * @returns {Number}
     */
    sjl.constrainPointerWithinBounds = function (pointer, min, max) {
        return pointer < min ? min : ((pointer > max) ? max : pointer);
    };

    /**
     * Wraps a pointer (number) around a bounds (range of two numbers) or returns the next valid pointer depending
     * on direction:  E.g.,
     * If pointer is less than `min` then returns `max`.  If pointer is greater than `max` returns `min`.
     * If pointer is within bounds then returns `pointer`.
     * @param pointer {Number}
     * @param min {Number}
     * @param max {Number}
     * @returns {Number}
     */
    sjl.wrapPointerWithinBounds = function (pointer, min, max) {
        return pointer > max ? min : (pointer < min ? max : pointer);
    };

    /**
     * Throws a type error if value is not of type and prepends the contextName and
     * paramName/variable-name to the message (removes type checking boilerplate where required).
     * @param contextName {String} - The context name of where this function is being called.  Prefixed to the error message.
     * @param paramName {String} - Param name of the value being passed in.
     * @param value {*} - Value to inspect.
     * @param type {String|Function} - Expected type constructor or constructor name.
     * @param fixHint {String} - A hint to user or a way to fix the error.
     * @returns {{}} - Sjl.
     */
    sjl.throwTypeErrorIfNotOfType = function (contextName, paramName, value, type, fixHint) {
        type = sjl.classOfIs(type, 'String') ? type : type.name;
        var classOfValue = sjl.classOf(value);
        if (classOfValue !== type) {
            throw new TypeError('#`' + contextName + '`.`' + paramName
                + '` is not of type "' + type + '".  ' + (fixHint || '')
                + '  Type received: "' + classOfValue);
        }
        return sjl;
    };

    // Ensure we have access to the `Symbol`
    if (typeof Symbol === _undefined) {
        sjl.Symbol = {
            iterator: '@@iterator'
        };
    }
    else {
        sjl.Symbol = Symbol;
    }

    // Node specific code
    if (isNodeEnv) {
        // Export `sjl`
        module.exports = sjl;

        // Set lib src root path to be used in node env by `sjl.package`
        libSrcRootPath = __dirname;
    }

    // Create top level frontend package
    sjl.createTopLevelPackage(sjl, 'package', 'ns', libSrcRootPath);

    // Export sjl globally g(the node global export will be deprecated at a later version)
    Object.defineProperty(globalContext, 'sjl', {
        value: sjl
    });

    // Return sjl if amd is being used
    if (!isNodeEnv && globalContext.__isAmd) {
        return sjl;
    }

}(undefined));
