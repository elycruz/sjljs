/**! sjljs 6.0.9
 * | License: GPL-2.0+ AND MIT
 * | md5checksum: e6215a5caa437bae09ed44b99436a8cd
 * | Built-on: Thu Aug 18 2016 18:09:18 GMT-0400 (Eastern Daylight Time)
 **//**
 * The `sjl` module definition.
 * @created by Ely on 5/29/2015.
 */
(function () {

    'use strict';

    var sjl,
        _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        slice = Array.prototype.slice,
        globalContext = isNodeEnv ? global : window,
        libSrcRootPath = null;

    // Check if amd is being used (store this check globally to reduce
    //  boilerplate code in other components).
    globalContext.__isAmd = typeof define === 'function' && define.amd;

    /**
     * Calls Array.prototype.slice on arguments object passed in.
     * @function module:sjl.argsToArray
     * @param args {Arguments}
     * @returns {Array}
     */
    function argsToArray (args) {
        return slice.call(args, 0, args.length);
    }

    /**
     * Slices passed in arguments object (not own arguments object) into array from `start` to `end`.
     * @function module:sjl.restArgs
     * @param args {Arguments|Array}
     * @param start {Number|undefined} - Optional.  Default `0`.
     * @param end {Number|undefined} - Optional.  Default `args.length`.
     * @returns {Array}
     */
    function restArgs (args, start, end) {
        start = !isNumber(start) ? 0 : start;
        end = end || args.length;
        return slice.call(args, start, end);
    }

    /**
     * Extracts a value at an `index` of passed in array (alternately only extract the value if it is of `type`).
     * Returns an array with two elements: Element `1` contains the extracted value and element `2` the resulting
     * array of the extraction (copy of original array with extracted element) of the value at `index`.
     * @function module:sjl.extractFromArrayAt
     * @param array {Array} - Array to operate on.
     * @param index {Number} - Index of element to look for in `array`.
     * @param type {String} - Optional.
     * @param makeCopyOfArray {Boolean|Undefined} - Whether to make a copy of the array or not.  Default `true`.
     * @returns {Array<*,Array>|Null} - If passed in array has an element at `index` (and alternately) element
     *  matches `type` then returns an array with found index and resulting array of extraction of said value.
     *  Else returns `null`.
     */
    function extractFromArrayAt (array, index, type, makeCopyOfArray) {
        var retVal = [null, array],
            matchesType, foundElement,
            splicedArray;
        makeCopyOfArray = isBoolean(makeCopyOfArray) ? makeCopyOfArray : true;
        if (array.hasOwnProperty(index + '')) {
            if (makeCopyOfArray) {
                array = array.concat([]);
            }
            matchesType = issetAndOfType(type, String) ? classOfIs(array[index], type) : true;
            if (matchesType) {
                splicedArray = array.splice(index, 1);
                foundElement = splicedArray.length > 0 ? splicedArray[0] : null;
                retVal = [foundElement, array];
            }
        }
        return retVal;
    }

    /**
     * Checks to see if value passed in is set (not undefined and not null).
     * @function module:sjl.isset
     * @param value {*} - Value to check.
     * @returns {Boolean}
     */
    function isset (value) {
        return typeof value !== _undefined && value !== null;
    }

    /**
     * Checks if one or more parameters are set (not null and not undefined).
     * @function module:sjl.issetMulti
     * @params {*} - One or more values to check of any type.
     * @returns {Boolean} - True if all params passed in are not null or undefined.
     */
    function issetMulti () {
        return !argsToArray(arguments).some(function (value) {
            return !isset(value);
        });
    }

    /**
     * Checks whether a value isset and if it's type is the same as the type name passed in.
     * @function module:sjl.issetAndOfType
     * @param value {*} - Value to check on.
     * @param type {String|Function} - Constructor name string or Constructor.  You can pass one or more types.
     * @returns {Boolean}
     */
    function issetAndOfType (value, type/**, type...**/) {
        return isset(value) && classOfIsMulti.apply(null, arguments);
    }

    /**
     * Returns the class name of an object from it's class string.
     * @note Returns 'NaN' if value type is 'Number' and value isNaN evaluates to true as of version 0.4.85.
     * @note If your type (constructor/class) overrides it's `toString` method use a named `toString` method to get the accurate constructor name out of `classOf`;  E.g., If you do override `toString` on your class(es) and don't set them to named functions then `sjl.classOf*` will use Object.prototype.toString to pull your classes type out.
     * @function module:sjl.classOf
     * @param value {*}
     * @returns {string} - A string representation of the type of the value; E.g., 'Number' for `0`
     */
    function classOf (value) {
        var retVal,
            valueType,
            toString;
        if (typeof value === _undefined) {
            retVal = 'Undefined';
        }
        else if (value === null) {
            retVal = 'Null';
        }
        else {
            toString = value.toString.name === 'toString' ? Object.prototype.toString : value.toString;
            valueType = toString.call(value);
            retVal = valueType.substring(8, valueType.length - 1);
            if (retVal === 'Number' && isNaN(value)) {
                retVal = 'NaN';
            }
        }
        return retVal;
    }

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
    function classOfIs (obj, type) {
        var classOfType = classOf(type);
        if (classOfType !== String.name && !(type instanceof Function)) {
            throw new TypeError('sjl.classOfIs expects it\'s `type` parameter to' +
                'be of type `String` or an instance of `Function`.  Type received: ' + classOfType + '.');
        }
        return classOf(obj) === (
                classOfType === String.name ? type : type.name
            );
    }

    /**
     * For each for array like objects.
     * @function module:sjl.forEach
     * @param arrayLike {Array|Set|SjlSet|SjlMap|Map}
     * @param callback
     * @param context
     */
    function forEach (arrayLike, callback, context) {
        var classOfArrayLike = sjl.classOf(arrayLike);
        switch (classOfArrayLike) {
            case 'Array':
            case 'Set':
            case 'SjlSet':
            case 'SjlMap':
            case 'Map':
                arrayLike.forEach(callback, context);
            break;
            case 'Object':
                forEachInObj(arrayLike, callback, context);
            break;
            default:
                throw new TypeError('sjl.forEach takes only ' +
                    '`Array`, `Object`, `Map`, `Set`, `SjlSet`, and `SjlMap` objects.  ' +
                    'Type passed in: `' + classOfArrayLike + '`.');
        }
    }

    /**
     * @function module:sjl.forEachInObj
     * @param obj {Object}
     * @param callback {Function}
     * @param context {undefined|Object}
     */
    function forEachInObj (obj, callback, context) {
        Object.keys(obj).forEach(function (key) {
            callback.call(context, obj[key], key, obj);
        });
    }

    /**
     * Check if `value` is of one of the passed in types.
     * @function module:sjl.classOfIsMulti
     * @param value {*}
     * @param type {Function|String} - Constructor or string.
     * @returns {boolean}
     */
    function classOfIsMulti (value, type /**[,type...] **/) {
        return (sjl.restArgs(arguments, 1)).some(function (_type) {
            return classOfIs(value, _type);
        });
    }

    /**
     * Checs if value is a valid number (also checks if isNaN so that you don't have to).
     * @function module:sjl.isNumber
     * @param value {*}
     * @returns {Boolean}
     */
    function isNumber (value) {
        return classOfIs(value, Number);
    }

    /**
     * Returns whether a value is a function or not.
     * @function module:sjl.isFunction
     * @param value {*}
     * @returns {Boolean}
     */
    function isFunction (value) {
        return classOfIs(value, Function);
    }

    /**
     * Checks if value is an array.
     * @function module:sjl.isArray
     * @param value {*}
     * @returns {boolean}
     */
    function isArray (value) {
        return Array.isArray(value);
    }

    /**
     * Checks if value is a boolean.
     * @function module:sjl.isBoolean
     * @param value {*}
     * @returns {Boolean}
     */
    function isBoolean (value) {
        return classOfIs(value, Boolean);
    }

    /**
     * Checks whether value is an object or not.
     * @function module:sjl.isObject
     * @param value
     * @returns {Boolean}
     */
    function isObject (value) {
        return classOfIs(value, Object);
    }

    /**
     * Checks whether value is a string or not.
     * @function module:sjl.isString
     * @param value {*}
     * @returns {Boolean}
     */
    function isString(value) {
        return classOfIs(value, String);
    }

    /**
     * Checks if value is undefined.
     * @function module:sjl.isUndefined
     * @param value {*}
     * @returns {Boolean}
     */
    function isUndefined (value) {
        return classOfIs(value, 'Undefined');
    }

    /**
     * Checks if value is null.
     * @function module:sjl.isNull
     * @param value {*}
     * @returns {Boolean}
     */
    function isNull (value) {
        return classOfIs(value, 'Null');
    }

    /**
     * Checks if value is a `Symbol`.
     * @function module:sjl.isSymbol
     * @param value {*}
     * @returns {Boolean}
     */
    function isSymbol (value) {
        return classOfIs(value, 'Symbol');
    }

    /**
     * Checks object's own properties to see if it is empty (Object.keys check).
     * @function module:sjl.isEmptyObj
     * @param obj object to be checked
     * @returns {Boolean}
     */
    function isEmptyObj(obj) {
        return Object.keys(obj).length === 0;
    }

    /**
     * Checks to see if passed in argument is empty.
     * @function module:sjl.empty
     * @param value {*} - Value to check.
     * @returns {Boolean}
     */
    function isEmpty(value) {
        var classOfValue = classOf(value),
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
            retVal = !isset(value) || value === 0 || value === false;
        }

        return retVal;
    }

    /**
     * Checks to see if any of the values passed in are empty (null, undefined, empty object, empty array, or empty string).
     * @function module:sjl.emptyMulti
     * @params {*} - One or more params of any type.
     * @returns {Boolean} - Returns true if any of the values passed in are empty (null, undefined, empty object, empty array, or empty string).
     */
    function emptyMulti () {
        return argsToArray(arguments).some(function (value) {
            return isEmpty(value);
        });
    }

    /**
     * Retruns a boolean based on whether a key on an object has an empty value or is empty (not set, undefined, null)
     * @function module:sjl.isEmptyOrNotOfType
     * @param value {Object} - Object to search on.
     * @param type {String} - Optional. Type Name to check for match for;  E.g., 'Number', 'Array', 'HTMLMediaElement' etc..
     * @deprecated - Will be removed in version 6.0.0.  Use `notEmptyAndOfType` instead.
     * @returns {Boolean}
     */
    function isEmptyOrNotOfType (value, type) {
        return isEmpty(value) || !classOfIsMulti.apply(null, arguments);
    }

    /**
     * Returns true if an element is not empty and is of type.
     * @function module:sjl.notEmptyAndOfType
     * @param value {*} - Value to check.
     * @param type {String|Function} - Type to check against (string name or actual constructor).
     * @returns {Boolean}
     */
    function notEmptyAndOfType (value, type) {
        return !isEmpty(value) && classOfIsMulti.apply(null, arguments);
    }

    /**
     * Frees references for value and removes the property from `obj` if no references are found and if obj[propName] is configurable.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete  - Read the 'Examples' section.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty - Read description for `configurable`.
     * @function module:sjl.unset
     * @param obj {*}
     * @param propName {String}
     * @returns {Boolean} - Whether deletion occurred or not (will always return true if obj[propName] is configurable.
     * @note If obj[propName] is not configurable obj[propName] isn't de-referenced and `propName` isn't deleted from `obj`.  Look at (@see)s above.
     */
    function unset (obj, propName) {
        obj[propName] = undefined;
        return delete obj[propName];
    }

    /**
     * Takes a namespace string and fetches that location out from
     * an object/Map.  If the namespace doesn't exists it is created then
     * returned.  Also allows you to set a value at that namespace (last parameter).
     * @example
     * // will create/fetch within `obj`: hello: { world: { how: { are: { you: { doing: {} } } } } }
     * autoNamespace ('hello.world.how.are.you.doing', obj)
     *
     * @example
     * // Will set 'hello.what.is.your.name' to 'juan'
     * autoNamespace ('hello.what.is.your.name', obj, 'juan')
     *
     * @function module:sjl.autoNamespace
     * @param ns_string {String} - The namespace you wish to fetch
     * @param objToSearch {Object} - The object to search for namespace on
     * @param valueToSet {Object} - Optional.  A value to set on the key (last key if key string (a.b.c.d = value)).
     * @note For just checking the namespace and not creating it, use `searchObj` instead.
     * @returns {Object}
     */
    function autoNamespace (ns_string, objToSearch, valueToSet) {
        //throwTypeErrorIfNotOfType('sjl', 'autoNamespace', 'ns_string', ns_string, String);
        var parent = objToSearch,
            shouldSetValue = !isUndefined(valueToSet),
            classOfObjToSearch = classOf(objToSearch);
        if (classOfObjToSearch !== 'Object' && objToSearch instanceof Function === false) {
            throw new TypeError ('sjl.autoNamespace expects a Constructor or an instance obj to search on.' +
                'Value received: `' + classOfObjToSearch + '`.');
        }
        ns_string.split('.').forEach(function (part, index, parts) {
            if (part in parent === false || isUndefined(parent[part])) {
                parent[part] = {};
            }
            if (index === parts.length - 1 && shouldSetValue) {
                parent[part] = valueToSet;
            }
            parent = parent[part];
        });
        return parent;
    }

    /**
     * Lower cases first character of a string.
     * @function module:sjl.lcaseFirst
     * @param {String} str
     * @throws {TypeError}
     * @returns {String}
     */
    function lcaseFirst (str) {
        return changeCaseOfFirstChar(str, 'toLowerCase', 'lcaseFirst');
    }

    /**
     * Upper cases first character of a string.
     * @function module:sjl.ucaseFirst
     * @param {String} str
     * @returns {String}
     */
    function ucaseFirst (str) {
        return changeCaseOfFirstChar(str, 'toUpperCase', 'ucaseFirst');
    }

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
    function camelCase (str, upperFirst, replaceStrRegex) {
        upperFirst = upperFirst || false;
        replaceStrRegex = replaceStrRegex || /[^a-z\d]/i;
        var newStr = '',

        // Get clean string
            parts = str.split(replaceStrRegex);

        // Upper Case First char for parts
        parts.forEach(function (part) {
            // If alpha chars
            if (/[a-z\d]/.test(part)) {

                // ucase first char and append to new string,
                // if part is a digit just gets returned by `ucaseFirst`
                newStr += ucaseFirst(part);
            }
        });

        // If should not be upper case first
        if (!upperFirst) {
            // Then lower case first
            newStr = lcaseFirst(newStr);
        }

        return newStr;
    }

    /**
     * Implodes a `Set`, `Array` or `SjlSet` passed in.
     * @function module:sjl.implode
     * @param list {Array|Set|SjlSet} - Members to join.
     * @param separator {String} - Separator to join members with.
     * @returns {string} - Imploded string.  *Returns empty string if no members, to join, are found.
     */
    function implode (list, separator) {
        var retVal = '';
        if (isArray(list)) {
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
    }

    /**
     * Searches an object for namespace string.
     * @function module:sjl.searchObj
     * @param ns_string {String} - Namespace string;  E.g., 'all.your.base'
     * @param objToSearch {*}
     * @returns {*} - Found value.  If no found value returns `undefined`.
     */
    function searchObj (ns_string, objToSearch) {
        var parts = ns_string.split('.'),
            parent = objToSearch,
            classOfObj = classOf(objToSearch),
            i;
        throwTypeErrorIfNotOfType('sjl.searchObj', 'ns_string', ns_string, String);
        if (classOfObj !== 'Object' && objToSearch instanceof Function === false) {
            throw new TypeError ('sjl.searchObj expects `objToSearch` to be of type object ' +
                'or an instance of `Function`.  Type received: ' + classOfObj);
        }
        for (i = 0; i < parts.length; i += 1) {
            if (parts[i] in parent === false || isUndefined(parent[parts[i]])) {
                parent = undefined;
                break;
            }
            parent = parent[parts[i]];
        }
        return parent;
    }

    /**
     * Checks if object has method key passed.
     * @function module:sjl.hasMethod
     * @param obj {Object|*} - Object to search on.
     * @param method - Method name to search for.
     * @returns {Boolean}
     */
    function hasMethod (obj, method) {
        return notEmptyAndOfType(obj[method], 'Function');
    }

    /**
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is overwritten.
     * @param o {*} - *object to extend
     * @param p {*} - *object to extend from
     * @param deep {Boolean} - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
     * @returns {*} - returns o
     */
    function extend(o, p, deep) {
        deep = deep || false;

        // If `o` or `p` are not set bail
        if (!isset(o) || !isset(p)) {
            return o;
        }

        // Merge all props from `p` to `o`
        Object.keys(p).forEach(function (prop) { // For all props in p.
            // If property is present on target (o) and is not writable, skip iteration
            var propDescription = Object.getOwnPropertyDescriptor(o, prop);
            if (propDescription && (!isset(propDescription.get) && !isset(propDescription.set)) && !propDescription.writable) {
                return;
            }
            if (deep === true) {
                if (isObject(p[prop]) && isObject(o[prop])
                    && !isEmptyObj(p[prop])) {
                    extend(o[prop], p[prop], deep);
                }
                else {
                    o[prop] = p[prop];
                }
            }
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
     * on the receiving object.
     *
     * @example (if last param to passed in to `sjl.extend` is `true`
     *  var o = {setGreeting: v => this.greeting = 'Hello ' + v},
     *      otherObject = {greeting: 'Junior'};
     *  // Calls o.setGreeting when merging otherObject because `true` was passed in
     *  // as the last parameter
     *  sjl.extend(o, otherObject, true);
     *
     * @function module:sjl.extend
     * @arg `0`    {Object|Boolean} - If boolean, causes `extend` to perform a deep extend.  Optional.
     * @arg `1-*`  {Object} - Objects to merge on @arg 0.
     * @arg `last` {Boolean} - Optional.
     * @returns    {Object|null} - Returns first object passed in or null if no values were passed in.
     */
    function extendMulti () {
        // Return if no arguments
        if (arguments.length === 0) {
            return null;
        }
        var args = argsToArray(arguments),
            deep = extractBoolFromArrayStart(args),
            arg0 = args.shift();

        // Extend object `0` with other objects
        args.forEach(function (arg) {
            // Extend `arg0` if `arg` is an object
            if (isObject(arg)) {
                extend(arg0, arg, deep);
            }
        });

        return arg0;
    }

    /**
     * Returns copy of object.
     * @function module:sjl.clone
     * @param obj {Object}
     * @returns {*} - Cloned object.
     */
    function clone (obj) {
        return extend({}, obj, true);
    }

    /**
     * Returns copy of object using JSON stringify/parse.
     * @function module:sjl.jsonClone
     * @param obj {Object} - Object to clone.
     * @returns {*} - Cloned object.
     */
    function jsonClone (obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Generates a 'stand-in' constructor that calls `superClass` internally.
     * Used in methods that require a super class or constructor as a parameter
     * and none is given.
     * @param superClass {Function} - Super class constructor.  Required.
     * @returns {StandInConstructor}
     */
    function standInConstructor(superClass) {
        return function StandInConstructor() {
            console.warn(
                'An anonymous constructor was used!  Please ' +
                'replace it with a named constructor for best ' +
                'interoperability.'
            );
            superClass.apply(this, arguments);
        };
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
    function defineSubClass (superclass,  // Constructor of the superclass
                                   constructor, // The constructor for the new subclass
                                   methods,     // Instance methods: copied to prototype
                                   statics)     // Class properties: copied to constructor
    {

        // Statics for snatching static methods from superclass if it is a constructor
        var __statics;

        // If superclass is a Constructor snatch statics
        if (isFunction(superclass)) {
            // Set statics for snatching statics
            __statics = {};

            // Snatch each static member from `superclass` to use later
            Object.keys(superclass).forEach(function (key) {
                if (key === 'extend') { return; }
                __statics[key] = superclass[key];
            });
        }

        // Resolve superclass
        superclass = superclass || Object.create(Object.prototype);

        // If `constructor` param is an object then
        if (isObject(constructor)) {

            // Set static methods, if any
            statics = methods;

            // Set methods
            methods = constructor;

            // Decide whether to use a stand in constructor or the user supplied one
            constructor = ! isFunction(methods.constructor)
                ? standInConstructor(superclass) : methods.constructor;

            // Unset the constructor from the methods hash since we have a pointer to it
            unset(methods, 'constructor');
        }

        // Ensure a constructor is set
        constructor = isset(constructor) ? constructor : standInConstructor(superclass);

        // Set up the prototype object of the subclass
        constructor.prototype = Object.create(superclass.prototype);

        /**
         * Extends a new copy of self with passed in parameters.
         * @memberof class:sjl.stdlib.Extendable
         * @static sjl.stdlib.Extendable.extend
         * @param constructor {Function|Object} - Required.  If this param is an `Object` then the `methods` param becomes
         *  the `statics` param (as if this param is an Object then it can contain methods within itself).
         * @param methods {Object|undefined} - Methods.  Optional.
         * @param statics {Object|undefined} - Static methods.  Optional.
         */
        constructor.extend = function (constructor_, methods_, statics_) {
            return defineSubClass(constructor, constructor_, methods_, statics_);
        };

        // Define constructor's constructor
        Object.defineProperty(constructor.prototype, 'constructor', {value: constructor});

        // Copy the methods and statics as we would for a regular class
        if (methods) extend(constructor.prototype, methods, true);

        // If internally snatched static functions from `superclass` exists then set them on subclass
        if (__statics) extend(constructor, __statics, true);

        // If static functions set them
        if (statics) extend(constructor, statics, true);

        // @note To bypass this functionality just name your toString method as is being done
        //  here (with a name of your choosing or even the name used below).
        if (!methods || !methods.hasOwnProperty('toString') || methods.toString.name === 'toString') {
            constructor.prototype.toString = function toStringOverride() {
                return '[object ' + constructor.name + ']';
            };
        }

        // Return the class
        return constructor;
    }

    /**
     * Package factory method.  Allows object to have a `package` method
     * which acts like java like namespace except it allows you to set
     * it's members (once) and then protects it's members.
     * @function module:sjl.createTopLevelPackage
     * @param obj {Object|*} - Object to set the `package` method on.
     * @param funcKey {String} - Key to set package function to.  E.g., 'package'
     * @param altFuncKey {String} - Alternate (usually shorter) key to set package function to.  E.g., 'ns'
     *  ignore passed in paths as namespaces.  Optional.  Default `null`.
     * @return {Object|*} - Returns passed in `obj`.
     */
    function createTopLevelPackage (obj, funcKey, altFuncKey) {
        funcKey = funcKey || 'package';
        altFuncKey = altFuncKey || 'ns';
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

        // Return namespace function
        return obj[funcKey];
    }

    /**
     * Constrains a number within a set of bounds (range of two numbers) or returns the pointer if it is within bounds.
     * E.g., If pointer is less than `min` then returns `min`.  If pointer is greater than `max` returns `max`.
     * If pointer is within bounds returns `pointer`.
     * @function module:sjl.constrainPointer
     * @param pointer {Number}
     * @param min {Number}
     * @param max {Number}
     * @returns {Number}
     */
    function constrainPointer (pointer, min, max) {
        return pointer < min ? min : ((pointer > max) ? max : pointer);
    }

    /**
     * Wraps a pointer (number) around a bounds (range of two numbers) or returns the next valid pointer depending
     * on direction:  E.g.,
     * If pointer is less than `min` then returns `max`.  If pointer is greater than `max` returns `min`.
     * If pointer is within bounds then returns `pointer`.
     * @function module:sjl.wrapPointer
     * @param pointer {Number}
     * @param min {Number}
     * @param max {Number}
     * @returns {Number}
     */
    function wrapPointer (pointer, min, max) {
        return pointer > max ? min : (pointer < min ? max : pointer);
    }

    /**
     * Throws a type error if value is not of type and prepends the prefix and
     * paramName/variable-name to the message (removes type checking boilerplate where required).
     * @function module:sjl.throwTypeErrorIfNotOfType
     * @param prefix {String} - Context name and function name to prefix to error message if it is thrown.
     * @param paramName {String} - Param name of the value being passed in.
     * @param value {*} - Value to inspect.
     * @param type {String|Function} - Expected type constructor or constructor name.
     * @param suffix {String} - A hint to user or a way to fix the error;  Message to suffix to error message.
     * @returns {{}} - Sjl.
     */
    function throwTypeErrorIfNotOfType (prefix, paramName, value, type, suffix) {
        var classOfValue = classOf(value);

        // If `type` itself is not of the allowed types throw an error
        if (!isString(type) && !isFunction(type)) {
            throw new TypeError('`sjl.throwTypeErrorIfNotOfType` only accepts strings or constructors.  ' +
                'Type received: `' + classOf(type) + '`.');
        }

        // Proceed with type check
        if (!classOfIs(value, type)) {
            throw new TypeError('#`' + prefix + '`.`' + paramName
                + '` is not of type "' + type + '".  ' + (suffix || '')
                + '  Type received: `' + classOfValue + '`.');
        }
    }

    /**
     * Throws an error if passed in `value` is empty (0, null, undefined, false, empty {}, or empty []).
     * @function module:sjl.throwTypeErrorIfEmpty
     * @param prefix {String} - String to prefix to message.
     * @param paramName {String} - Param that expected a non empty value (hint for user).
     * @param value {*} - Value to check.
     * @param type {String|Function|undefined|null} - Type to check against.  Optional.
     * @param suffix {*} - String to append to message.
     */
    function throwTypeErrorIfEmpty (prefix, paramName, value, type, suffix) {
        var classOfValue = classOf(value),
            issetType = isset(type);

        // If `type` itself is not of the allowed types throw an error
        if (issetType && !isString(type) && !isFunction(type)) {
            throw new TypeError('`sjl.throwTypeErrorIfEmpty.type` only accepts strings, functions (constructors),' +
                'null, or undefined.  ' +
                'Type received: `' + classOf(type) + '`.');
        }

        // Proceed with type check
        if (issetType && !classOfIs(value, type)) {
            throw new TypeError('#`' + prefix + '`.`' + paramName
                + '` is not of type "' + type + '".  ' + (suffix || '')
                + '  Type received: `' + classOfValue + '`.');
        }

        // Proceed with empty check
        if (isEmpty(value)) {
            throw new TypeError('#`' + prefix + '`.`' + paramName
                + '` Cannot be empty.  ' + (suffix || '')
                + '  Value received: `' + value + '`.  '
                + '  Type received: ' + classOfValue + '`.');
        }
    }

    /**
     * Returns value if it is set and of type else returns `defaultValue`
     * @function module:sjl.valueOrDefault
     * @param value {*} - Value to pass through.
     * @param defaultValue {*} - Optional.  Value to use as default value if value is not set.  Default `null`.
     * @param type {String|Function} - Optional.  Constructor or string representation of type;  E.g., String or 'String'
     */
    function valueOrDefault (value, defaultValue, type) {
        defaultValue = typeof defaultValue === _undefined ? null : defaultValue;
        var retVal;
        if (isset(type)) {
            retVal = issetAndOfType.apply(null, [value].concat(sjl.restArgs(2))) ? value : defaultValue;
        }
        else {
            retVal = isset(value) ? value : defaultValue;
        }
        return retVal;
    }

    /**
     * Sets a property on `obj` as not `configurable` and not `writable` and allows you to set whether it is enumerable or not.
     * @function module:sjl.defineEnumProp
     * @param obj {Object}
     * @param key {String}
     * @param value {*}
     * @param enumerable {Boolean} - Default `false`.
     * @return {void}
     */
    function defineEnumProp(obj, key, value) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true
        });
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
        var parent = objToSearch,
            shouldSetValue = typeof valueToSet !== _undefined,
            hasOwnProperty;

        ns_string.split('.').forEach(function (key, i, parts) {
            hasOwnProperty = parent.hasOwnProperty(key);
            if (i === parts.length - 1
                && shouldSetValue && !hasOwnProperty) {
                defineEnumProp(parent, key, valueToSet);
            }
            else if (typeof parent[key] === _undefined && !hasOwnProperty) {
                defineEnumProp(parent, key, {});
            }
            parent = parent[key];
        });

        return parent;
    }

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
    function changeCaseOfFirstChar(str, func, thisFuncsName) {
        var search, char, right, left;

        // If typeof `str` is not of type "String" then bail
        throwTypeErrorIfNotOfType(thisFuncsName, 'str', str, 'String');

        // Search for first alpha char
        search = str.search(/[a-z]/i);

        // If alpha char
        if (isNumber(search) && search > -1) {

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
     * Extracts a boolean from the beginning or ending of an array depending on startOrEndBln.
     * @param array {Array}
     * @param startOrEndBln {Boolean}
     * @returns {Boolean}
     */
    function extractBoolFromArray(array, startOrEndBln) {
        var expectedBool = startOrEndBln ? array[0] : array[array.length - 1],
            classOfExpectedBool = classOf(expectedBool),
            retVal;
        if (classOfExpectedBool === 'Boolean') {
            retVal = startOrEndBln ? array.shift() : array.pop();
        }
        else if (classOfExpectedBool === 'Undefined') {
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
    function extractBoolFromArrayStart (array) {
        return extractBoolFromArray(array, true);
    }

    /**
     * Returns boolean from end of array if any.  If item at found there is undefined or not a boolean returns `false`.
     * @function module:sjl.extractBoolFromArrayEnd
     * @param array {Array}
     * @returns {Boolean}
     */
    function extractBoolFromArrayEnd (array) {
        return extractBoolFromArray(array, false);
    }

    /**
     * `sjl` module.
     * @module sjl {Object}
     * @type {{argsToArray: argsToArray, camelCase: camelCase, classOf: classOf, classOfIs: classOfIs, classOfIsMulti: classOfIsMulti, clone: clone, constrainPointer: constrainPointer, createTopLevelPackage: createTopLevelPackage, defineSubClass: defineSubClass, defineEnumProp: defineEnumProp, empty: isEmpty, emptyMulti: emptyMulti, extend: extendMulti, extractBoolFromArrayEnd: extractBoolFromArrayEnd, extractBoolFromArrayStart: extractBoolFromArrayStart, extractFromArrayAt: extractFromArrayAt, forEach: forEach, forEachInObj: forEachInObj, hasMethod: hasMethod, implode: implode, isset: isset, issetMulti: issetMulti, issetAndOfType: issetAndOfType, isEmpty: isEmpty, isEmptyObj: isEmptyObj, isEmptyOrNotOfType: isEmptyOrNotOfType, isArray: isArray, isBoolean: isBoolean, isFunction: isFunction, isNull: isNull, isNumber: isNumber, isObject: isObject, isString: isString, isSymbol: isSymbol, isUndefined: isUndefined, jsonClone: jsonClone, lcaseFirst: lcaseFirst, autoNamespace: autoNamespace, notEmptyAndOfType: notEmptyAndOfType, restArgs: restArgs, ucaseFirst: ucaseFirst, unset: unset, searchObj: searchObj, throwTypeErrorIfNotOfType: throwTypeErrorIfNotOfType, throwTypeErrorIfEmpty: throwTypeErrorIfEmpty, valueOrDefault: valueOrDefault, wrapPointer: wrapPointer}}
     */
    sjl = {
        argsToArray: argsToArray,
        camelCase: camelCase,
        classOf: classOf,
        classOfIs: classOfIs,
        classOfIsMulti: classOfIsMulti,
        clone: clone,
        constrainPointer: constrainPointer,
        createTopLevelPackage: createTopLevelPackage,
        defineSubClass: defineSubClass,
        defineEnumProp: defineEnumProp,
        empty: isEmpty,
        emptyMulti: emptyMulti,
        extend: extendMulti,
        extractBoolFromArrayEnd: extractBoolFromArrayEnd,
        extractBoolFromArrayStart: extractBoolFromArrayStart,
        extractFromArrayAt: extractFromArrayAt,
        forEach: forEach,
        forEachInObj: forEachInObj,
        hasMethod: hasMethod,
        implode: implode,
        isset: isset,
        issetMulti: issetMulti,
        issetAndOfType: issetAndOfType,
        isEmpty: isEmpty,
        isEmptyObj: isEmptyObj,
        isEmptyOrNotOfType: isEmptyOrNotOfType,
        isArray: isArray,
        isBoolean: isBoolean,
        isFunction: isFunction,
        isNull: isNull,
        isNumber: isNumber,
        isObject: isObject,
        isString: isString,
        isSymbol: isSymbol,
        isUndefined: isUndefined,
        jsonClone: jsonClone,
        lcaseFirst: lcaseFirst,
        autoNamespace: autoNamespace,
        notEmptyAndOfType: notEmptyAndOfType,
        restArgs: restArgs,
        ucaseFirst: ucaseFirst,
        unset: unset,
        searchObj: searchObj,
        throwTypeErrorIfNotOfType: throwTypeErrorIfNotOfType,
        throwTypeErrorIfEmpty: throwTypeErrorIfEmpty,
        valueOrDefault: valueOrDefault,
        wrapPointer: wrapPointer
    };

    // Ensure we have access to es6 `Symbol` object
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
        // Set package namespace and alias for it
        sjl.package =
            sjl.ns =
                require('./nodejs/Namespace.js')(__dirname, ['.js', '.json']);

        // Short cut to namespaces
        Object.keys(sjl.ns).forEach(function (key) {
            sjl[key] = sjl.ns[key];
        });

        // Method not needed for NodeJs environment
        sjl.unset(sjl, 'createTopLevelPackage');

        // Export `sjl`
        module.exports = sjl;
    }
    else {
        // Create top level frontend package.
        createTopLevelPackage(sjl, 'package', 'ns', libSrcRootPath);

        // Instantiate known namespaces and set them directly on `sjl` for ease of use;
        // E.g., Accessing `sjl.ns.stdlib.Extendable` now becomes `sjl.stdlib.Extendable`
        // --------------------------------------------------------------------------------

        /**
         * @namespace sjl.filter {Object}
         */
        defineEnumProp(sjl,     'filter',       sjl.ns('filter'));

        /**
         * @namespace sjl.input {Object}
         */
        defineEnumProp(sjl,     'input',        sjl.ns('input'));

        /**
         * @namespace sjl.stdlib {Object}
         */
        defineEnumProp(sjl,     'stdlib',       sjl.ns('stdlib'));

        /**
         * @namespace sjl.utils {Object}
         */
        defineEnumProp(sjl,     'utils',        sjl.ns('utils'));

        /**
         * @namespace sjl.validator {Object}
         */
        defineEnumProp(sjl,     'validator',    sjl.ns('validator'));

        // Export sjl globally
        globalContext.sjl = sjl;

        // Return sjl if amd is being used
        if (globalContext.__isAmd) {
            return sjl;
        }
    }

}());

/**
 * Created by Ely on 4/12/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Extendable = function Extendable () {};

    /**
     * The `sjl.stdlib.Extendable` constructor (a constructor that has a static `extend` method for easy extending).
     * @class sjl.stdlib.Extendable
     */
    Extendable = sjl.defineSubClass(Function, Extendable);

    // Export `Extendable`
    if (isNodeEnv) {
        module.exports = Extendable;
    }
    else {
        sjl.ns('stdlib.Extendable', Extendable);
        if (window.__isAmd) {
            return Extendable;
        }
    }

})();

/**
 * Created by elydelacruz on 4/22/16.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        contextName = 'sjl.stdlib.Config',

        /**
         * Constructor takes one or more config objects to set onto `Config`.
         * @class sjl.stdlib.Config
         * @extends sjl.stdlib.Extendable
         */
        Config = sjl.stdlib.Extendable.extend({

            constructor: function Config () {
                if (arguments.length > 0) {
                    this.set.apply(this, arguments);
                }
            },

            /**
             * Gets any value from config by key (key can be a namespace string).
             * @method sjl.stdlib.Config#get
             * @param keyOrNsKey {String}
             * @throws {TypeError} - Throws type error if keyOrNsKey is not a string.
             * @returns {*} - Found value.
             */
            get: function (keyOrNsKey) {
                sjl.throwTypeErrorIfNotOfType(contextName + '.get', 'keyOrNsKey', keyOrNsKey, String,
                    'Also `undefined` or `null` are allowed (used when wanting the object as JSON).');
                return sjl.searchObj(keyOrNsKey, this);
            },

            /**
             * Sets any value on config by key or namespace key.
             * @method sjl.stdlib.Config#set
             * @param keyOrNsKey {String}
             * @param value {*}
             * @returns {sjl.stdlib.Config} - Returns self.
             */
            set: function (keyOrNsKey, value) {
                var self = this;
                if (sjl.isObject(keyOrNsKey)) {
                    sjl.extend.apply(sjl, [true, self].concat(sjl.argsToArray(arguments)));
                }
                else if (sjl.isString(keyOrNsKey)) {
                    sjl.autoNamespace(keyOrNsKey, self, value);
                }
                else if (sjl.isset(keyOrNsKey)) {
                    throw new TypeError(contextName + '.set only allows strings or objects as it\'s first parameter.  ' +
                        'Param type received: `' + sjl.classOf(keyOrNsKey) + '`.');
                }
                return self;
            },

            /**
             * Checks if a defined value exists for key (or namespace key) and returns it.
             * If no value is found (key/ns-key is undefined) then returns undefined.
             * @method sjl.stdlib.Config#has
             * @param keyOrNsString {String}
             * @returns {*|undefined}
             */
            has: function (keyOrNsString/*, type{String|Function}...*/) {
                sjl.throwTypeErrorIfNotOfType(contextName + '.has', 'keyOrNsString', keyOrNsString, String);
                var searchResult = sjl.searchObj(keyOrNsString, this);
                return arguments.length === 1 ?
                    sjl.isset(searchResult) :
                    sjl.issetAndOfType.apply(sjl, [searchResult].concat(sjl.restArgs(1)));
            },

            /**
             * toJSON of its own properties or properties found at key/key-namespace-string.
             * @param keyOrNsString {String} - Optional.
             * @returns {JSON}
             */
            toJSON: function (keyOrNsString) {
                return sjl.jsonClone(
                    sjl.notEmptyAndOfType(keyOrNsString, String) ?
                       sjl.searchObj(keyOrNsString, this) : this
                );
            }
        });

    if (isNodeEnv) {
        module.exports = Config;
    }
    else {
        sjl.ns('stdlib.Config', Config);
        if (window.__isAmd) {
            return Config;
        }
    }

}());

/**
 * Created by Ely on 7/21/2014.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Optionable = function Optionable(/*[, options]*/) {
            var arg0 = arguments[0],
                _optionsKeyname = '_options';

            // If options key name is set set it
            if (sjl.isObject(arg0) && sjl.issetAndOfType(arg0.optionsKeyName, String)) {
                _optionsKeyname = arg0.optionsKeyName + '';
                sjl.unset(arg0, 'optionsKeyName');
            }

            // Define options key name property
            Object.defineProperty(this, 'optionsKeyName', {
                value: _optionsKeyname,
                enumerable: true
            });

            // Define options key name property
            Object.defineProperty(this, this.optionsKeyName, {
                value: new sjl.stdlib.Config(),
                enumerable: true
            });

            // Merge all options in to options store
            if (arguments.length > 0) {
                this.set.apply(this, arguments);
            }
        };

    /**
     * Optionable Constructor merges all objects passed in to it's `options` hash.
     * Also this class has convenience methods for querying it's `options` hash (see `get` and `set` methods.
     * @note when using this class you shouldn't have a nested `options` attribute directly within options
     * as this will cause adverse effects when getting and setting properties via the given methods.
     * @class sjl.stdlib.Optionable
     * @extends sjl.stdlib.Extendable
     * @type {void|sjl.stdlib.Optionable}
     */
    Optionable = sjl.stdlib.Extendable.extend(Optionable, {
        /**
         * Gets one or many option values.
         * @method sjl.stdlib.Optionable#get
         * @param keyOrArray
         * @returns {*}
         */
        get: function (keyOrArray) {
            return this.getStoreHash().get(keyOrArray);
        },

        /**
         * Sets an option (key, value) or multiple options (Object)
         * based on what's passed in.
         * @method sjl.stdlib.Optionable#set
         * @param0 {String|Object}
         * @param1 {*} - One or more objects to merge in if `param0` is an `Object`.  Else it is the value you want
         * to set the `param0` key to;  E.g., optionable.set('someKey', 'some-value-here');.
         * @returns {sjl.stdlib.Optionable}
         */
        set: function () {
            var options = this.getStoreHash();
            options.set.apply(options, arguments);
            return this;
        },

        /**
         * Checks a key/namespace string ('a.b.c') to see if `this.options`
         *  has a value (a non falsy value otherwise returns `false`).
         * @method sjl.stdlib.Optionable#has
         * @param nsString - key or namespace string
         * @returns {Boolean}
         */
        has: function (nsString) {
            return this.getStoreHash().has(nsString);
        },

        getStoreHash: function () {
            return this[this.optionsKeyName];
        }

    });

    if (isNodeEnv) {
        module.exports = Optionable;
    }
    else {
        sjl.ns('stdlib.Optionable', Optionable);
        if (window.__isAmd) {
            return Optionable;
        }
    }

})();

