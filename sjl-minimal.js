/**! sjl-minimal.js 5.6.89 
 * | License: GPL-2.0+ AND MIT 
 * | md5checksum: bf0283a6d9b16eb3360077f6423be59f 
 * | Built-on: Thu Apr 28 2016 02:25:44 GMT-0400 (EDT) 
 **/
/**
 * The `sjl` module.
 * @module sjl {Object}
 * @created by Ely on 5/29/2015.
 * @todo Cleanup jsdocs and make them more readable where possible (some of the jsdoc definitions in sjljs's source files are old and need to be written using es5 and es6 kind of language to make them more readable to the user (also since most of the functionality is es5/es6ish makes sense to perform this upgrade).
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
        makeCopyOfArray = classOfIs(makeCopyOfArray, 'Boolean') ? makeCopyOfArray : true;
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
                'be of type `String` or an instance of `Function`.  Type recieved: ' + classOfType + '.');
        }
        return classOf(obj) === (
                classOfType === String.name ? type : type.name
            );
    }

    /**
     * Check if `value` is of one of the passed in types.
     * @param value {*}
     * @param type {Function|String} - Constructor or string.
     * @returns {boolean}
     */
    function classOfIsMulti (value, type /**[,type...] **/) {
        return (sjl.restArgs(arguments, 1)).some(function (_type) {
            return classOfIs(value, _type);
        });
    }

    function isNumber (value) {
        return classOfIs(value, Number);
    }

    function isFunction (value) {
        return classOfIs(value, Function);
    }

    function isArray (value) {
        return Array.isArray(value);
    }

    function isBoolean (value) {
        return classOfIs(value, Boolean);
    }

    function isObject (value) {
        return classOfIs(value, Object);
    }

    function isString(value) {
        return classOfIs(value, String);
    }

    function isUndefined (value) {
        return classOfIs(value, 'Undefined');
    }

    function isNull (value) {
        return classOfIs(value, 'Null');
    }

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
     * Checks to see if any of the values passed in are empty (null, undefined, empty object, empty array, or empty string}.
     * @params {*} - One or more params of any type.
     * @returns {Boolean} - Returns true if any of the values passed
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
     * // Will set 'hello.what.is.your.name' to 'whuan'
     *
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
                if (classOfIs(p[prop], Object)
                    && classOfIs(o[prop], Object)
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
        if (classOfIs(superclass, Function)) {
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
                + '  Type recieved: ' + classOfValue + '`.');
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

    // Define `sjl`
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
        defineEnumProp(sjl,     'filter',       sjl.ns('filter'));
        defineEnumProp(sjl,     'input',        sjl.ns('input'));
        defineEnumProp(sjl,     'stdlib',       sjl.ns('stdlib'));
        defineEnumProp(sjl,     'utils',        sjl.ns('utils'));
        defineEnumProp(sjl,     'validator',    sjl.ns('validator'));

        // Export sjl globally
        globalContext.sjl = sjl;

        // Return sjl if amd is being used
        if (globalContext.__isAmd) {
            return sjl;
        }
    }

}());