/**
 * Created by Ely on 4/12/2014.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        errorContextName = 'sjl.stdlib.Iterator',

        Iterator = function Iterator(values) {
            var _values,
                _pointer = 0;

            /**
             * Public property docs
             *----------------------------------------------------- */
            /**
             * Iterator values.
             * @name values
             * @member {Array<*>} sjl.stdlib.Iterator#values
             */
            /**
             * Iterator pointer.
             * @name pointer
             * @member {Number} sjl.stdlib.Iterator#pointer
             */
            /**
             * Iterator size.
             * @name size
             * @readonly
             * @member {Number} sjl.stdlib.Iterator#size
             */

            // Define properties before setting values
            Object.defineProperties(this, {
                values: {
                    get: function () {
                        return _values;
                    },
                    set: function (values) {
                        sjl.throwTypeErrorIfNotOfType(errorContextName, 'values', values, Array);
                        _values = values;
                        this.pointer = _pointer; // Force pointer within bounds (if it is out of bounds)
                    }
                },
               pointer: {
                    get: function () {
                        return _pointer;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(errorContextName, 'pointer', value, Number);
                        _pointer = sjl.constrainPointer(value, 0, _values.length);
                    }
                },
                size: {
                    get: function () {
                        return _values.length;
                    }
                }
            }); // End of `defineProperties`

            // Set values
            this.values = values || [];
        };

    /**
     * Es6 compliant iterator constructor with some convenience methods;  I.e.,
     *  `valid`, `rewind`, `current`, and `forEach`.
     * @class sjl.stdlib.Iterator
     * @extends sjl.stdlib.Extendable
     * @param values {Array} - Values to iterate through.
     */
    Iterator = sjl.stdlib.Extendable.extend(Iterator, {

        /**
         * Returns the current value that `pointer` is pointing to.
         * @method sjl.stdlib.Iterator#current
         * @returns {{done: boolean, value: *}}
         */
        current: function () {
            var self = this;
            return self.valid() ? {
                done: false,
                value: self.values[self.pointer]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.stdlib.Iterator#next
         * @returns {{done: boolean, value: *}}
         */
        next: function () {
            var self = this,
                pointer = self.pointer,
                retVal = self.valid() ? {
                    done: false,
                    value: self.values[pointer]
                } : {
                    done: true
                };
            self.pointer += 1;
            return retVal;
        },

        /**
         * Rewinds the iterator.
         * @method sjl.stdlib.Iterator#rewind
         * @returns {sjl.stdlib.Iterator}
         */
        rewind: function () {
            this.pointer = 0;
            return this;
        },

        /**
         * Returns whether the iterator has reached it's end.
         * @method sjl.stdlib.Iterator#valid
         * @returns {boolean}
         */
        valid: function () {
            return this.pointer < this.values.length;
        },

        /**
         * Iterates through all elements in iterator.
         * @param callback {Function}
         * @param context {Object}
         * @returns {sjl.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            context = context || this;
            this.values.forEach(callback, context);
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = Iterator;
    }
    else {
        sjl.ns('stdlib.Iterator', Iterator);
        if (window.__isAmd) {
            return sjl.stdlib.Iterator;
        }
    }

}());

/**
 * Created by elydelacruz on 11/2/15.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Iterator = sjl.stdlib.Iterator,
        moduleName = 'ObjectIterator',
        contextName = 'sjl.stdlib.' + moduleName,

    /**
     * @class sjl.stdlib.ObjectIterator
     * @extends sjl.stdlib.Iterator
     * @param keysOrObj {Array|Object} - Array of keys or object to create (object) iterator from.
     * @param values {Array|Undefined} - Array of values if first param is an array.
     */
    ObjectIterator = Iterator.extend({

        /**
         * Constructor.
         * @param keysOrObj {Array|Object} - Array of keys or object to create (object) iterator from.
         * @param values {Array|Undefined} - Array of values if first param is an array.
         */
        constructor: function ObjectIterator(keysOrObj, values) {
            var obj,
                classOfParam0 = sjl.classOf(keysOrObj),
                receivedParamTypesList,
                _values,
                _keys;

            // Constructor scenario 1 (if param `0` is of type `Object`)
            if (classOfParam0 === 'Object') {
                obj = keysOrObj;
                _keys = Object.keys(obj);
                _values = _keys.map(function (key) {
                    return obj[key];
                });
            }

            // Constructor scenario 2 (if param `0` is of type `Array`)
            else if (classOfParam0 === 'Array') {
                sjl.throwTypeErrorIfNotOfType(contextName, 'values', values, Array,
                    'With the previous param being an array `values` can only be an array in this scenario.');
                _keys = keysOrObj;
                _values = values;
            }

            // Else failed constructor scenario
            else {
                receivedParamTypesList = [classOfParam0, sjl.classOf(values)];
                throw new TypeError ('#`' + contextName + '` received incorrect parameter values.  The expected ' +
                    'parameter list should be one of two: [Object] or [Array, Array].  ' +
                    'Parameter list received: [' + receivedParamTypesList.join(', ') + '].');
            }

            // Extend #own properties with #Iterator's own properties
            Iterator.call(this, _values);

            // @note Defining member jsdoc blocks here since our members are defined using Object.defineProperties()
            //   and some IDEs don't handle this very well (E.g., WebStorm)

            /**
             * Object iterator keys.
             * @member {Array<*>} sjl.stdlib.ObjectIterator#keys
             */

            // Define other own properties
            Object.defineProperties(this, {
                keys: {
                    get: function () {
                        return _keys;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'keys', value, Array);
                        _keys = value;
                    }
                }
            });
        },

        /**
         * Returns the current key and value that `pointer` is pointing to as an array [key, value].
         * @method sjl.stdlib.Iterator#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var self = this,
                pointer = self.pointer;
            return self.valid() ? {
                done: false,
                value: [self.keys[pointer], self.values[pointer]]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.stdlib.Iterator#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var self = this,
                pointer = self.pointer,
                retVal = self.valid() ? {
                    done: false,
                    value: [self.keys[pointer], self.values[pointer]]
                } : {
                    done: true
                };
            self.pointer += 1;
            return retVal;
        },

        /**
         * Returns whether iterator has more items to return or not.
         * @returns {boolean}
         */
        valid: function () {
            var pointer = this.pointer;
            return pointer < this.values.length && pointer < this.keys.length;
        },

        /**
         * Iterates through all elements in iterator.  @note Delegates to it's values `forEach` method.
         * @param callback {Function}
         * @param context {Object}
         * @returns {sjl.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            var self = this,
                values = self.values;
            context = context || self;
            self.keys.forEach(function (key, index, keys) {
                callback.call(context, values[index], key, keys);
            });
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = ObjectIterator;
    }
    else {
        sjl.ns('stdlib.' + moduleName, ObjectIterator);
        if (window.__isAmd) {
            return ObjectIterator;
        }
    }

}());

/**
 * Created by elydelacruz on 11/2/15.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Iterator = sjl.stdlib.Iterator,
        ObjectIterator = sjl.stdlib.ObjectIterator;

    /**
     * Defines an es6 compliant iterator callback on `Object` or `Array`.
     * @function module:sjl.iterable
     * @param array {Array|Object} - Array or object to set iterator function on.
     * @returns array {Array|Object}
     */
    sjl.iterable = function (arrayOrObj) {
        var classOfArrayOrObj = sjl.classOf(arrayOrObj),
            keys, values;
        if (classOfArrayOrObj === 'Array') {
            arrayOrObj[sjl.Symbol.iterator] = function () {
                return new Iterator(arrayOrObj);
            };
        }
        else if (classOfArrayOrObj === 'Object') {
            keys = Object.keys(arrayOrObj);
            values = keys.map(function (key) {
                return arrayOrObj[key];
            });
            arrayOrObj[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(keys, values);
            };
        }
        else {
            throw new Error('sjl.iterable only takes objects or arrays.  ' +
                'arrayOrObj param received type is "' + classOfArrayOrObj +
                '".  Value received: ' + arrayOrObj);
        }
        return arrayOrObj;
    };

    if (isNodeEnv) {
        module.exports = sjl.iterable;
    }
    else {
        sjl.ns('stdlib.iterable', sjl.iterable);
        if (window.__isAmd) {
            return sjl.iterable;
        }
    }

}());

(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        stdlib = sjl.stdlib,
        Extendable = stdlib.Extendable,
        ObjectIterator = stdlib.ObjectIterator,
        makeIterable = stdlib.iterable,

    /**
     * SjlSet constructor.  This object has the same interface as the es6 `Set`
     * object.  The only difference is this one has some extra methods;  I.e.,
     *  `addFromArray`, `iterator`, and a defined `toJSON` method.
     * @class sjl.stdlib.SjlSet
     * @extends sjl.stdlib.Extendable
     * @param iterable {Array}
     */
    SjlSet = Extendable.extend({
        /**
         * Constructor.
         * @param iterable {Array} - Optional.
         */
        constructor: function SjlSet (iterable) {
            var self = this,
                _values = [];

            /**
             * Public properties:
             *------------------------------------------------*/
            /**
             * @member {Number} sjl.stdlib.SjlSet#size
             * @readonly
             * @enumerable True.
             */
            /**
             * Where the values are kept on the Set.
             * @member {Array<*>} sjl.stdlib.SjlSet#_values
             * @readonly
             */
            /**
             * Flag for knowing that default es6 iterator was overridden.
             * @member {Boolean} sjl.stdlib.SjlSet#_iteratorOverridden
             * @readonly
             */

            Object.defineProperties(this, {
                _values: {
                    value: _values
                },
                size: {
                    get: function () {
                        return _values.length;
                    },
                    enumerable: true
                }
            });

            // If an array was passed in inject values
            if (sjl.classOfIs(iterable, 'Array')) {
                self.addFromArray(iterable);
            }

            // If anything other than an array is passed in throw an Error
            else if (typeof iterable !== _undefined) {
                throw new Error ('Type Error: sjl.SjlSet takes only iterable objects as it\'s first parameter. ' +
                    ' Parameter received: ', iterable);
            }

            // Make our `_values` array inherit our special iterator
            makeIterable(_values);

            // Set custom iterator function on `this`
            self[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(_values, _values);
            };

            // Set flag to remember that original iterator was overridden
            Object.defineProperty(self, '_iteratorOverridden', {value: true});
        },

        /**
         * Adds a value to Set.
         * @method sjl.stdlib.SjlSet#add
         * @param value {*}
         * @returns {sjl.stdlib.SjlSet}
         */
        add: function (value) {
            if (!this.has(value)) {
                this._values.push(value);
            }
            return this;
        },

        /**
         * Clears Set.
         * @method sjl.stdlib.SjlSet#clear
         * @returns {sjl.stdlib.SjlSet}
         */
        clear: function () {
            while (this._values.length > 0) {
                this._values.pop();
            }
            return this;
        },

        /**
         * Deletes a value from Set.
         * @method sjl.stdlib.SjlSet#delete
         * @param value {*}
         * @returns {sjl.stdlib.SjlSet}
         */
        delete: function (value) {
            var _index = this._values.indexOf(value);
            if (_index > -1 && _index <= this._values.length) {
                this._values.splice(_index, 1);
            }
            return this;
        },

        /**
         * Es6 compliant iterator for all entries in set
         * @method sjl.stdlib.SjlSet#entries
         * @return {sjl.stdlib.ObjectIterator}
         */
        entries: function () {
            return new ObjectIterator(this._values, this._values, 0);
        },

        /**
         * Loops through values in set and calls callback
         * (with optional context) for each value in set.
         * Same signature as Array.prototype.forEach except for values in Set.
         * @method sjl.stdlib.SjlSet#forEach
         * @param callback {Function} - Same signature as Array.prototype.forEach.
         * @param context {*} - Optional.
         * @returns {sjl.stdlib.SjlSet}
         */
        forEach: function (callback, context) {
            this._values.forEach(callback, context);
            return this;
        },

        /**
         * Checks if value exists within Set.
         * @method sjl.stdlib.SjlSet#has
         * @param value
         * @returns {boolean}
         */
        has: function (value) {
            return this._values.indexOf(value) > -1;
        },

        /**
         * Returns an es6 compliant iterator of Set's values (since set doesn't have any keys).
         * @method sjl.stdlib.SjlSet#keys
         * @returns {sjl.stdlib.Iterator}
         */
        keys: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**
         * Returns an es6 compliant iterator of Set's values.
         * @method sjl.stdlib.SjlSet#values
         * @returns {sjl.stdlib.Iterator}
         */
        values: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**************************************************
         * METHODS NOT PART OF THE `Set` spec for ES6:
         **************************************************/

        /**
         * Adds item onto `SjlSet` from the passed in array.
         * @method sjl.stdlib.SjlSet#addFromArray
         * @param value {Array}
         * @returns {sjl.stdlib.SjlSet}
         */
        addFromArray: function (value) {
            // Iterate through the passed in iterable and add all values to `_values`
            var iterator = makeIterable(value, 0)[sjl.Symbol.iterator]();

            // Loop through values and add them
            while (iterator.valid()) {
                this.add(iterator.next().value);
            }
            iterator = null;
            return this;
        },

        /**
         * Returns an iterator with an es6 compliant interface.
         * @method sjl.stdlib.SjlSet#iterator
         * @returns {sjl.stdlib.Iterator}
         */
        iterator: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**
         * Returns own `values`.
         * @method sjl.stdlib.SjlSet#toJSON
         * @returns {Array<*>}
         */
        toJSON: function () {
            return this._values;
        }
    });

    if (isNodeEnv) {
        module.exports = SjlSet;
    }
    else {
        sjl.ns('stdlib.SjlSet', SjlSet);
        if (window.__isAmd) {
            return SjlSet;
        }
    }

})();

/**
 * Created by Ely on 7/17/2015.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},

        // Constructors for composition
        Extendable =        sjl.stdlib.Extendable,
        ObjectIterator =    sjl.stdlib.ObjectIterator,
        makeIterable =      sjl.stdlib.iterable,

        // Constructor to augment
        SjlMap = function SjlMap (iterable) {
            var self = this,
                _keys,
                _values;
            Object.defineProperties(this, {
                _keys: {
                    get: function () {
                        return _keys;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(SjlMap.name, '_keys', value, Array);
                        _keys = makeIterable(value);
                    }
                },
                _values: {
                    get: function () {
                        return _values;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(SjlMap.name, '_values', value, Array);
                        _values = makeIterable(value);
                    }
                },
                size: {
                    get: function () {
                        return self._keys.length;
                    }
                }
            });

            self._keys = [];
            self._values = [];

            // If an array was passed in inject values
            if (Array.isArray(iterable)) {
                self.addFromArray(iterable);
            }

            else if (sjl.classOfIs(iterable, 'Object')) {
                self.addFromObject(iterable);
            }

            // If anything other than an array is passed in throw an Error
            else if (typeof iterable !== _undefined) {
                throw new Error ('Type Error: sjl.SjlMap takes only iterable objects as it\'s first parameter. ' +
                ' Parameter received: ', iterable);
            }

            // Set custom iterator function on `this`
            self[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(self._keys, self._values, 0);
            };

            // Set flag to remember that original iterator was overridden
            self._iteratorOverridden = true;
        };

    /**
     * 'Simple Javascript Library Map' object (stand-in object
     *  for es6 `Maps` until they're support is more widely accepted).
     *
     *  This constructor offers the same exact api as es6 `Map` objects with
     *  an additional couple of convenience methods (`addFromArray`, `addFromObject`, `iterator`, `toJson`).
     *
     * @param iterable {Array|Object} - The object to populate itself from (either an `Array<[[key, value]]>`
     *  or an `Object` hash).
     * @constructor sjl.stdlib.SjlMap
     */
    SjlMap = Extendable.extend(SjlMap, {
        /**
         * Clears the `SjlMap` object of all data that has been set on it.
         * @method sjl.stdlib.SjlMap#clear
         * @returns {SjlMap}
         */
        clear: function () {
                while (this._values.length > 0) {
                    this._values.pop();
                }
                while (this._keys.length > 0) {
                    this._keys.pop();
                }
                return this;
            },

        /**
         * Deletes an entry in the `SjlMap`.
         * @method sjl.stdlib.SjlMap#delete
         * @param key {*} - Key of key-value pair to remove.
         * @returns {SjlMap}
         */
        delete: function (key) {
                if (this.has(key)) {
                    var _index = this._keys.indexOf(key);
                    this._values.splice(_index, 1);
                    this._keys.splice(_index, 1);
                }
                return this;
            },

        /**
         * Returns the entries in this `SjlMap` as a valid es6 iterator to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.stdlib.SjlMap#entries
         * @returns {sjl.stdlib.ObjectIterator}
         */
        entries: function () {
                return new ObjectIterator(this._keys, this._values, 0);
            },

        /**
         * Iterates through all key value pairs in itself and passes them to `callback`
         *  on each iteration.
         * @method sjl.stdlib.SjlMap#forEach
         * @param callback {Function} - Required.
         * @param context {Object} - Optional.
         * @returns {SjlMap}
         */
        forEach: function (callback, context) {
            var self = this;
            self._keys.forEach(function (key, index) {
                callback.call(context, self._values[index], key);
            });
            return self;
        },

        /**
         * Returns whether a `key` is set on this `SjlMap`.
         * @method sjl.stdlib.SjlMap#has
         * @param key {*} - Required.
         * @returns {boolean}
         */
        has: function (key) {
            return this._keys.indexOf(key) > -1;
        },

        /**
         * Returns the keys in this `SjlMap` as a valid es6 iterator object to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.stdlib.SjlMap#keys
         * @returns {sjl.stdlib.Iterator}
         */
        keys: function () {
            return this._keys[sjl.Symbol.iterator]();
        },

        /**
         * Returns the values in this `SjlMap` as a valid es6 iterator object to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.stdlib.SjlMap#values
         * @returns {sjl.stdlib.Iterator}
         */
        values: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**
         * Returns the value "set" for a key in instance.
         * @method sjl.stdlib.SjlMap#get
         * @param key {*}
         * @returns {*}
         */
        get: function (key) {
            var index = this._keys.indexOf(key);
            return index > -1 ? this._values[index] : undefined;
        },

        /**
         * Sets a key-value pair in this instance.
         * @method sjl.stdlib.SjlMap#set
         * @param key {*} - Key to set.
         * @param value {*} - Value to set.
         * @returns {SjlMap}
         */
        set: function (key, value) {
            var index = this._keys.indexOf(key);
            if (index > -1) {
                this._keys[index] = key;
                this._values[index] = value;
            }
            else {
                this._keys.push(key);
                this._values.push(value);
            }
            return this;
        },

        /**************************************************
         * METHODS NOT PART OF THE `Set` spec for ES6:
         **************************************************/

        /**
         * Adds key-value array pairs in an array to this instance.
         * @method sjl.stdlib.SjlMap#addFromArray
         * @param array {Array<Array<*, *>>} - Array of key-value array entries to parse.
         * @returns {SjlMap}
         */
        addFromArray: function (array) {
            // Iterate through the passed in iterable and add all values to `_values`
            var iterator = sjl.iterable(array, 0)[sjl.Symbol.iterator](),
                entry;

            // Loop through values and add them
            while (iterator.valid()) {
                entry = iterator.next();
                this.set(entry.value[0], entry.value[1]);
            }
            iterator = null;
            entry = null;
            return this;
        },

        /**
         * Add all the `object`'s instance's own property key-value pairs to this instance.
         * @method sjl.stdlib.SjlMap#addFromObject
         * @param object {Object} - Object to operate on.
         * @returns {SjlMap}
         */
        addFromObject: function (object) {
            sjl.throwTypeErrorIfNotOfType(SjlMap.name, 'object', object, 'Object',
                'Only `Object` types allowed.');
            var self = this,
                entry,
                objectIt = new ObjectIterator(object);
            while (objectIt.valid()) {
                entry = objectIt.next();
                self.set(entry.value[0], entry.value[1]);
            }
            return self;
        },

        /**
         * Returns a valid es6 iterator to iterate over key-value pair entries of this instance.
         *  (same as `SjlMap#entries`).
         * @method sjl.stdlib.SjlMap#iterator
         * @returns {sjl.stdlib.ObjectIterator}
         */
        iterator: function () {
            return this.entries();
        },

        /**
         * Shallow to json method.
         * @method sjl.stdlib.SjlMap#toJSON
         * @returns {{}}
         */
        toJSON: function () {
            var self = this,
                out = {};
            this._keys.forEach(function (key, i) {
                out[key] = self._values[i];
            });
            return out;
        }
    });

    if (isNodeEnv) {
        module.exports = SjlMap;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.SjlMap', SjlMap);

        // If `Amd` return the class
        if (window.__isAmd) {
            return SjlMap;
        }
    }

})();

/**
 * Created by elyde on 1/11/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl,
        Extendable = sjl.stdlib.Extendable,
        ObjectIterator = sjl.stdlib.ObjectIterator,
        SjlMap = sjl.stdlib.SjlMap,
        priorityItemSerial = 0,
        PriorityListItem = function PriorityListItem (key, value, priority) {
            var _priority;
            Object.defineProperties(this, {
                key: {
                    value: key
                },
                serial: {
                    value: priorityItemSerial
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
            priorityItemSerial += 1;
        },
        PriorityList = function PriorityList (objOrArray, LIFO) {
            var _sorted = false,
                _internalPriorities = 0,
                _LIFO = sjl.classOfIs(LIFO, Boolean) ? LIFO : false,
                _LIFO_modifier = _LIFO ? 1 : -1,
                classOfIterable = sjl.classOf(objOrArray);
            Object.defineProperties(this, {
                originallyPassedInIterableType: {
                    value: classOfIterable
                },
                _internalPriorities: {
                    get: function () {
                        return _internalPriorities;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, '_internalPriorities', value, Number);
                        _internalPriorities = value;
                    }
                },
                itemsMap: {
                    value: new SjlMap()
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
                },
                size: {
                    get: function () {
                        return this.itemsMap.size;
                    }
                }
            });
            if (classOfIterable === 'Object') {
                this.addFromObject(objOrArray);
            }
            else if (classOfIterable === 'Array') {
                this.addFromArray(objOrArray);
            }
        };

    PriorityListItem = Extendable.extend(PriorityListItem);

    PriorityList = Extendable.extend(PriorityList, {
        // Own Api functions
        // -------------------------------------------
        sort: function () {
            var retVal = this,
                LIFO_modifier = this.LIFO_modifier,
                sortedValues,
                sortedKeys;
            if (this.sorted) {
                return retVal;
            }
            sortedValues = [].concat(this.itemsMap._values).sort(function (a, b) {
                return a.priority === b.priority
                    ? (a.serial > b.serial ? -1 : 1) * LIFO_modifier
                    : (a.priority > b.priority ? -1 : 1);
            }, this);
            sortedKeys = sortedValues.map(function (item) {
                return item.key;
            });
            this.itemsMap._keys = sortedKeys;
            this.itemsMap._values = sortedValues.map(function (item) {
                return item.value;
            });
            this.sorted = true;
            return this.pointer(0);
        },

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

        // Iterator functions
        // -------------------------------------------
        /**
         * Returns the current key and value that `pointer()` is pointing to as an array [key, value].
         * @method sjl.stdlib.PriorityList#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var current = this.itemsMap.current();
            current.value = current.value.value;
            return !current.done ? current.value : current;
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.stdlib.PriorityList#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var next = this.itemsMap.next();
            next.value = next.value.value;
            return !next.done ? next.value : next;
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
         * @method sjl.stdlib.PriorityList#rewind
         * @returns {sjl.stdlib.PriorityList}
         */
        rewind: function () {
            this.itemsMap.rewind();
            return this;
        },

        /**
         * Overloaded getter and setter for internal maps `_pointer` property.
         * @param pointer {Number|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.stdlib.PriorityList}
         * @throws {TypeError} - If `pointer` is set and is not of type `Number`.
         */
        pointer: function (pointer) {
            var retVal = this;
            // If is a getter call get the value
            if (typeof pointer === _undefined) {
                retVal = this.itemsMap.pointer;
            }
            // If is a setter call
            else {
                // Set and validate pointer (validated via `_pointer` getter property definition)
                this.itemsMap.pointer = pointer;
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
            this.sort();
            var keys = this.itemsMap._keys.concat([]),
                values = this.itemsMap._values.concat([]);
            return new sjl.stdlib.ObjectIterator(keys, values);
        },
        forEach: function (callback, context) {
            return this.sort().itemsMap.forEach(callback, context);
        },
        has: function (key) {
            return this.itemsMap.has(key);
        },
        keys: function () {
            return this.sort().itemsMap.keys();
        },
        values: function () {
            var out = [];
            this.sort().itemsMap.forEach(function (value, key) {
                out.push(value);
            });
            return new sjl.stdlib.Iterator(out);
        },
        get: function (key) {
            var item = this.itemsMap.get(key);
            return sjl.classOfIs(item, PriorityListItem) ? item.value : item;
        },
        set: function (key, value, priority) {
            this.sorted = false;
            this.itemsMap.set(key, new PriorityListItem(key, value, this.normalizePriority(priority)));
            return this;
        },
        delete: function (key) {
            this.itemsMap.delete(key);
            return this;
        },

        // Non api specific functions
        // -------------------------------------------

        /**
         * Adds key-value array pairs in an array to this instance.
         * @method sjl.stdlib.PriorityList#addFromArray
         * @param array {Array<Array<*, *>>} - Array of key-value array entries to parse.
         * @returns {PriorityList}
         */
        addFromArray: function (array) {
            // Iterate through the passed in iterable and add all values to `_values`
            var iterator = sjl.iterable(array, 0)[sjl.Symbol.iterator](),
                entry;

            // Loop through values and add them
            while (iterator.valid()) {
                entry = iterator.next();
                this.set(entry.value[0], entry.value[1]);
            }
            iterator = null;
            entry = null;
            return this; //.sort();
        },

        /**
         * Add all the `object`'s instance's own property key-value pairs to this instance.
         * @method sjl.stdlib.PriorityList#addFromObject
         * @param object {Object} - Object to operate on.
         * @returns {PriorityList}
         */
        addFromObject: function (object) {
            sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'object', object, 'Object',
                'Only `Object` types allowed.');
            var self = this,
                entry,
                objectIt = new ObjectIterator(object);
            while (objectIt.valid()) {
                entry = objectIt.next();
                self.set(entry.value[0], entry.value[1]);
            }
            return self; //.sort();
        },

        /**
         * Returns a valid es6 iterator to iterate over key-value pair entries of this instance.
         *  (same as `PriorityList#entries`).
         * @method sjl.stdlib.PriorityList#iterator
         * @returns {sjl.stdlib.ObjectIterator}
         */
        iterator: function () {
            return this.entries();
        },

        toJSON: function () {}
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

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        contextName = 'sjl.validator.Validator',
        Validator = function Validator(/** ...options {Object} **/) {
            var _messages = [],
                _messagesMaxLength = 100,
                _messageTemplates = {},
                _valueObscured = false,
                _value = null;

            // Define public accessible properties
            Object.defineProperties(this, {
                messages: {
                    get: function () {
                        return _messages;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messages', value, Array);
                        _messages = value;
                    },
                    enumerable: true
                },
                messagesMaxLength: {
                    get: function () {
                        return _messagesMaxLength;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messagesMaxLength', value, Number);
                        _messagesMaxLength = value;
                    },
                    enumerable: true
                },
                messageTemplates: {
                    get: function () {
                        return _messageTemplates;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messageTemplates', value, Object);
                        sjl.extend(true, _messageTemplates, value);
                    },
                    enumerable: true
                },
                value: {
                    get: function () {
                        return _value;
                    },
                    set: function (value) {
                        _value = value;
                    },
                    enumerable: true
                },
                valueObscured: {
                    get: function () {
                        return _valueObscured;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'valueObscured', value, Boolean);
                        _valueObscured = value;
                    },
                    enumerable: true
                }
            });

            // Merge options in
            sjl.extend.apply(sjl, [true, this].concat(sjl.argsToArray(arguments)));
        };

    Validator = sjl.stdlib.Extendable.extend(Validator, {

        /**
         * @todo change this method name to `addErrorByKeyOrCallback` or just add `addErrorByCallback` method
         * @param key {String|Function} - Key for add error by or callback to generate error string from.
         * @param value {*|undefined} - Value to pass into the error callback.
         * @returns {Validator}
         */
        addErrorByKey: function (key, value) {
            value = typeof value !== 'undefined' ? value : this.value;
            var self = this,
                messageTemplate = self.messageTemplates,
                messages = self.messages;

            // If key is string
            if (sjl.classOfIs(key, 'String') &&
                sjl.isset(messageTemplate[key])) {
                if (typeof messageTemplate[key] === 'function') {
                    messages.push(messageTemplate[key].call(self, value, self)); // @todo should change this to just call values as functions directly
                }
                else if (sjl.classOfIs(messageTemplate[key], 'String')) {
                    messages.push(messageTemplate[key]);
                }
            }
            else if (sjl.classOfIs(key, 'function')) {
                messages.push(key.call(self, value, self));
            }
            else {
                messages.push(key);
            }
            return self;
        },

        clearMessages: function () {
            this.messages = [];
            return this;
        },

        validate: function (value) {
            return this.isValid(value);
        },

        isValid: function (value) {
            throw Error('Can not instantiate `Validator` directly, all class named with ' +
                'a prefixed "Base" should not be instantiated.');
        }

    });

    if (isNodeEnv) {
        module.exports = Validator;
    }
    else {
        sjl.ns('validator.Validator', Validator);
        if (window.__isAmd) {
            return Validator;
        }
    }

})();

/**
 * Created by Ely on 7/21/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        contextName = 'sjl.validator.ValidatorChain',
        ObjectIterator = sjl.stdlib.ObjectIterator,
        Validator = sjl.validator.Validator,
        ValidatorChain = function ValidatorChain(/*...options {Object}*/) {
            var _breakChainOnFailure = false,
                _validators = [];
            Object.defineProperties(this, {
                validators: {
                    get: function () {
                        return _validators;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'validators', value, Array);
                        _validators = [];
                        this.addValidators(value.slice());
                    }
                },
                breakChainOnFailure: {
                    get: function () {
                        return _breakChainOnFailure;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'breakChainOnFailure', value, Boolean);
                        _breakChainOnFailure = value;
                    }
                }
            });

            // Call Validator's constructor on this with some default options
            Validator.apply( this, [{
                    breakChainOnFailure: false
                }].concat(sjl.argsToArray(arguments)) );
        };

    ValidatorChain = Validator.extend(ValidatorChain, {

        isValid: function (value) {
            var self = this,
                retVal,
                validators;

            // Set value internally and return it or get it
            value = typeof value === 'undefined' ? self.value : value;

            // Clear any existing messages
            self.clearMessages();

            // Get validators
            validators = self.validators;

            if (self.breakChainOnFailure) {
                // If `some` value is not valid reverse return value of `some`
                retVal = !validators.some(function (validator) {
                    var out = false;
                    if (!validator.isValid(value)) {
                        // Append error messages
                        self.appendMessages(validator.messages);
                        out = true;
                    }
                    return out;
                });
            }
            else {
                // Check if every `validator` validates `value` to `true`
                retVal = validators.every(function (validator) {
                    var out = true;
                    if (!validator.isValid(value)) {
                        // Append error messages
                        self.appendMessages(validator.messages);
                        out = false;
                    }
                    return out;
                });
            }

            // Return result of valid check
            return retVal;
        },

        isValidator: function (validator) {
            return validator instanceof Validator;
        },

        isValidatorChain: function (validatorChain) {
            return validatorChain instanceof ValidatorChain;
        },

        addValidator: function (validator) {
            var self = this;
            if (this.isValidator(validator)) {
                self.validators.push(validator);
            }
            else {
                this._throwTypeError('addValidator', Validator, validator);
            }
            return self;
        },

        addValidators: function (validators) {
            if (sjl.classOfIs(validators, 'Array')) {
                validators.forEach(function (validator) {
                    this.addValidator(validator);
                }, this);
            }
            else if (sjl.classOfIs(validators, 'Object')) {
                var iterator = new ObjectIterator(validators);
                iterator.forEach(function (value, key) {
                    this.addValidator(value);
                }, this);
            }
            else {
                throw new TypeError( '`' + contextName + '.addValidators` only accepts Arrays or Objects. ' +
                    ' Type Received: "' + sjl.classOf(validators) + '".');
            }
            return this;
        },

        prependValidator: function (validator) {
            if (!this.isValidator(validator)) {
                this._throwTypeError('prependValidator', Validator, validator);
            }
            this.validators = [validator].concat(this.validators);
            return this;
        },

        mergeValidatorChain: function (validatorChain) {
            if (!this.isValidatorChain(validatorChain)) {
                this._throwTypeError('mergeValidatorChain', ValidatorChain, validatorChain);
            }
            this.breakChainOnFailure = validatorChain.breakChainOnFailure;
            return this.addValidators(validatorChain.validators);
        },

        clearMessages: function () {
            while (this.messages.length > 0) {
                this.messages.pop();
            }
            this.validators.forEach(function (validator) {
                validator.clearMessages();
            });
            return this;
        },

        appendMessages: function (messages) {
            var self = this;
            if (sjl.isEmptyOrNotOfType(messages, Array)) {
                this._throwTypeError('appendMessages', Array, messages);
            }
            self.messages = self.messages.concat(messages);
            return self;
        },

        _throwTypeError: function (funcName, expectedType, value) {
            throw new TypeError('`' + contextName + '.' + funcName + '` only accepts subclasses/types of ' +
                '`' + expectedType.name + '`.  Type received: "' + sjl.classOf(value) + '".');
        }

    });

    if (isNodeEnv) {
        module.exports = ValidatorChain;
    }
    else {
        sjl.ns('validator.ValidatorChain', ValidatorChain);
        if (window._isAmd) {
            return ValidatorChain;
        }
    }

})();


/**
 * Created by Ely on 7/21/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        Validator = sjl.validator.Validator,
        NotEmptyValidator = function NotEmptyValidator() {
            // Set defaults and extend with Base validator
            Validator.apply(this, [{
                messageTemplates: {
                    EMPTY_NOT_ALLOWED: function () {
                        return 'Empty values are not allowed.';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    NotEmptyValidator = Validator.extend(NotEmptyValidator, {

        isValid: function (value) {
            var self = this,
                retVal = false;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            value = typeof value === 'undefined' ? this.value : value;

            // Run the test
            retVal = !sjl.empty(value);

            // If test failed
            if (retVal === false) {
                self.addErrorByKey('EMPTY_NOT_ALLOWED');
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = NotEmptyValidator;
    }
    else {
        sjl.ns('validator.NotEmptyValidator', NotEmptyValidator);
        if (window.__isAmd) {
            return NotEmptyValidator;
        }
    }

})();

/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        contextName = 'sjl.validator.RegexValidator',
        Validator = sjl.validator.Validator,
        RegexValidator = function RegexValidator(/** ...options {Object} **/) {
            var _pattern = null;
            Object.defineProperties(this, {
                pattern: {
                    get: function () {
                        return _pattern;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'pattern', value, RegExp);
                        _pattern = value;
                    }
                }
            });

            // Set defaults and extend with Base validator
            Validator.apply(this, [{
                pattern: /./,
                messageTemplates: {
                    DOES_NOT_MATCH_PATTERN: function () {
                        return 'The value passed in does not match pattern"'
                            + this.pattern + '".  Value passed in: "'
                            + this.value + '".';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    RegexValidator = Validator.extend(RegexValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            this.value = value = typeof value === 'undefined' ? this.value : value;

            // Run the test
            retVal = self.pattern.test(value);

            // Clear messages before checking validity
            if (self.messages.length > 0) {
                self.clearMessages();
            }

            // If test failed
            if (retVal === false) {
                self.addErrorByKey('DOES_NOT_MATCH_PATTERN');
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = RegexValidator;
    }
    else {
        sjl.ns('validator.RegexValidator', RegexValidator);
        if (window.__isAmd) {
            return RegexValidator;
        }
    }

})();

/**
 * Created by Ely on 1/21/2015.
 * Initial idea copied from the Zend Framework 2's Between Validator
 * @todo add `allowSigned` check(s).
 */
(function () {

    'use strict';

    /**
     * Container for defining/holding the result format of string validation operations within NumberValidator.
     * @param flag {Array<Number, String|Value>} - [-1, 0, 1] (operation state `-1` falied, `0` untouched, `1` value transformed).
     * @param value {String} - String value to be validated.
     * @constructor
     */
    //function StringValidationOpResult (flag, value) {
    //    if (sjl.classOfIs(value, String)) {
    //        throw new Error(StringValidationOpResult.name + ' expects param 2 to be of type' +
    //            ' "String".  Type received: "' + sjl.classOf(value) + '".');
    //    }
    //    this[0] = flag;
    //    this[1] = value;
    //}

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        Validator = sjl.validator.Validator,
        contextName = 'sjl.validator.NumberValidator',
        //InRangeValidator = sjl.validator.InRangeValidator,
        NumberValidator = function NumberValidator(/** ...options {Object}**/) {
            // Apply Validator to self
            Validator.apply(this);

            var _messageTemplates = {
                    NOT_A_NUMBER: function (value, validator) {
                        return 'Value "' + value + '" is not a number.';
                    },
                    NOT_IN_RANGE: function (value, validator) {
                        return 'The number passed in is not ' + (validator.inclusive ? 'inclusive' : '')
                            + 'ly within the specified '  + ' range. ' +
                            ' Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_FLOAT: function (value, validator) {
                        return 'No floats allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_COMMA: function (value, validator) {
                        return 'No commas allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_SIGNED: function (value, validator) {
                        return 'No signed numbers allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_HEX: function (value, validator) {
                        return 'No hexadecimal numbers allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_OCTAL: function (value, validator) {
                        return 'No octal strings allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_BINARY: function (value, validator) {
                        return 'No binary strings allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    NOT_ALLOWED_SCIENTIFIC: function (value, validator) {
                        return 'No scientific number strings allowed.  ' +
                            'Value received: "' + value + '".';
                    },
                    INVALID_HEX: function (value, validator) {
                        return 'Invalid hexadecimal value: "' + value + '".';
                    },
                    INVALID_OCTAL: function (value, validator) {
                        return 'Invalid octal value: "' + value + '".';
                    },
                    INVALID_BINARY: function (value, validator) {
                        return 'Invalid binary value: "' + value + '".';
                    },
                    INVALID_SCIENTIFIC: function (value, validator) {
                        return 'Invalid scientific value: "' + value + '".';
                    },
                },
                _regexForHex = /^(?:(?:0x)|(?:\#))[\da-z]+$/i,
                _regexForOctal = /^0\d+$/,
                _regexForBinary = /^0b[01]+$/i,
                _regexForScientific = /^(?:\-|\+)?\d+(?:\.\d+)?(?:e(?:\-|\+)?\d+)?$/i,
                _allowFloat = true,
                _allowCommas = false,
                _allowSigned = true,
                _allowBinary = false,
                _allowHex = false,
                _allowOctal = false,
                _allowScientific = true,
                _checkRange = false,
                _defaultRangeSettings = {
                    min: Number.NEGATIVE_INFINITY,
                    max: Number.POSITIVE_INFINITY,
                    inclusive: true
                },
                _min = Number.NEGATIVE_INFINITY,
                _max = Number.POSITIVE_INFINITY,
                _inclusive = true;

            Object.defineProperties(this, {
                regexForHex: {
                    get: function () {
                        return _regexForHex;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'regexForHex', value, RegExp);
                        _regexForHex = value;
                    },
                    enumerable: true
                },
                regexForOctal: {
                    get: function () {
                        return _regexForOctal;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'regexForOctal', value, RegExp);
                        _regexForOctal = value;
                    },
                    enumerable: true
                },
                regexForBinary: {
                    get: function () {
                        return _regexForBinary;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'regexForBinary', value, RegExp);
                        _regexForBinary = value;
                    },
                    enumerable: true
                },
                regexForScientific: {
                    get: function () {
                        return _regexForScientific;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'regexForScientific', value, RegExp);
                        _regexForScientific = value;
                    },
                    enumerable: true
                },
                allowFloat: {
                    get: function () {
                        return _allowFloat;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowFloat', value, Boolean);
                        _allowFloat = value;
                    },
                    enumerable: true
                },
                allowCommas: {
                    get: function () {
                        return _allowCommas;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowCommas', value, Boolean);
                        _allowCommas = value;
                    },
                    enumerable: true
                },
                allowSigned: {
                    get: function () {
                        return _allowSigned;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowSigned', value, Boolean);
                        _allowSigned = value;
                    },
                    enumerable: true
                },
                allowBinary: {
                    get: function () {
                        return _allowBinary;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowBinary', value, Boolean);
                        _allowBinary = value;
                    },
                    enumerable: true
                },
                allowHex: {
                    get: function () {
                        return _allowHex;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowHex', value, Boolean);
                        _allowHex = value;
                    },
                    enumerable: true
                },
                allowOctal: {
                    get: function () {
                        return _allowOctal;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowOctal', value, Boolean);
                        _allowOctal = value;
                    },
                    enumerable: true
                },
                allowScientific: {
                    get: function () {
                        return _allowScientific;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowScientific', value, Boolean);
                        _allowScientific = value;
                    },
                    enumerable: true
                },
                checkRange: {
                    get: function () {
                        return _checkRange;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'checkRange', value, Boolean);
                        _checkRange = value;
                    },
                    enumerable: true
                },
                defaultRangeSettings: {
                    get: function () {
                        return _defaultRangeSettings;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'defaultRangeSettings', value, Object);
                        sjl.extend(true, _defaultRangeSettings, value);
                    },
                    enumerable: true
                },
                min: {
                    get: function () {
                        return _min;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'min', value, Number);
                        _min = value;
                    },
                    enumerable: true
                },
                max: {
                    get: function () {
                        return _max;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'max', value, Number);
                        _max = value;
                    },
                    enumerable: true
                },
                inclusive: {
                    get: function () {
                        return _inclusive;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'inclusive', value, Boolean);
                        _inclusive = value;
                    },
                    enumerable: true
                }
            });

            // Set default min, max, and inclusive values
            sjl.extend.apply(sjl, [
                    true, this,
                    this.defaultRangeSettings,
                    {messageTemplates: _messageTemplates}
                ].concat(sjl.argsToArray(arguments))
            );
        };

    NumberValidator = Validator.extend(NumberValidator, {

        isValid: function (value) {
            var self = this,

                // Return value
                retVal,

                // Class of initial value
                classOfValue = sjl.classOf(value),

                // A place to hold sub validation results
                parsedValidationResult,

                // Transformed value
                parsedValue;

            // Get value
            value = self.value = classOfValue === 'Undefined' ? self.value : value;

            // If number return true
            if (classOfValue === 'Number') {
                retVal = true;
            }

            // If is string, ...
            else if (classOfValue === 'String') {
                // Lower case any alpha characters to make the value easier to validate
                parsedValidationResult = this._parseValidationFunctions([
                    '_validateComma', '_validateBinary', '_validateHex',
                    '_validateOctal', '_validateScientific'
                ], value.toLowerCase());

                // Get validation result
                retVal = parsedValidationResult[0] === -1
                || parsedValidationResult[0] === 0 ? false : true;

                // possibly transformed value (to number) depends on what we set `retVal` to above.
                parsedValue = parsedValidationResult[1];
            }

            // Else if 'Not a Number' add error message
            if (!retVal) {
                retVal = false;
                self.addErrorByKey('NOT_A_NUMBER');
            }

            // If value is a `Number` so far
            else if (retVal) {
                parsedValidationResult =
                    this._parseValidationFunctions(
                            ['_validateSigned', '_validateFloat', '_validateRange'],
                            sjl.classOfIs(parsedValue, 'Number') ? parsedValue : value
                        );
                retVal = parsedValidationResult[0] === -1 ? false : true;
            }

            return retVal;
        },

        _parseValidationFunctions: function (functions, value) {
            var funcsLen = functions.length,
                resultSet,
                i;
            for (i = 0; i < funcsLen; i += 1) {
                resultSet = this[functions[i]](value);
                // If `value`'s validation failed exit the loop
                if (resultSet[0] === -1 || resultSet[0] === 1) {
                    break;
                }
            }
            return resultSet;
        },

        _validateHex: function (value) {
            var retVal = [0, value],
                isHexString = value.length > 0 && value[1] === 'x',
                isValidFormat;
            if (isHexString) {
                if (this.allowHex) {
                    isValidFormat = this.regexForHex.test(value);
                    if (!isValidFormat) {
                        retVal[1] = -1;
                        this.addErrorByKey('INVALID_HEX');
                    }
                    else {
                        retVal[0] = 1;
                        retVal[1] = parseInt(value, 16);
                    }
                }
                else {
                    retVal[1] = -1;
                    this.addErrorByKey('NOT_ALLOWED_HEX');
                }
            }
            return retVal;
        },

        _validateSigned: function (value) {
            var retVal = [0, value];
            // If no signed numbers allowed add error if number has sign
            if (!this.allowSigned && /^(:?\-|\+)/.test(value)) {
                this.addErrorByKey('NOT_ALLOWED_SIGNED');
                retVal[0] = -1;
            }
            return retVal;
        },

        _validateComma: function (value) {
            var out = [0, value],
                valueHasCommas = /,/.test(value),
                replacedString;
            if (valueHasCommas) {
                if (this.allowCommas) {
                    replacedString = value.replace(/,/g, '');
                    if (replacedString.length === 0) {
                        this.addErrorByKey('NOT_A_NUMBER');
                        out[0] = -1;
                    }
                    else {
                        out[1] = Number(replacedString);
                        out[0] = 1;
                    }
                }
                else if (!this.allowCommas) {
                    this.addErrorByKey('NOT_ALLOWED_COMMA');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateFloat: function (value) {
            var out = [0, value];
            if (!this.allowFloat && /\.{1}/g.test(value)) {
                this.addErrorByKey('NOT_ALLOWED_FLOAT');
                out[0] = -1;
            }
            return out;
        },

        _validateBinary: function (value) {
            var out = [0, value],
                possibleBinary = value.length > 0 && value[1] === 'b',
                isValidBinaryValue;
            if (possibleBinary) {
                if (this.allowBinary) {
                    isValidBinaryValue = this.regexForBinary.test(value);
                    if (isValidBinaryValue) {
                        out[0] = 1;
                        out[1] = Number(value);
                    }
                    else {
                        this.addErrorByKey('INVALID_BINARY');
                        out[0] = -1;
                    }
                }
                else {
                    this.addErrorByKey('NOT_ALLOWED_BINARY');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateOctal: function (value) {
            var out = [0, value],
                possibleOctal = /^0\d/.test(value),
                isValidOctalValue;
            if (possibleOctal) {
                if (this.allowOctal) {
                    isValidOctalValue = this.regexForOctal.test(value);
                    if (isValidOctalValue) {
                        out[0] = 1;
                        out[1] = parseInt(value, 8);
                    }
                    else {
                        this.addErrorByKey('NOT_ALLOWED_OCTAL');
                        out[0] = -1;
                    }
                }
                else {
                    this.addErrorByKey('INVALID_OCTAL');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateScientific: function (value) {
            var out = [0, value],
                possibleScientific = /\de/.test(value),
                isValidScientificValue;
            if (possibleScientific) {
                if (this.allowScientific) {
                    isValidScientificValue = this.regexForScientific.test(value);
                    if (isValidScientificValue) {
                        out[0] = 1;
                        out[1] = Number(value);
                    }
                    else {
                        this.addErrorByKey('INVALID_SCIENTIFIC');
                        out[0] = -1;
                    }
                }
                else {
                    this.addErrorByKey('NOT_ALLOWED_SCIENTIFIC');
                    out[0] = -1;
                }
            }
            return out;
        },

        _validateRange: function (value) {
            var out = [0, value];
            if (this.checkRange) {
                if (this.inclusive && (value < this.min || value > this.max)) {
                    out[0] = -1;
                }
                else if (!this.inclusive && (value <= this.min || value >= this.max)) {
                    out[0] = -1;
                }
                else {
                    out[0] = 1;
                }
            }
            return out;
        },

    }); // End of `NumberValidator` declaration

    if (isNodeEnv) {
        module.exports = NumberValidator;
    }
    else {
        sjl.ns('validator.NumberValidator', NumberValidator);
        if (window.__isAmd) {
            return NumberValidator;
        }
    }

})();

/**
 * Created by Ely on 1/21/2015.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        Validator = sjl.validator.Validator,
        AlnumValidator = function AlnumValidator (/**...options {Object}**/) {

            // Set defaults and extend with Base validator
            Validator.apply(this, [{
                messageTemplates: {
                    NOT_ALPHA_NUMERIC: function (value) {
                        return 'Value is not alpha-numeric.  Value received: "' + value + '".';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    AlnumValidator = Validator.extend(AlnumValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            // Get value
            value = this.value = sjl.isset(value) ? value : self.value;

            // Bail if no value
            if (!sjl.isset(value)) {
                self.addErrorByKey('NOT_ALPHA_NUMERIC');
                return retVal;
            }

            // Test value
            else if (!/^[\da-z]+$/i.test(value)) {
                self.addErrorByKey('NOT_ALPHA_NUMERIC');
            }

            // Else is 'alnum'
            else {
                retVal = true;
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = AlnumValidator;
    }
    else {
        sjl.ns('validator.AlnumValidator', AlnumValidator);
        if (window.__isAmd) {
            return AlnumValidator;
        }
    }

})();

/**
 * Created by Ely on 1/21/2015.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        RegexValidator = sjl.validator.RegexValidator,
        DigitValidator = function DigitValidator (/**...options {Object}**/) {
            RegexValidator.apply(this, [{
                pattern: /^\d+$/,
                messageTemplates: {
                    DOES_NOT_MATCH_PATTERN: function () {
                        return 'The value passed in contains non digital characters.  ' +
                            'Value received: "' + this.value + '".';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    DigitValidator = RegexValidator.extend(DigitValidator);

    if (isNodeEnv) {
        module.exports = DigitValidator;
    }
    else {
        sjl.ns('validator.DigitValidator', DigitValidator);
        if (window.__isAmd) {
            return DigitValidator;
        }
    }

})();

/**
 * Created by Ely on 1/21/2015.
 */

(function () {

    'use strict';

    function throwErrorIfNotPositiveNumber (contextName_, valueName_, value_) {
        if (value_ < 0) {
            throw new Error(contextName_ + '.' + valueName_ + ' must be a positive number.');
        }
    }

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        Validator = sjl.validator.Validator,
        contextName = 'sjl.validator.StringLength',
        StringLengthValidator = function StringLengthValidator (/**...options {Object}**/) {
            var _min = 0,
                _max = Number.POSITIVE_INFINITY; // inifinite
            Object.defineProperties(this, {
                min: {
                    get: function () {
                        return _min;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'min', value, Number);
                        throwErrorIfNotPositiveNumber(contextName, 'min', value);
                        _min = value;
                    }
                },
                max: {
                    get: function () {
                        return _max;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'max', value, Number);
                        throwErrorIfNotPositiveNumber(contextName, 'max', value);
                        _max = value;
                    }
                }
            });

            // Set defaults and extend with Base validator
            Validator.apply(this, [{
                messageTemplates: {
                    NOT_OF_CORRECT_TYPE: function (value) {
                        return 'Value is not a String.  ' +
                            'Value type received: ' + sjl.classOf(value) + '.  ' +
                            'Value received: "' + value + '".';
                    },
                    GREATER_THAN_MAX_LENGTH: function (value) {
                        return 'Value is greater than maximum length of "' + this.max + '".  ' +
                            'Value length: "' + value.length + '".' +
                            'Value received: "' + value + '".';
                    },
                    LESS_THAN_MIN_LENGTH: function (value) {
                        return 'Value is less than minimum length of "' + this.min + '".  ' +
                            'Value length: "' + value.length + '".' +
                            'Value received: "' + value + '".';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    StringLengthValidator = Validator.extend(StringLengthValidator, {
        isValid: function (value) {
            var self = this,
                retVal,
                classOfValue;

            // Get value
            value = this.value = sjl.isset(value) ? value : self.value;
            classOfValue = sjl.classOf(value);

            // Test value type
            if (classOfValue !== String.name) {
                self.addErrorByKey('NOT_OF_CORRECT_TYPE');
                retVal = false;
            }
            // Test value max length
            else if (value.length > this.max) {
                self.addErrorByKey('GREATER_THAN_MAX_LENGTH');
                retVal = false;
            }
            // Test value min length
            else if (value.length < this.min) {
                self.addErrorByKey('LESS_THAN_MIN_LENGTH');
                retVal = false;
            }
            // Else is within allotted string length
            else {
                retVal = true;
            }
            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = StringLengthValidator;
    }
    else {
        sjl.ns('validator.StringLengthValidator', StringLengthValidator);
        if (window.__isAmd) {
            return StringLengthValidator;
        }
    }

})();

/**
 * @constructor Filter
 * @extends sjl.stdlib.Extendable
 * @memberof module:sjl.filter
 * @requires sjl
 * @requires sjl.stdlib.Extendable
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl,
        Extendable = sjl.stdlib.Extendable,

    Filter = Extendable.extend({
        constructor: function Filter (/** ...options {Object} **/) {
            // Set options on filter
            if (arguments.length > 0) {
                sjl.extend.apply(sjl,
                    [true, this].concat(sjl.argsToArray(arguments)));
            }
        },
        filter: function (value) {
            return value; // filtered
        }
    });

    if (!isNodeEnv) {
        sjl.ns('filter.Filter', Filter);
        return Filter;
    }
    else {
        module.exports = Filter;
    }

}());

/**
 * Created by Ely on 7/21/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        contextName = 'sjl.filter.FilterChain',
        ObjectIterator = sjl.stdlib.ObjectIterator,
        Filter = sjl.filter.Filter,
        FilterChain = function FilterChain(filters) {
            var _filters = [];
            Object.defineProperties(this, {
                filters: {
                    get: function () {
                        return _filters;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'filters', value, Array);
                        _filters = [];
                        this.addFilters(value.slice());
                    }
                }
            });
            if (filters) {
                this.filters = filters.slice();
            }
        };

    FilterChain = sjl.stdlib.Extendable.extend(FilterChain, {

        filter: function (value) {
            return [value].concat(this.filters).reduce(function (_value, filter) {
                return filter.filter(_value);
            });
        },

        isFilter: function (filter) {
            return filter instanceof Filter;
        },

        isFilterChain: function (filterChain) {
            return filterChain instanceof FilterChain;
        },

        addFilter: function (filter) {
            var self = this;
            if (this.isFilter(filter)) {
                self.filters.push(filter);
            }
            else {
                this._throwTypeError('addFilter', Filter, filter);
            }
            return self;
        },

        addFilters: function (filters) {
            if (sjl.classOfIs(filters, 'Array')) {
                filters.forEach(function (filter) {
                    this.addFilter(filter);
                }, this);
            }
            else if (sjl.classOfIs(filters, 'Object')) {
                var iterator = new ObjectIterator(filters);
                iterator.forEach(function (value, key) {
                    this.addFilter(value);
                }, this);
            }
            else {
                throw new TypeError('`' + contextName + '.addFilters` only accepts Arrays or Objects. ' +
                    ' Type Received: "' + sjl.classOf(filters) + '".');
            }
            return this;
        },

        prependFilter: function (filter) {
            if (!this.isFilter(filter)) {
                this._throwTypeError('prependFilter', Filter, filter);
            }
            this.filters = [filter].concat(this.filters);
            return this;
        },

        mergeFilterChain: function (filterChain) {
            if (!this.isFilterChain(filterChain)) {
                this._throwTypeError('mergeFilterChain', FilterChain, filterChain);
            }
            this.breakChainOnFailure = filterChain.breakChainOnFailure;
            return this.addFilters(filterChain.filters);
        },

        _throwTypeError: function (funcName, expectedType, value) {
            throw new TypeError('`' + contextName + '.' + funcName + '` only accepts subclasses/types of ' +
                '`' + expectedType.name + '`.  Type received: "' + sjl.classOf(value) + '".');
        }
    });

    if (isNodeEnv) {
        module.exports = FilterChain;
    }
    else {
        sjl.ns('filter.FilterChain', FilterChain);
        if (window._isAmd) {
            return FilterChain;
        }
    }

})();


/**
 * Created by elydelacruz on 3/25/16.
 * @todo finish the class (BooleanFilter).
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        contextName = 'sjl.filter.Filter',
        Filter = sjl.filter.Filter,

        BooleanFilter = Filter.extend({
            constructor: function BooleanFilter(valueOrOptions) {
                if (!sjl.isset(this)) {
                    return BooleanFilter.filter(valueOrOptions);
                }
                var _allowCasting = true,       // Boolean
                    _translations = {},         // Object<String, Boolean>
                    _conversionRules = 'all';      // Array<String>
                Object.defineProperties(this, {
                    allowCasting: {
                        get: function () {
                            return _allowCasting;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'allowCasting', value, Boolean);
                            _allowCasting = value;
                        }
                    },
                    translations: {
                        get: function () {
                            return _translations;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'translations', value, Object);
                            _translations = value;
                        }
                    },
                    conversionRules: {
                        get: function () {
                            return _conversionRules;
                        },
                        set: function (value) {
                            if (value === 'all' && sjl.isEmptyOrNotOfType(value, Array)) {
                                throw new TypeError (contextName + '.conversionRules must be either equal to ' +
                                    'string "all" or an of array of string rule names.' +
                                    '  Type Received:' + sjl.classOf(value) + ';  Value received: ' + value);
                            }
                            _conversionRules = value;
                        }
                    }
                });
                Filter.apply(this, arguments);
            },
            filter: function (value) {
                return BooleanFilter.filter(value, this.allowCasting, this.conversionRules, this.translations);
            }
        });

    function loopThroughTranslations(value, translations) {
        var retVal,
            translationKeys = Object.keys(translations),
            keysLen = translationKeys.length,
            i, key;
        for (i = 0; i < keysLen; i += 1) {
            key = translationKeys[i];
            if (value.toLowerCase() === key.toLowerCase()) {
                retVal = translations[key];
                break;
            }
        }
        return retVal;
    }

    function normalizeConversionRules (rules) {
        var conversionRuleKeys,
            conversionRules;

        // If 'all' was passed in
        if ((sjl.isArray(rules) && rules.indexOf('all') > -1) ||
            (sjl.isString(rules) && rules.toLowerCase() === 'all')) {
            conversionRuleKeys = Object.keys(BooleanFilter.castingRules);
            conversionRules = (new sjl.stdlib.SjlSet(conversionRuleKeys)).delete('byNative').toJSON();
        }
        return conversionRules || rules;
    }

    function loopThroughConversionRules (value, conversionRules, translations) {
        var retVal,
            result, i, rule,
            rulesLength,
            rules = normalizeConversionRules(conversionRules);

        // If conversion rules are empty validate by native cast
        if (sjl.empty(rules)) {
            retVal = castByNative(value);
        }
        else {
            rulesLength = rules.length;
            for (i = 0; i < rulesLength; i += 1) {
                rule = rules[i];
                if (rule in BooleanFilter.castingRules === false) {
                    continue;
                }
                result = BooleanFilter.castingRules[rule].apply(BooleanFilter, [value, translations]);
                if (sjl.issetAndOfType(result, Boolean)) {
                    retVal = result;
                    break;
                }
            }
        }
        return sjl.issetAndOfType(retVal, Boolean) ? retVal : false;
    }

    function castValue(value, allowCasting, conversionRules, translations) {
        var retVal;
        if (sjl.isBoolean(value)) {
            retVal = value;
        }
        else if (sjl.isBoolean(allowCasting) && !allowCasting) {
            retVal = value;
        }
        else if (arguments.length === 1) {
            retVal = castByNative(value);
        }
        else if (conversionRules === 'all' || sjl.notEmptyAndOfType(conversionRules, Array)) {
            retVal = loopThroughConversionRules(value, conversionRules, translations);
        }
        return retVal;
    }

    function castBoolean(value) {
        return sjl.isBoolean(value) ? value : undefined;
    }

    function castInteger(value) {
        return sjl.isNumber(value) ? value !== 0 : undefined;
    }

    function castFloat(value) {
        return sjl.isNumber(value) ? Number(value.toFixed(1)) !== 0.0 : undefined;
    }

    function castString(value, translations) {
        var retVal;
        if (sjl.notEmptyAndOfType(value, String) &&
            sjl.notEmptyAndOfType(translations, Object)) {
            retVal = loopThroughTranslations(value, translations);
        }
        return retVal;
    }

    function castNull (value) {
        return value === null ? false : undefined;
    }

    function castArray (value) {
        var retVal;
        if (Array.isArray(value)) {
            retVal = value.length !== 0;
        }
        return retVal;
    }

    function castObject (value) {
        var retVal;
        if (sjl.isObject(value)) {
            retVal = Object.keys(value).length !== 0;
        }
        return retVal;
    }

    function castByNative (value) {
        return Boolean(value);
    }

    function castFalseString (value) {
        var retVal;
        if (sjl.notEmptyAndOfType(value, String)) {
            retVal = ['null', 'false', 'undefined', '0', '[]', '{}'].indexOf(value) === -1;
        }
        return retVal;
    }

    function castYesNo (value, translations) {
        var retVal,
            defaultTrans = {yes: true, no: false};
        if (sjl.notEmptyAndOfType(value, String)) {
            retVal = loopThroughTranslations(value, sjl.extend(defaultTrans, translations));
        }
        return retVal;
    }

    Object.defineProperties(BooleanFilter, {
        castingRules: {
            value: {
                boolean: castBoolean,
                integer: castInteger,
                float: castFloat,
                string: castString,
                null: castNull,
                array: castArray,
                object: castObject,
                byNative: castByNative,
                falseString: castFalseString,
                yesNo: castYesNo
            }
        },
        filter: {
            value: function filter (value, allowCastring, conversionRules, translations) {
                return castValue(value, allowCastring, conversionRules, translations);
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.BooleanFilter', BooleanFilter);
        return BooleanFilter;
    }
    else {
        module.exports = BooleanFilter;
    }

}());

/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        SlugFilter = sjl.filter.Filter.extend({
            constructor: function SlugFilter(value) {
                if (!sjl.isset(this)) {
                    return SlugFilter.filter(value);
                }
            },
            filter: function (value) {
                return SlugFilter.filter(value);
            }
        });

    Object.defineProperties(SlugFilter, {
        allowedCharsRegex: {
            value: /[^a-z\d\-\_]/gim,
            enumerable: true
        },
        filter: {
            value: function (value, max) {
                if (!sjl.isString(value)) {
                    return value;
                }
                max = sjl.classOfIs(max, Number) ? max : 201;
                return value.trim().toLowerCase()
                    .split(SlugFilter.allowedCharsRegex)
                    .filter(function (char) {
                        return char.length > 0;
                    })
                    .join('-')
                    .substring(0, max);
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.SlugFilter', SlugFilter);
        return SlugFilter;
    }
    else {
        module.exports = SlugFilter;
    }

}());

/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        StringToLowerFilter = sjl.filter.Filter.extend({
            constructor: function StringToLowerFilter(value) {
                if (!sjl.isset(this)) {
                    return StringToLowerFilter.filter(value);
                }
            },
            filter: function (value) {
                return StringToLowerFilter.filter(value);
            }
        });

    Object.defineProperties(StringToLowerFilter, {
        filter: {
            value: function (value) {
                return sjl.isString(value) ? value.toLowerCase() : value;
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.StringToLowerFilter', StringToLowerFilter);
        return StringToLowerFilter;
    }
    else {
        module.exports = StringToLowerFilter;
    }

}());

/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        StringTrimFilter = sjl.filter.Filter.extend({
            constructor: function StringTrimFilter(value) {
                if (!sjl.isset(this)) {
                    return StringTrimFilter.filter(value);
                }
            },
            filter: function (value) {
                return StringTrimFilter.filter(value);
            }
        });

    Object.defineProperties(StringTrimFilter, {
        filter: {
            value: function (value) {
                return sjl.isString(value) ? value.trim() : value;
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.StringTrimFilter', StringTrimFilter);
        return StringTrimFilter;
    }
    else {
        module.exports = StringTrimFilter;
    }

}());

/**
 * Created by elydelacruz on 3/25/16.
 */
(function () {

    'use strict';

    var isNodeJs = typeof window === 'undefined',
        sjl = isNodeJs ? require('./../../src/sjl') : window.sjl,
        contextName = 'sjl.filter.StripTagsFilter',
        StripTagsFilter = sjl.filter.Filter.extend({
            constructor: function StripTagsFilter(value, options) {
                if (!sjl.isset(this)) {
                    return StripTagsFilter.filter.apply(null, arguments);
                }
                var _tags,
                    _stripComments = false,
                    _attribs;
                Object.defineProperties(this, {
                    tags: {
                        get: function () {
                            return _tags;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'tags', value, Array);
                            _tags = value;
                        }
                    },
                    stripComments: {
                        get: function () {
                            return _stripComments;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'stripComments', value, Boolean);
                            _stripComments = value;
                        }
                    },
                    attribs: {
                        get: function () {
                            return _attribs;
                        },
                        set: function (value) {
                            sjl.throwTypeErrorIfNotOfType(contextName, 'attribs', value, Array);
                            _attribs = value;
                        }
                    }
                });
                if (sjl.classOfIs(options, Object)) {
                    sjl.extend(this, options);
                }
            },
            filter: function (value) {
                return StripTagsFilter.filter(
                    value,
                    this.tags,
                    this.attribs,
                    this.stripComments
                );
            }
        });

    function validateTagName (tag) {
        return /^[a-z][a-z\d\-]{0,21}$/i.test(tag);
    }

    function validateTagNames (tags) {
        return !tags.some(function (tag) {
                return !validateTagName(tag);
            });
    }

    function validateAttrib (attrib) {
        return validateTagName(attrib);
    }

    function validateAttribs (attribs) {
        return !attribs.some(function (attrib) {
            return !validateAttrib(attrib);
        });
    }

    function stripComments (value) {
        return value.replace(/<\!\-\-[\t\n\r]*.+[\t\n\r]*\-\->/gm, '');
    }

    function createTagRegexPartial (tag) {
        var spacePartial = StripTagsFilter.SPACE_REGEX_PARTIAL;
        return '(<(' + tag + ')' +
        '(?:' + StripTagsFilter.ATTRIB_REGEX_PARTIAL + ')*' + spacePartial + '>' +
            '.*' +
        '<\/' + spacePartial + '\\2' + spacePartial + '>)';
    }

    function stripTags (value, tags) {
        if (sjl.isEmptyOrNotOfType(tags, Array)) {
            return value;
        }
        else if (!sjl.isString(value)) {
            return value;
        }
        else if (!validateTagNames(tags)) {
            throw new Error (contextName + ' `_stripTags` ' +
                'Only valid html tag names allowed in `tags` list.  ' +
                'Tags received: "' + tags + '".');
        }
        var out = value;
        tags.forEach(function (tag) {
            var regex = new RegExp(createTagRegexPartial(tag), 'gim');
            out = out.replace(regex, '');
        });
        return out;
    }

    function stripAttribs (value, attribs) {
        if (!sjl.isset(attribs)) {
            return value;
        }
        else if (!validateAttribs(attribs)) {
            throw new Error ('Attribs mismatch');
        }
        var out = value;
        attribs.forEach(function (attrib) {
            var regex = new RegExp(
                        '([\\n\\r\\t\\s]*' + attrib + '=\\"[^\\"]*\\")',
                    'gim'
                );
            out = out.replace(regex, '');
        });
        return out;
    }

    Object.defineProperties(StripTagsFilter, {
        SPACE_REGEX_PARTIAL:  {value:'[\\n\\r\\t\\s]*', enumerable: true},
        NAME_REGEX_PARTIAL:   {value:'[a-z][a-z\\-\\d]*', enumerable: true},
        ATTRIB_REGEX_PARTIAL: {value:'[\\n\\r\\t\\s]*[a-z][a-z\\-\\d]*=\\"[^\\"]*\\"', enumerable: true},
        filter: {
            value: function (value, tags, attribs, removeComments) {
                var out = stripTags(removeComments ? stripComments(value) : value, tags, attribs);
                return sjl.isEmptyOrNotOfType(attribs, Array) ? out :
                    stripAttribs(out, attribs);
            },
            enumerable: true
        }
    });

    if (!isNodeJs) {
        sjl.ns('filter.StripTagsFilter', StripTagsFilter);
        return StripTagsFilter;
    }
    else {
        module.exports = StripTagsFilter;
    }

}());


/**
 * Created by Ely on 7/24/2014.
 * This is a crude implementation
 * @todo review if we really want to have fallback value
 *      functionality for javascript
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        ValidatorChain = sjl.validator.ValidatorChain,
        FilterChain = sjl.filter.FilterChain,
        Extendable = sjl.stdlib.Extendable,
        contextName = 'sjl.input.Input',
        Input = function Input(options) {
            var _allowEmpty = false,
                _continueIfEmpty = true,
                _breakOnFailure = false,
                _fallbackValue,
                _filterChain = null,
                _alias = '',
                _required = true,
                _validatorChain = null,
                _value,
                _rawValue,
                _filteredValue,

                // Protect from adding programmatic validators, from within `isValid`, more than once
                _validationHasRun = false;

            Object.defineProperties(this, {
                allowEmpty: {
                    get: function () {
                        return _allowEmpty;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'allowEmpty', value, Boolean);
                        _allowEmpty = value;
                    }
                },
                continueIfEmpty: {
                    get: function () {
                        return _continueIfEmpty;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'continueIfEmpty', value, Boolean);
                        _continueIfEmpty = value;
                    }
                },
                breakOnFailure: {
                    get: function () {
                        return _breakOnFailure;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'breakOnFailure', value, Boolean);
                        _breakOnFailure = value;
                    }
                },
                fallbackValue: {
                    get: function () {
                        return _fallbackValue;
                    },
                    set: function (value) {
                        if (typeof value === 'undefined') {
                            throw new TypeError('Input.fallbackValue cannot be set to an undefined value.');
                        }
                        _fallbackValue = value;
                    }
                },
                filterChain: {
                    get: function () {
                        if (!sjl.isset(_filterChain)) {
                            _filterChain = new FilterChain();
                        }
                        return _filterChain;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'filterChain', value, FilterChain);
                        _filterChain = value;
                    }
                },
                validators: {
                    get: function () {
                        return this.validatorChain.validators;
                    },
                    set: function (value) {
                        this.validatorChain.addValidators(value);
                    }
                },
                filters: {
                    get: function () {
                        return this.filterChain.filters;
                    },
                    set: function (value) {
                        this.filterChain.addFilters(value);
                    }
                },
                alias: {
                    get: function () {
                        return _alias;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'alias', value, String);
                        _alias = value;
                    }
                },
                required: {
                    get: function () {
                        return _required;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'required', value, Boolean);
                        _required = value;
                    }
                },
                validatorChain: {
                    get: function () {
                        if (!sjl.isset(_validatorChain)) {
                            _validatorChain = new ValidatorChain();
                        }
                        return _validatorChain;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'validatorChain', value, ValidatorChain);
                        _validatorChain = value;
                    }
                },
                value: {
                    get: function () {
                        return _value;
                    },
                    set: function (value) {
                        if (sjl.isUndefined(value)) {
                            throw new TypeError('Input.value cannot be set to an undefined value.');
                        }
                        _value = value;
                    }
                },
                rawValue: {
                    get: function () {
                        return _rawValue;
                    },
                    set: function (value) {
                        if (typeof value === 'undefined') {
                            throw new TypeError('Input.rawValue cannot be set to an undefined value.');
                        }
                        _rawValue = value;
                    }
                },
                filteredValue: {
                    get: function () {
                        return _filteredValue;
                    },
                    set: function (value) {
                        if (sjl.isUndefined(value)) {
                            throw new TypeError(contextName + '.filteredValue doesn\'t allow `undefined` values.');
                        }
                        _filteredValue = value;
                    }
                },
                messages: {
                    get: function () {
                        return this.validatorChain.messages;
                    },
                    set: function (value) {
                        this.validatorChain.messages = value;
                    }
                },
                validationHasRun: {
                    get: function () {
                        return _validationHasRun;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'validationHasRun', value, Boolean);
                        _validationHasRun = value;
                    }
                },
            });

            if (sjl.classOfIs(options, String)) {
                this.alias = options;
            }
            else if (sjl.classOfIs(options, Object)) {
                sjl.extend(this, options);
            }

            // Set raw value
            if (this.value && sjl.isUndefined(this.rawValue)) {
                this.rawValue = this.value;
            }
        };

    Input = Extendable.extend(Input, {

        isValid: function (value) {

            var self = this,

                // Get the validator chain, value and validate
                validatorChain = self.validatorChain,
                valueToTest = this.resolveValueToTest(value),
                isValid,
                retVal;

            // Clear messages
            self.clearMessages();

            // Ensure raw value
            self.rawValue = valueToTest;

            // Check whether we need to add an empty validator
            if (!self.validationHasRun && self.continueIfEmpty) {
                validatorChain.addValidator(new sjl.validator.NotEmptyValidator());
            }

            // Get whether is valid or not
            isValid = validatorChain.isValid(valueToTest);

            // Run filter if valid
            if (isValid) {
                retVal = true;
                self.value =
                    self.filteredValue =
                        this.filter(valueToTest);
            }
            // Get fallback value if any
            else if (!isValid && self.hasFallbackValue()) {
                self.value = self.fallbackValue;
                retVal = true;
            }
            else {
                retVal = false;
            }

            // Protect from adding programmatic validators more than once..
            if (!self.validationHasRun) {
                self.validationHasRun = true;
            }

            return retVal;
        },

        validate: function (value) {
            return this.isValid.apply(this, arguments);
        },

        filter: function (value) {
            return this.filterChain.filter(sjl.isUndefined(value) ? this.rawValue : value);
        },

        resolveValueToTest: function (value) {
            return !sjl.isUndefined(value) ? value :
                (!sjl.isUndefined(this.rawValue) ? this.rawValue : this.value);
        },

        hasFallbackValue: function () {
            return typeof this.fallbackValue !== 'undefined';
        },

        clearMessages: function () {
            this.validatorChain.clearMessages();
            return this;
        },

        addValidators: function (validators) {
            this.validatorChain.addValidators(validators);
            return this;
        },

        addValidator: function (validator) {
            this.validatorChain.addValidator(validator);
            return this;
        },

        prependValidator: function (validator) {
            this.validatorChain.prependValidator(validator);
            return this;
        },

        mergeValidatorChain: function (validatorChain) {
            this.validatorChain.mergeValidatorChain(validatorChain);
            return this;
        },

        addFilters: function (filters) {
            this.filterChain.addFilters(filters);
            return this;
        },

        addFilter: function (filter) {
            this.filterChain.addFilter(filter);
            return this;
        },

        prependFilter: function (filter) {
            this.filterChain.prependFilter(filter);
            return this;
        },

        mergeFilterChain: function (filterChain) {
            this.filterChain.mergeFilterChain(filterChain);
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = Input;
    }
    else {
        sjl.ns('input.Input', Input);
        if (window.__isAmd) {
            return Input;
        }
    }

})();

/**
 * Created by elydelacruz on 5/21/16.
 * @todo refactor input filter to not require `alias`es for Input configs unless method requires it.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Input = sjl.input.Input,
        contextName = 'sjl.input.InputFilter',
        validateNonEmptyKey = function (key, methodName) {
            sjl.throwTypeErrorIfEmpty(contextName + '.' + methodName, 'key', key, String);
        },
        InputFilter = function InputFilter(options) {
            var _data = {},
                _inputs = {},
                _invalidInputs = {},
                _validInputs = {},
                _messages = {};

            Object.defineProperties(this, {
                data: {
                    get: function () {
                        return _data;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'data', value, Object);
                        _data = value;
                        this._setDataOnInputs(_data, _inputs);
                    },
                    enumerable: true
                },
                inputs: {
                    get: function () {
                        return _inputs;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'inputs', value, Object);
                        if (sjl.empty(value)) {
                            _inputs = {};
                        }
                        _inputs = this._setInputsOnInputs(value, _inputs);
                    },
                    enumerable: true
                },
                invalidInputs: {
                    get: function () {
                        return _invalidInputs;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'invalidInputs', value, Object);
                        _invalidInputs = value;
                    },
                    enumerable: true
                },
                validInputs: {
                    get: function () {
                        return _validInputs;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'validInputs', value, Object);
                        _validInputs = value;
                    },
                    enumerable: true
                },
                messages: {
                    get: function () {
                        return _messages;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'messages', value, Object);
                        _messages = value;
                    },
                    enumerable: true
                }
            });

            if (sjl.isObject(options)) {
                sjl.extend(this, options);
            }
        };

    InputFilter = sjl.stdlib.Extendable.extend(InputFilter, {

        addInput: function (input) {
            return this._addInputOnInputs(input, this.inputs);
        },

        addInputs: function (inputs) {
            sjl.throwTypeErrorIfEmpty(contextName + '.addInputs', 'inputs', inputs, Object);
            this._setInputsOnInputs(inputs, this.inputs);
            return this;
        },

        getInput: function (key) {
            validateNonEmptyKey(key, 'get');
            return this.inputs[key];
        },

        hasInput: function (key) {
            validateNonEmptyKey(key, 'get');
            return this.isInput(this.inputs[key]);
        },

        isInput: function (input) {
            return input instanceof Input;
        },

        removeInput: function (key) {
            var inputs = this.inputs,
                retVal;
            if (inputs.hasOwnProperty(key)) {
                retVal = inputs[key];
                sjl.unset(inputs, key);
            }
            return retVal;
        },

        isValid: function () {
            var self = this;

            self.clearInvalidInputs()
                .clearValidInputs()
                .clearMessages();

            // If no data bail and throw an error
            if (sjl.empty(self.inputs)) {
                throw new Error(contextName + '.isValid could\'nt ' +
                    'find any inputs to validate.  Set the `.inputs` property.');
            }
            else if (sjl.empty(self.data)) {
                throw new Error(contextName + '.isValid could\'nt ' +
                    'find any data for validation.  Set the data on `.data` property.');
            }

            // Set data on inputs and validate inputs
            return self._validateInputs();
        },

        validate: function () {
            return this.isValid.apply(this, arguments);
        },

        filter: function () {
            return this._filterInputs();
        },

        getRawValues: function () {
            var self = this,
                rawValues = {};
            sjl.forEachInObj(self.inputs, function (input, key) {
                if (!self.invalidInputs.hasOwnProperty(key)) {
                    rawValues[key] = input.rawValue;
                }
            });
            return rawValues;
        },

        getValues: function () {
            var self = this,
                values = {};
            sjl.forEachInObj(self.inputs, function (input, key) {
                if (!self.invalidInputs.hasOwnProperty(key)) {
                    values[key] = input.value;
                }
            });
            return values;
        },

        getMessages: function () {
            var self = this,
                messages = self.messages;
            sjl.forEachInObj(this.invalidInputs, function (input) {
                var messageItem;
                if (sjl.notEmptyAndOfType(input, Input)) {
                    messageItem = messages[input.alias];
                }
                if (messageItem) {
                    messages[input.alias] = messageItem.concat(input.messages);
                }
                else {
                    messages[input.alias] = input.messages;
                }
            });
            return messages;
        },

        mergeMessages: function (messages) {
            sjl.throwTypeErrorIfNotOfType(contextName + '.mergeMessages', 'messages', messages, Object);
            Object.keys(messages).forEach(function (key) {
                this.messages[key] = messages[key].concat(sjl.isset(this.messages[key]) ? this.messages[key] : []);
            }, this);
            return this;
        },

        clearMessages: function () {
            this.messages = {};
            return this;
        },

        clearValidInputs: function () {
            this.validInputs = {};
            return this;
        },

        clearInputs: function () {
            this.inputs = {};
            return this;
        },

        clearInvalidInputs: function () {
            this.invalidInputs = {};
            return this;
        },

        _addInputOnInputs: function (input, inputs) {
            if (this.isInput(input)) {
                inputs[input.alias] = input;
            }
            else if (sjl.isObject(input)) {
                inputs[input.alias] = this._inputHashToInput(input);
            }
            else {
                throw new TypeError(contextName + '._addInputOnInputs expects ' +
                    'param 1 to be of type `Object` or `Input`.  Type received: ' +
                    '`' + sjl.classOf(input) + '`.');
            }
            return this;
        },

        _setDataOnInputs: function (data, inputs) {
            sjl.throwTypeErrorIfNotOfType(contextName + '._setDataOnInputs', 'data', data, Object);
            sjl.throwTypeErrorIfNotOfType(contextName + '._setDataOnInputs', 'inputs', inputs, Object);
            Object.keys(data).forEach(function (key) {
                inputs[key].rawValue = data[key];
            });
            return inputs;
        },

        _setInputsOnInputs: function (inputs, inputsOn) {
            // Loop through incoming inputs
            sjl.forEachInObj(inputs, function (input, key) {
                input.alias = key;
                this._addInputOnInputs(input, inputsOn);
            }, this);

            // Return this
            return inputsOn;
        },

        _inputHashToInput: function (inputHash) {
            sjl.throwTypeErrorIfEmpty(contextName + '_inputHashToInput', 'inputHash.alias', inputHash.alias, String);
            return new Input(inputHash);
        },

        _validateInput: function (input, dataMap) {
            dataMap = dataMap || this.data;
            var name = input.alias,
                dataExists = sjl.isset(dataMap[name]),
                data = dataExists ? dataMap[name] : null,
                required = input.required,
                allowEmpty = input.allowEmpty,
                continueIfEmpty = input.continueIfEmpty,
                retVal = true;

            if (dataExists) {
                input.rawValue = dataMap[name];
            }

            // If data doesn't exists and input is not required
            if (!dataExists && !required) {
                retVal = true;
            }

            // If data doesn't exist, input is required, and input allows empty value,
            // then input is valid only if continueIfEmpty is false;
            else if (!dataExists && required && allowEmpty && continueIfEmpty) {
                retVal = true;
            }

            // If data exists, is empty, and not required
            else if (dataExists && sjl.empty(data) && !required) {
                retVal = true;
            }

            // If data exists, is empty, is required, and allows empty,
            // then input is valid if continue if empty is false
            else if (dataExists && sjl.empty(data) && required
                && allowEmpty && !continueIfEmpty) {
                retVal = true;
            }

            else if (!input.isValid()) {
                retVal = false;
            }

            return retVal;
        },

        _validateInputs: function (inputs, data) {
            data = data || this.data;
            inputs = inputs || this.inputs;
            var self = this;

            // Validate inputs
            sjl.forEach(inputs, function (input, key) {
                sjl.throwTypeErrorIfNotOfType(contextName + '._validateInputs', 'inputs[input]', input, Input);
                if (self._validateInput(input, data)) {
                    self.validInputs[key] = input;
                }
                else {
                    self.invalidInputs[key] = input;
                }
            });

            // If no invalid inputs then validation passed
            return sjl.empty(self.invalidInputs);
        },

        _filterInputs: function () {
            sjl.forEach(this.inputs, function (input) {
                this._filterInput(input);
            }, this);
            return this;
        },

        _filterInput: function (input) {
            input.value =
                input.filteredValue =
                    input.filter();
            return input;
        },

        _validatorsFromInputHash: function (inputHash) {
            return Array.isArray(inputHash.validators, Array) ? inputHash.validators : null;
        },

        _filtersFromInputHash: function (inputHash) {
            return Array.isArray(inputHash.filters, Array) ? inputHash.filters: null;
        }

    });

    if (isNodeEnv) {
        module.exports = InputFilter;
    }
    else {
        sjl.ns('input.InputFilter', InputFilter);
        if (window.__isAmd) {
            return InputFilter;
        }
    }

})();
