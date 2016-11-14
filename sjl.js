/**! sjljs 6.2.0
 * | License: GPL-2.0+ AND MIT
 * | md5checksum: 85423b48f544a37e343f4873d7e61a21
 * | Built-on: Sun Nov 13 2016 22:03:21 GMT-0500 (Eastern Standard Time)
 **//**
 * The `sjl` module definition.
 * @created by Ely on 5/29/2015.
 */
(function () {

    'use strict';

    var sjl,
        _String = String.name,
        _Function = Function.name,
        _Array = Array.name,
        _Number = Number.name,
        _Object = Object.name,
        _Boolean = Boolean.name,
        _Null = 'Null',
        _Undefined = 'Undefined',
        _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        slice = Array.prototype.slice,
        globalContext = isNodeEnv ? global : window,
        PlaceHolder = function PlaceHolder() {},
        __ = new PlaceHolder();

    // Check if amd is being used (store this check globally to reduce
    //  boilerplate code in other components).
    globalContext.__isAmd = typeof define === 'function' && define.amd;

    /**
     * Composes one or more functions into a new one.
     * @function module:sjl.compose
     * @returns {Function}
     */
    function compose (/* [func,] */) {
        var args = argsToArray(arguments);
        return function (arg0) {
            return args.reduceRight(function (value, arg){
                return arg(value);
            }, arg0);
        };
    }

    /**
     * @function module:sjl.curry
     * @param fn {Function}
     * @returns {Function}
     */
    function curry (fn) {
        var curriedArgs = restArgs(arguments, 1);
        return function () {
            var concatedArgs = curriedArgs.concat(argsToArray(arguments));
            return fn.apply(null, concatedArgs);
        };
    }

    /**
     * Curries a function and only executes the function when the arity reaches the .
     * @function module:sjl.curryN
     * @param func - Function to curry.
     * @param executeArity - Arity at which to execute curried function.
     */
    function curryN (func, executeArity) {
        var curriedArgs = restArgs(arguments, 2);
        return function () {
            var concatedArgs = curriedArgs.concat(argsToArray(arguments));
            return concatedArgs.length < executeArity ?
                curryN.apply(null, [func, executeArity].concat(concatedArgs)) :
                func.apply(null, concatedArgs);
        };
    }

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
     * @param start {Number|undefined}
     * @param [end] {Number|undefined} - Optional.  Default `args.length`.
     * @returns {Array}
     */
    function restArgs (args, start, end) {
        end = end || args.length;
        return slice.call(args, start, end);
    }

    /**
     * Extracts a value at an `index` of passed in array (alternately only extract the value if it is of `type`).
     * Returns an array with two elements: Element `1` contains the extracted value and element `2` the resulting
     * array of the extraction (copy of original array with extracted element) of the value at `index`.
     * @function module:sjl.extractFromArrayAt
     * @param array {Array} - Array to extract from.
     * @param index {Number} - Index of element to look for in `array`.
     * @param type {String|Function} - Type (name or constructor) to match on.  Optional.
     * @param makeCopyOfArray {Boolean|Undefined} - Whether to make a copy of the array or not.  Default `true`.
     * @returns {Array<*,Array>} - If passed in array has an element at `index` (and alternately) element
     *  matches `type` then returns an array with found value at index and resulting array of extraction of said value.
     *  Else returns an array containing `null` and passed in array.
     */
    function extractFromArrayAt (array, index, type, makeCopyOfArray) {
        makeCopyOfArray = isBoolean(makeCopyOfArray) ? makeCopyOfArray : true;
        var retVal = [null, array],
            matchesType, foundElement,
            subject,
            splicedArray;
        if (array.hasOwnProperty(index + '')) {
            subject = makeCopyOfArray ? array.slice() : array;
            matchesType = issetAndOfType(type, _String) ? classOfIs(subject[index], type) : true;
            if (matchesType) {
                splicedArray = subject.splice(index, 1);
                foundElement = splicedArray.length > 0 ? splicedArray[0] : null;
                retVal = [foundElement, subject];
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
            retVal = _Undefined;
        }
        else if (value === null) {
            retVal = _Null;
        }
        else {
            toString = value.toString.name === 'toString' ? Object.prototype.toString : value.toString;
            valueType = toString.call(value);
            retVal = valueType.substring(8, valueType.length - 1);
            if (retVal === _Number && isNaN(value)) {
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
     */
    function classOfIs (obj, type) {
        var classOfType = classOf(type),
            typeIsFunction = type instanceof Function;
        if (classOfType !== String.name && !typeIsFunction) {
            throw new TypeError('sjl.classOfIs expects it\'s `type` parameter to' +
                'be of type `String` or an instance of `Function`.  Type received: ' + classOfType + '.');
        }
        return (typeIsFunction ? obj instanceof type : false) ||
            classOf(obj) === (classOfType === _String ? type : type.name);
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
            case _Array:
            case 'Set':
            case 'SjlSet':
            case 'SjlMap':
            case 'Map':
                arrayLike.forEach(callback, context);
            break;
            case _Object:
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
     * Checks if value is a valid number (also checks if isNaN so that you don't have to).
     * @function module:sjl.isNumber
     * @param value {*}
     * @returns {Boolean}
     */
    function isNumber (value) {
        return classOfIs(value, _Number);
    }

    /**
     * Returns whether a value is a function or not.
     * @function module:sjl.isFunction
     * @param value {*}
     * @returns {Boolean}
     */
    function isFunction (value) {
        return classOfIs(value, _Function);
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
        return classOfIs(value, _Boolean);
    }

    /**
     * Checks whether value is an object or not.
     * @function module:sjl.isObject
     * @param value
     * @returns {Boolean}
     */
    function isObject (value) {
        return classOfIs(value, _Object);
    }

    /**
     * Checks whether value is a string or not.
     * @function module:sjl.isString
     * @param value {*}
     * @returns {Boolean}
     */
    function isString(value) {
        return classOfIs(value, _String);
    }

    /**
     * Checks if value is undefined.
     * @function module:sjl.isUndefined
     * @param value {*}
     * @returns {Boolean}
     */
    function isUndefined (value) {
        return classOfIs(value, _Undefined);
    }

    /**
     * Checks if value is null.
     * @function module:sjl.isNull
     * @param value {*}
     * @returns {Boolean}
     */
    function isNull (value) {
        return classOfIs(value, _Null);
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
        if (classOfValue === _Array || classOfValue === _String) {
            retVal = value.length === 0;
        }

        else if ((classOfValue === _Number && value !== 0) || (classOfValue === _Function)) {
            retVal = false;
        }

        else if (classOfValue === _Object) {
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
        if (classOfObjToSearch !== _Object && objToSearch instanceof Function === false) {
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
        var retVal = '',
            prototypeOfList = Object.getPrototypeOf(list);
        if (isArray(list)) {
            retVal = list.join(separator);
        }
        else if (prototypeOfList.constructor.name === 'Set' || prototypeOfList.constructor.name === 'SjlSet') {
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
        if (classOfObj !== _Object && objToSearch instanceof Function === false) {
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
        return notEmptyAndOfType(obj[method], _Function);
    }

    /**
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is overwritten.
     * @param o {*} - *object to extend
     * @param p {*} - *object to extend from
     * @param deep {Boolean} - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
     * @todo rename these variables to be more readable.
     * @returns {*} - returns o
     */
    function extend(o, p, deep) {
        // If `o` or `p` are not set bail
        if (!isset(o) || !isset(p)) {
            return o;
        }

        // Merge all props from `p` to `o`
        Object.keys(p).forEach(function (prop) { // For all props in p.
            // If property is present on target (o) and is not writable, skip iteration
            var propDescription = Object.getOwnPropertyDescriptor(o, prop);
            if (propDescription && (!isset(propDescription.get) &&
                !isset(propDescription.set)) && !propDescription.writable) {
                return;
            }
            if (deep === true) {
                if (isObject(p[prop]) && isObject(o[prop]) && !isEmptyObj(p[prop])) {
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
     * @returns {Function}
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
     * Defines a class using a `superclass`, `constructor`, methods and/or static methods.
     * @format sjl.defineSubClass (superclass, methodsAndConstructor, statics);
     * @format sjl.defineSubClass (superclass, constructor, methods, statics);
     * @function module:sjl.defineSubClass
     * @param superclass {Function} - Superclass to inherit from.
     * @param constructor {Function|Object} - Required.  Note:  If this param is an object, then other params shift over by 1 (`methods` becomes `statics` and this param becomes `methods` (constructor key expected else empty stand in constructor is used).
     * @param methods {Object|undefined} - Methods for prototype.  Optional.  Note:  If `constructor` param is an object, this param takes the place of the `statics` param.
     * @param statics {Object|undefined} - Constructor's static methods.  Optional.  Note:  If `constructor` param is an object, this param is not used.
     * @example
     * ```
     *  // sjl.defineSubClass (superclass, methods, statics);
     *  var NewConstructor = sjl.defineSubClass( SomeConstructor, { constructor: function SomeOtherConstructor () {}, ...}, {...});
     *
     *  // sjl.defineSubClass (superclass, constructor, methods, statics);
     *  var NewConstructor = sjl.defineSubClass( SomeConstructor, function SomeOtherConstructor () {}, {...}, {...});
     *
     *  // Both calls above yield extendable constructors;  E.g.,
     *  // This call yields another constructor which inherits from NewConstructor and is also extendable (has `extend` static method).
     *  NewConstructor.extend(AnotherConstructor)
     *
     * ```
     * @returns {Function}
     */
    function defineSubClass (superclass,  // Constructor of the superclass
                                   constructor, // The constructor for the new subclass
                                   methods,     // Instance methods: copied to prototype
                                   statics)     // Class properties: copied to constructor
    {
        // Resolve superclass
        superclass = superclass || Object.create(Object.prototype);

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

        // If `constructor` param is an object then assume [superclass, methods, statics] params order
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
         * @param constructor {Function|Object} - Required.  Note: if is an object, then other params shift over by 1 (`methods` becomes `statics` and this param becomes `methods`).
         * @param methods {Object|undefined} - Methods.  Optional.  Note:  If `constructor` param is an object, it is cast as `statics` param.
         * @param statics {Object|undefined} - Static methods.  Optional.  Note:  If `constructor` param is an object, it is not used.
         */
        sjl.defineEnumProp(constructor, 'extend', function (constructor_, methods_, statics_) {
            return defineSubClass(constructor, constructor_, methods_, statics_);
        });

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
        return addRevealingModuleCall(obj, funcKey, altFuncKey);
    }

    /**
     * Revealing module pattern seeder.  Adds the revealing module pattern call to passed in object.  Gives said object
     * the revealing module pattern capability (for in browser use).
     * @example
     * ```
     *  var myApp = sjl.addRevealingModuleCall ({}, 'module');
     *
     *  // Creates all namespace objects, if they don't already exist, and protects them from being overwritten (uses Object.defineProper(ty|ties) internally)
     *  // Then sets your module at the end of the chain also making it `unconfigurable` and `unwritable` as a property
     *  // on the namespace chain though does not protect MyModule itself from being tampered with (for security on
     *  // that level look into `Object.freeze`).
     *  myApp.module('some.deep.namespace.MyModule', MyModule); // returns MyModule
     *
     *  // Fetching module that was set now becomes cleaner and module will always be there and cannot be deleted from location
     *  myApp.some.namespace.MyModule === MyModule; // true
     *
     * ```
     *
     * @note For similar a effect on the server side @see sjl.nodejs or 'sjljs/src/nodejs/Namespace' (
     *  creates a dynamic module loader using object namespaces).
     * @function module:sjl.addRevealingModuleCall
     * @param obj {Object|*} - Object to set the revealing module pattern method on.
     * @param functionKey {String} - Key to set the revealing module setter and store to.  Default 'module'.
     * @param shortFunctionKey {String} - Shorthand name to use for revealing module setter and store.  Default 'ns'.
     * @return {Object|*} - Returns passed in `obj`.
     */
    function addRevealingModuleCall (obj, functionKey, shortFunctionKey) {
        functionKey = functionKey || 'module';
        /**
         * Revealing module function/method.
         * @note If `nsString` is undefined returns the protected modules/packages object itself.
         * @param nsString {String} - Namespace string or just property name itself.
         * @param value {*} - If passed in function/method acts as a setter.
         * @returns {*} - Returns whatever is found
         */
        obj[shortFunctionKey || 'ns'] =
            obj[functionKey] = function (nsString, value) {
                return sjl.isUndefined(nsString) ?
                    obj[functionKey] : unConfigurableNamespace(nsString, obj[functionKey], value);
            };

        // Return namespace function
        return obj[functionKey];
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
     * @param [suffix] {String|*} - A hint to user or a way to fix the error;  Message to suffix to error message.  Optional.
     * @throws {TypeError}
     * @returns {void}
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
     * @function module:sjl.throwErrorIfEmptyOrNotOfType
     * @param prefix {String} - String to prefix to message.
     * @param paramName {String} - Param that expected a non empty value (hint for user).
     * @param value {*} - Value to check.
     * @param type {String|Function|undefined|null} - Type to check against.  Optional.
     * @param suffix {*} - String to append to message.
     * @throws {TypeError}
     * @returns {void}
     */
    function throwTypeErrorIfEmptyOrNotOfType (prefix, paramName, value, type, suffix) {
        var classOfValue = classOf(value),
            issetType = isset(type);

        // If `type` itself is not of the allowed types throw an error
        if (issetType && !isString(type) && !isFunction(type)) {
            throw new TypeError('`sjl.throwTypeErrorIfEmptyOrNotOfType.type` only accepts strings, functions (constructors),' +
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
     * Same as sjl.throwErrorIfEmptyOrNotType but named shorter.
     * @see sjl.throwErrorIfEmptyOrNotType for full function description and param descriptions.
     * @function module:sjl.throwTypeErrorIfEmpty
     * @param prefix {String}
     * @param paramName {String}
     * @param value {String}
     * @param type {String|Function|undefined}
     * @param suffix {String}
     * @throws {TypeError}
     * @returns {void}
     */
    function throwTypeErrorIfEmpty (prefix, paramName, value, type, suffix) {
        throwTypeErrorIfEmptyOrNotOfType (prefix, paramName, value, type, suffix);
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
            retVal = issetAndOfType.apply(null, [value].concat(sjl.restArgs(arguments, 2))) ? value : defaultValue;
        }
        else {
            retVal = isset(value) ? value : defaultValue;
        }
        return retVal;
    }

    /**
     * Sets an enumerable property on `obj` as not `configurable` and not `writable`.
     * @function module:sjl.defineEnumProp
     * @param obj {Object}
     * @param key {String} - Prop name.
     * @param value {*}
     * @return {void}
     */
    function defineEnumProp(obj, key, value) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true
        });
    }

    /**
     * Sets namespace string on obj and makes namespace configurable (@see Object.defineProper(ty|ties)).
     * @param ns_string {String} - Namespace string; E.g., 'all.your.base'
     * @param objToSearch {Object} - Object to set namespace string on.
     * @param valueToSet {*|undefined} - Value to set at end of namespace string.
     * @returns {*} - Value that was set at the end of the namespace propagation.
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
        throwTypeErrorIfNotOfType(thisFuncsName, 'str', str, _String);

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
     * @note Method does not create a new array when doing extraction and alters originally passed in array.
     * @param array {Array}
     * @param startOrEndBln {Boolean}
     * @returns {Boolean}
     */
    function extractBoolFromArray(array, startOrEndBln) {
        var extractedValue = extractFromArrayAt(
            array,
            startOrEndBln ? 0 : array.length - 1,
            _Boolean,
            false
        )[0];
        return isBoolean(extractedValue) ? extractedValue : false;
    }

    /**
     * Returns boolean from beginning of array if any.  If item at beginning of array is undefined returns `false`.
     * @note Method does not create a new array when doing extraction and alters originally passed in array.
     * @function module:sjl.extractBoolFromArrayStart
     * @param array {Array}
     * @returns {Boolean}
     */
    function extractBoolFromArrayStart (array) {
        return extractBoolFromArray(array, true);
    }

    /**
     * Returns boolean from end of array if any.  If item at found there is undefined or not a boolean returns `false`.
     * @note Method does not create a new array when doing extraction and alters originally passed in array.
     * @function module:sjl.extractBoolFromArrayEnd
     * @param array {Array}
     * @returns {Boolean}
     */
    function extractBoolFromArrayEnd (array) {
        return extractBoolFromArray(array, false);
    }

    /**
     * Merges property values from object 2 to object 1 where possible (where property is writable or has getters and setters).
     * @function module:sjl.mergeOnProps
     * @param obj1 {Object}
     * @param obj2 {Object}
     * @param deep {Boolean} - Optional.  Default `false`.
     * @returns {Object} - Passed in object at param 1.
     */
    function mergeOnProps (obj1, obj2, deep) {
        deep = isBoolean(deep) ? deep : false;
        Object.keys(obj1).forEach(function (key) {
            if (!obj2.hasOwnProperty(key)) {
                return;
            }
            extendMulti(deep, obj1[key], obj2[key]);
        });
        return obj1;
    }

    /**
     * A strict version of sjl.extend;  I.e., only merges on properties existing on `obj1`.
     * @function module:sjl.mergeOnPropsMulti
     * @param obj1 {Object|Boolean} - If this param is set to a boolean then deep merge takes place.
     * @param [obj2,] {Object} - One or more objects to operate on.
     * @note In the case of `obj1` being a boolean method will expect 2 or more objects following param `obj1`.
     * @returns {*}
     */
    function mergeOnPropsMulti (obj1, obj2) {
        var args = argsToArray(arguments),
            deep = extractBoolFromArrayStart(args),
            arg0 = args.shift();

        // Extend object `0` with other objects
        args.forEach(function (arg) {
            if (!isObject(arg)) {
                return;
            }
            // Extend `arg0` with `arg`
            mergeOnProps(arg0, arg, deep);
        });

        return arg0;
    }

    /**
     * @param value
     * @returns {Boolean}
     */
    function hasIterator (value) {
        return isFunction(value[sjl.Symbol.iterator]);
    }

    /**
     * @param obj {*}
     * @returns {Iterator|undefined}
     */
    function getIterator (obj) {
        return obj[sjl.Symbol.iterator];
    }

    /**
     * @param iterator {Iterator}
     * @returns {Array}
     */
    function iteratorToArray (iterator) {
        var current = iterator.next(),
            out = [];
        while (current.done === false) {
            out.push(current.value);
        }
        return out;
    }

    /**
     * @allParams {*} - [,arrayLike {*}].  One or more array like objects.
     * @returns {Array|null}
     */
    function getArrayLikes (/* [,arrayLike] */) {
        return argsToArray(arguments).filter(function (arg) {
            return Array.isArray(arg) ||
                classOfIs(arg, 'Arguments') ||
                (isset(WeakSet) && classOfIs(arg, WeakSet)) ||
                (isset(sjl.stdlib.SjlSet) && classOfIs(arg, sjl.stdlib.SjlSet)) ||
                (isset(Set) && classOfIs(arg, Set));
        });
    }

    /**
     * @param obj {*}
     * @returns {Array<Array<*,*>>} - Array map.  I.e., [[key{*}, value{*}]].
     */
    function objToArrayMap (obj) {
        var keys = Object.keys(obj);
        if (keys.length === 0) {
            return [];
        }
        return keys.map(function (key) {
            return [key, obj[key]];
        });
    }

    /**
     * @param setObj {{entries: {Function}} | Set | WeakSet | Map | WeakMap | SjlSet | SjlMap} - Object with `entries` method.
     *  E.g., Set, WeakSet, Map, WeakMap, SjlSet, SjlMap
     * @returns {Array}
     */
    function setToArray (setObj) {
        var iterator = setObj.entries(),
            current = iterator.next(),
            out = [];
        while (current.done === false) {
            out.push(current.value);
            current = iterator.next();
        }
        return out;
    }

    /**
     * @param mapObj {{entries: {Function}} | Set | WeakSet | Map | WeakMap | SjlSet | SjlMap} - Object with `entries` method.
     * @returns {Array}
     */
    function mapToArray (mapObj) {
        return setToArray(mapObj);
    }

    /**
     * @param arrayLike {*}
     * @returns {Array|Undefined} - `Undefined` if couldn't find array like.
     */
    function arrayLikeToArray (arrayLike) {
        var out,
            classOfArrayLike = classOf(arrayLike);
        switch (classOfArrayLike) {
            case 'Arguments':
                out = argsToArray(arrayLike);
                break;
            case 'SjlSet':
            case 'WeakSet':
            case 'Set':
                out = setToArray(arrayLike);
                break;
            case 'Map':
            case 'WeakMap':
            case 'SjlMap':
                out = mapToArray(arrayLike);
                break;
            case 'Array':
                out = arrayLike;
                break;
            case 'String':
                out = arrayLike.split('');
                break;
            default:
                break;
        }
        return out;
    }

    /**
     * @param arrayLike {*}
     * @returns {Array|Undefined} - `Undefined` if couldn't find array like.
     */
    function notArrayLikeToArray (arrayLike) {
        var out,
            classOfArrayLike = classOf(arrayLike);
        switch (classOfArrayLike) {
            case 'Object':
                if (hasIterator(classOfArrayLike)) {
                    out = iteratorToArray(getIterator(classOfArrayLike));
                }
                else {
                    out = objToArrayMap(arrayLike);
                }
                break;
            case 'Number':
                out = arrayLike + ''.split('');
                break;
            case 'Function':
                out = toArray(arrayLike());
                break;
            default:
                // If can't operate on value throw an error
                if (classOfIsMulti(arrayLike, 'Null', 'Undefined', 'Symbol', 'Boolean')) {
                    throw new TypeError('`sjl.toArray` cannot operate on values of type' +
                        ' `Null`, `Undefined`, `Symbol`, `Boolean`.  ' +
                        'Value type passed in: `' + classOfArrayLike + '`.');
                }
                // Else wrap value in array and give a warning
                else {
                    console.warn('`sjl.toArray` has wrapped a value unrecognized to it.  ' +
                        'Value and type: ' + arrayLike + ', ', classOfArrayLike);
                    out = [arrayLike];
                }
                break;
        }
        return out;
    }

    /**
     * @param arrayLike {*}
     * @returns {Array|Undefined}
     */
    function toArray (arrayLike) {
        return arrayLikeToArray(arrayLike) ||
            notArrayLikeToArray(arrayLike);
    }

    /**
     * @returns {Array}
     */
    function concatArrayLikes (/* [,arrayLike] */) {
        return getArrayLikes.apply(null, arguments).reduce(function (arr1, arr2) {
            return arr1.concat(toArray(arr2));
        }, []);
    }

    /**
     * `sjl` module.
     * @module sjl {Object}
     * @type {{argsToArray: argsToArray, camelCase: camelCase, classOf: classOf, classOfIs: classOfIs, classOfIsMulti: classOfIsMulti, clone: clone, constrainPointer: constrainPointer, createTopLevelPackage: createTopLevelPackage, defineSubClass: defineSubClass, defineEnumProp: defineEnumProp, empty: isEmpty, emptyMulti: emptyMulti, extend: extendMulti, extractBoolFromArrayEnd: extractBoolFromArrayEnd, extractBoolFromArrayStart: extractBoolFromArrayStart, extractFromArrayAt: extractFromArrayAt, forEach: forEach, forEachInObj: forEachInObj, hasMethod: hasMethod, implode: implode, isset: isset, issetMulti: issetMulti, issetAndOfType: issetAndOfType, isEmpty: isEmpty, isEmptyObj: isEmptyObj, isEmptyOrNotOfType: isEmptyOrNotOfType, isArray: isArray, isBoolean: isBoolean, isFunction: isFunction, isNull: isNull, isNumber: isNumber, isObject: isObject, isString: isString, isSymbol: isSymbol, isUndefined: isUndefined, jsonClone: jsonClone, lcaseFirst: lcaseFirst, autoNamespace: autoNamespace, notEmptyAndOfType: notEmptyAndOfType, restArgs: restArgs, ucaseFirst: ucaseFirst, unset: unset, searchObj: searchObj, throwTypeErrorIfNotOfType: throwTypeErrorIfNotOfType, throwTypeErrorIfEmpty: throwTypeErrorIfEmpty, valueOrDefault: valueOrDefault, wrapPointer: wrapPointer}}
     */
    sjl = {
        argsToArray: argsToArray,
        arrayLikeToArray: arrayLikeToArray,
        notArrayLikeToArray: notArrayLikeToArray,
        autoNamespace: autoNamespace,
        camelCase: camelCase,
        classOf: classOf,
        classOfIs: classOfIs,
        classOfIsMulti: classOfIsMulti,
        clone: clone,
        compose: compose,
        concatArrayLikes: concatArrayLikes,
        constrainPointer: constrainPointer,
        createTopLevelPackage: createTopLevelPackage,
        curry: curry,
        curryN: curryN,
        curry1: __, // to appease IDEs and
        curry2: __, // ""
        curry3: __, // ""
        curry4: __, // ""
        curry5: __, // ""
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
        getIterator: getIterator,
        getArrayLikes: getArrayLikes,
        hasMethod: hasMethod,
        hasIterator: hasIterator,
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
        iteratorToArray: iteratorToArray,
        jsonClone: jsonClone,
        lcaseFirst: lcaseFirst,
        mapToArray: mapToArray,
        mergeOnProps: mergeOnProps,
        mergeOnPropsMulti: mergeOnPropsMulti,
        notEmptyAndOfType: notEmptyAndOfType,
        objToArrayMap: objToArrayMap,
        objToArray: objToArrayMap,
        restArgs: restArgs,
        searchObj: searchObj,
        setToArray: setToArray,
        throwTypeErrorIfNotOfType: throwTypeErrorIfNotOfType,
        throwTypeErrorIfEmptyOrNotOfType: throwTypeErrorIfEmptyOrNotOfType,
        throwTypeErrorIfEmpty: throwTypeErrorIfEmpty,
        toArray: toArray,
        ucaseFirst: ucaseFirst,
        unConfigurableNamespace: unConfigurableNamespace,
        unset: unset,
        valueOrDefault: valueOrDefault,
        wrapPointer: wrapPointer
    };

    // Add `sjl.curry[1-5]`
    (function () {
        var count = 1;
        while (count <= 5) {
            (function (curryLen) {
                sjl['curry' + curryLen] = function (fn) {
                    return curryN(fn, curryLen);
                };
            }(count));
            count += 1;
        }
    }());

    /**
     * Curries a function up to arity/args-length 1.
     * @function module:sjl.curry1
     * @return {Function}
     */
    /**
     * Curries a function up to arity/args-length 2.
     * @function module:sjl.curry2
     * @return {Function}
     */
    /**
     * Curries a function up to arity/args-length 3.
     * @function module:sjl.curry3
     * @return {Function}
     */
    /**
     * Curries a function up to arity/args-length 4.
     * @function module:sjl.curry4
     * @return {Function}
     */
    /**
     * Curries a function up to arity/args-length 5.
     * @function module:sjl.curry5
     * @return {Function}
     */

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
        /**
         * @namespace sjl.nodejs {sjl.nodejs.Namespace}
         */
        // Set package namespace and alias for it
        sjl.package = sjl.ns = new (require('./nodejs/Namespace'))(
            __dirname, ['.js', '.json']
        );

        // Short cut to namespaces
        Object.keys(sjl.ns).forEach(function (key) {
            sjl[key] = sjl.ns[key];
        });

        // Methods not needed for NodeJs environment
        unset(sjl, 'createTopLevelPackage');
        unset(sjl, 'addRevealingModuleCall');

        // Export `sjl`
        module.exports = sjl;
    }
    else {
        /**
         * Create top level frontend package.
         * @function module:sjl.package
         * @function module:sjl.ns
         */
        addRevealingModuleCall(sjl, 'package', 'ns');

        // Instantiate known namespaces and set them directly on `sjl` for ease of use;
        // E.g., Accessing `sjl.ns.stdlib.Extendable` now becomes `sjl.stdlib.Extendable`.
        // --------------------------------------------------------------------------------

        /**
         * Sjl Standard Library classes' namespace.
         * @namespace sjl.stdlib {Object}
         */
        defineEnumProp(sjl,     'stdlib',       sjl.ns('stdlib'));

        // Export sjl globally
        globalContext.sjl = sjl;

        // Return sjl if amd is being used
        if (globalContext.__isAmd) {
            return sjl;
        }
    }

}());

/**
 * Created by edlc on 11/13/16.
 * @todo find out best practice for naming functions that have side effects
 * @todo split out the `extend` method from `defineSubClass`
 */

(function () {

    'use strict';

    function addPropertyValue (context, value) {
        Object.defineProperty(context, 'value', {
            value: value,
            writable: true
        });
    }

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl || {},
        Extendable = sjl.defineSubClass(Function, function Extendable() {}),
        Identity = Extendable.extend({
            constructor: function Identity (value) {
                if (!(this instanceof Identity)) {
                    return Identity.of(value);
                }
                addPropertyValue(this, value);
            },
            map: function (func) {
                return Identity.of(func(this.value));
            },
            flatten: function () {
                var value = this.value;
                while (value instanceof Just) {
                    value = value.value;
                }
                return Identity(value);
            },
            unwrap: function () {
                return this.flatten().value;
            },
            fnApply: function (obj) {
                return obj.map(this.value);
            },
            fnBind: sjl.curry2(function (fn, mappable) {
                return mappable.map(fn(this.value)).flatten();
            }),
        }, {
            of: function (value) {
                return new Identity(value);
            }
        }),
        Just = Identity.extend({
            constructor: function Just (value) {
                if (!(this instanceof Just)) {
                    return Just.of(value);
                }
                Identity.call(this, value);
            },
            map: function (func) {
                return sjl.isset(this.value) ? Just(func(this.value)) : Nothing();
            },
            flatten: function () {
                var value = this.value;
                while (value instanceof Just) {
                    value = value.value;
                }
                return sjl.isset(value) ? Just(value): Nothing();
            }
        }, {
            of: function (value) {
                return new Just(value);
            }
        }),
        returnNothing = function () {
            return Nothing();
        },
        Nothing = Extendable.extend({
            constructor: function Nothing () {
                if (!(this instanceof Nothing)) {
                    return Nothing.of();
                }
                Object.defineProperty(this, 'value', {
                    value: null
                });
            },
            map: returnNothing,
            unwrap: function () {
                return this.flatten().value;
            },
            flatten: returnNothing,
            fnApply: returnNothing,
            fnBind: returnNothing
        }, {
            of: function () {
                return new Nothing();
            }
        }),

        /**
         * `fn` package.  Includes some functional members
         * @type {{map: *, flatten: fnPackage.flatten, unwrap: fnPackage.unwrap, apply: *, bind: *, Identity: (any), Just: (any), Nothing: (any)}}
         */
        fnPackage = {

            map: sjl.curry2(function (obj, fn) {
                return obj.map(fn);
            }),
            flatten: function (obj) {
                return obj.flatten();
            },
            unwrap: function (obj) {
                return obj.unwrap();
            },
            fnApply: sjl.curry2(function (obj1, obj2) {
                return obj1.fnApply(obj2);
            }),
            fnBind: sjl.curry3(function (obj1, obj2, fn) {
                return obj1.fnBind(fn, obj2);
            }),

            Identity: Identity,
            Just: Just,
            Nothing: Nothing
        };

    // Export `Extendable`
    if (isNodeEnv) {
        module.exports = fnPackage;
    }
    else {
        sjl.ns('fn', fnPackage);
        sjl.fn = sjl.ns.fn;
        if (window.__isAmd) {
            return Extendable;
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

    /**
     * Extends the passed in constructor with `Extendable`.
     * @examples
     * // Scenario 1: function called with a constructor, a prototype object, and a static properties object.
     * // 2nd and 3rd arguments are optional in this scenario
     * Extendable.extend(SomeConstructor, somePrototypeHash, someStaticPropsHash);
     *
     * // Scenario 2: function is called with a prototype object and a static properties object
     * // 2nd argument is optional in this scenario.
     * // Note: First arg must contain a constructor property containing the constructor to extend which is also
     * //   the constructor that gets set on said constructors prototype.constructor property
     * //   (gets set as un-writable/un-configurable makes for a more accurate oop experience).
     * Extendable.extend({ constructor: SomeConstructor, someMethod: function () {} },
     *                   {someStaticProp: 'hello'});
     * @see sjl.defineSubClass
     * @member sjl.stdlib.Extendable.extend {Function}
     */

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
             * @method sjl.stdlib.Config#toJSON
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
            Object.defineProperty(this, 'optionsKeyName', {value: _optionsKeyname});

            // Define "options" property
            sjl.defineEnumProp(this, this.optionsKeyName, new sjl.stdlib.Config());

            /**
             * Options key name.  Set when constructing an Optionable instance via the
             * options hash passed in.
             * Default value: '_options'
             * @note The value of this property is set as the key for the options storage internally;
             * @example
             *
             * var model = new sjl.stdlib.Optionable({optionsKeyName: 'options'});
             * model.options instanceof sjl.stdlib.Config === true // true;
             *
             * var model2 = new sjl.stdlib.Optionable(); // Uses default key name '_options' in this case scenario
             * model2._options instanceof sjl.stdlib.Config === true // true;
             *
             * var model3 = new sjl.stdlib.Optionable({optionsKeyName: '_attributes'});
             * model3._attributes instanceof sjl.stdlib.Config === true // true;
             *
             * @readonly
             * @member sjl.stdlib.Optionable#optionsKeyName {String}
             */

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
        getPropDescriptor = Object.getOwnPropertyDescriptor,

        /**
         * @param values {Array}
         * @constructor
         * @private
         */
        Iterator = function Iterator(values) {
            sjl.throwTypeErrorIfNotOfType(errorContextName, 'values', values, 'Array');
            var _values = values,
                _pointer = 0;

            /**
             * Public property docs
             *----------------------------------------------------- */
            /**
             * Iterator values.  Set on construction.
             * @name _values
             * @member {Array<*>} sjl.stdlib.Iterator#_values
             * @readonly
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

            // Set values property
            if (!getPropDescriptor(this, '_values')) {
                Object.defineProperty(this, '_values', {
                    value: _values
                });
            }

            // Set `pointer` property description
            if (!getPropDescriptor(this, 'pointer')) {
                Object.defineProperty(this, 'pointer', {
                    get: function () {
                        return _pointer;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(errorContextName, 'pointer', value, Number);
                        _pointer = sjl.constrainPointer(value, 0, _values.length);
                    },
                    enumerable: true
                });
            }

            if (!getPropDescriptor(this, 'size')) {
                // Define properties before setting values
                Object.defineProperty(this, 'size', {
                    get: function () {
                        return _values.length;
                    },
                    enumerable: true
                });
            }
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
                value: self._values[self.pointer]
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
                    value: self._values[pointer]
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
            return this.pointer < this._values.length;
        },

        /**
         * Iterates through all elements in iterator.
         * @param callback {Function}
         * @param context {Object}
         * @method sjl.stdlib.Iterator#forEach
         * @returns {sjl.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            context = context || this;
            this._values.forEach(callback, context);
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
         * @constructor
         * @private
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
             * Object iterator keys.  Set on construction.
             * @member {Array<*>} sjl.stdlib.ObjectIterator#keys
             * @readonly
             */

            // Define other own propert(y|ies)
            Object.defineProperty(this, '_keys', { value: _keys });
        },

        /**
         * Returns the current key and value that `pointer` is pointing to as an array [key, value].
         * @method sjl.stdlib.ObjectIterator#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var self = this,
                pointer = self.pointer;
            return self.valid() ? {
                done: false,
                value: [self._keys[pointer], self._values[pointer]]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.stdlib.ObjectIterator#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var self = this,
                pointer = self.pointer,
                retVal = self.valid() ? {
                    done: false,
                    value: [self._keys[pointer], self._values[pointer]]
                } : {
                    done: true
                };
            self.pointer += 1;
            return retVal;
        },

        /**
         * Returns whether iterator has more items to return or not.
         * @method sjl.stdlib.ObjectIterator#valid
         * @returns {boolean}
         */
        valid: function () {
            var pointer = this.pointer;
            return pointer < this._values.length && pointer < this._keys.length;
        },

        /**
         * Iterates through all elements in iterator.  @note Delegates to it's values `forEach` method.
         * @param callback {Function}
         * @param context {Object}
         * @method sjl.stdlib.ObjectIterator#forEach
         * @returns {sjl.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            var self = this,
                values = self._values;
            context = context || self;
            self._keys.forEach(function (key, index, keys) {
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
     * @param arrayOrObj {Array|Object} - Array or object to set iterator function on.
     * @returns {Array|Object}
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
         * @private
         * @constructor
         */
        constructor: function SjlSet (iterable) {
            var self = this,
                _values = [];

            // Define own props
            Object.defineProperties(this, {
                /**
                 * @name _values
                 * @member {Array<*>} sjl.stdlib.SjlSet#_values - Where the values are kept on the Set.  Default `[]`.
                 * @readonly
                 */
                _values: {
                    value: _values
                },

                /**
                 * @name size
                 * @member {Number} sjl.stdlib.SjlSet#size - Size of Set.  Default `0`.
                 * @readonly
                 */
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

            /**
             * Flag for knowing that default es6 iterator was overridden.  Set on construction.
             * @name _iteratorOverridden
             * @member {Boolean} sjl.stdlib.SjlSet#_iteratorOverridden.  Default `true`.
             * @readonly
             */

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

        /**
         * SjlMap constructor to augment
         * @param iterable {Array|Object}
         * @private
         * @constructor
         */
        SjlMap = function SjlMap (iterable) {
            var self = this,
                _keys = makeIterable([]),
                _values = makeIterable([]),
                classOfParam0 = sjl.classOf(iterable);

            Object.defineProperties(this, {

                /**
                 * Keys array.  Set on construction.
                 * @member sjl.stdlib.SjlMap#_keys {Array}
                 * @readonly
                 */
                _keys: {
                    value: _keys
                },

                /**
                 * Values array.  Set on construction.
                 * @member sjl.stdlib.SjlMap#_values {Array}
                 * @readonly
                 */
                _values: {
                    value: _values
                },

                /**
                 * @name size
                 * @member sjl.stdlib.SjlMap#size {Number} - Size of the iterator.
                 * @readonly
                 */
                size: {
                    get: function () {
                        return self._keys.length;
                    },
                    enumerable: true
                }
            });

            // If an array was passed in inject values
            if (classOfParam0 === 'Array') {
                self.addFromArray(iterable);
            }
            else if (classOfParam0 === 'Object') {
                self.addFromObject(iterable);
            }

            // Else if anything other undefined was passed at this point throw an error
            else if (classOfParam0 !== 'Undefined') {
                throw new TypeError ('Type Error: sjl.stdlib.SjlMap constructor only accepts a parameter of type' +
                    '`Object`, `Array` or `Undefined`. ' +
                ' Type received: ', sjl.classOf(iterable));
            }

            // Set custom iterator function on `this`
            self[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(_keys, _values, 0);
            };

            /**
             * Flag for knowing that es6 iterator was overridden.  Set on construction.
             * @name _iteratorOverridden
             * @member sjl.stdlib.SjlMap#_iteratorOverridden {Boolean}
             * @readonly
             */
            // Set flag to remember that original iterator was overridden
            Object.defineProperty(self, '_iteratorOverridden', {value: true});
        };

    /**
     * `SjlMap` constructor. Has same api as es6 `Map` constructor with
     *  an additional couple of convenience methods (`addFromArray`, `addFromObject`, `iterator`, `toJson`).
     *
     * @param iterable {Array|Object} - The object to populate itself from (either an `Array<[key, value]>`
     *  or an `Object`).
     * @constructor sjl.stdlib.SjlMap
     */
    SjlMap = Extendable.extend(SjlMap, {
        /**
         * Clears the `SjlMap` object of all data that has been set on it.
         * @method sjl.stdlib.SjlMap#clear
         * @returns {SjlMap}
         */
        clear: function () {
            [this._values, this._keys].forEach(function (values) {
                while (values.length > 0) {
                    values.pop();
                }
            });
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
 * Created by elydelacruz on 8/22/16.
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl,
        Extendable = sjl.stdlib.Extendable,

    /**
     * Used as default constructor for wrapping items in when `wrapItems` is set to `true` on
     * `sjl.stdlib.PriorityList`.
     * @class sjl.stdlib.PriorityListItem
     * @extends sjl.stdlib.Extendable
     * @param key {*}
     * @param value {*}
     * @param priority {Number}
     * @param serial {Number}
     */
    PriorityListItem = Extendable.extend({

        /**
         * Priority List Item Constructor (internal docblock).
         * @constructor
         * @param key {*}
         * @param value {*}
         * @param priority {Number}
         * @param serial {Number}
         * @private
         */
        constructor: function PriorityListItem (key, value, priority, serial) {
            var _priority,
                _serial,
                contextName = 'sjl.stdlib.PriorityListItem';
            /**
             * Key name.  Set on construction.
             * @member sjl.stdlib.PriorityListItem#key {String}
             * @readonly
             */
            /**
             * Value name.  Set on construction.
             * @member sjl.stdlib.PriorityListItem#value {*}
             * @readonly
             */
            /**
             * Serial index.
             * @member sjl.stdlib.PriorityListItem#serial {Number}
             * @readonly
             */
            /**
             * Priority.
             * @member sjl.stdlib.PriorityListItem#priority {Number}
             * @readonly
             */
            Object.defineProperties(this, {
                key: {
                    value: key,
                    enumerable: true
                },
                serial: {
                    get: function () {
                        return _serial;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'serial', value, Number);
                        _serial = value;
                    },
                    enumerable: true
                },
                value: {
                    value: value,
                    enumerable: true
                },
                priority: {
                    get: function () {
                        return _priority;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'priority', value, Number);
                        _priority = value;
                    },
                    enumerable: true
                }
            });
            this.priority = priority;
            this.serial = serial;
        }
    });

    if (isNodeEnv) {
        module.exports = PriorityListItem;
    }
    else {
        // Export class to namespace
        sjl.ns('stdlib.PriorityListItem', PriorityListItem);

        // If `Amd` return the class
        if (window.__isAmd) {
            return PriorityListItem;
        }
    }

}());

/**
 * Created by elyde on 1/11/2016.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl,
        ObjectIterator = sjl.stdlib.ObjectIterator,
        SjlMap = sjl.stdlib.SjlMap,
        Iterator = sjl.stdlib.Iterator,

        /**
         * PriorityList Constructor (internal docblock).
         * @param objOrArray {Object|Array}
         * @param LIFO {Boolean} - Default `false`.
         * @param wrapItems {Boolean} - Default `false`
         * @constructor
         * @private
         */
        PriorityList = function PriorityList (objOrArray, LIFO, wrapItems) {
            var _sorted = false,
                __internalPriorities = 0,
                __internalSerialNumbers = 0,
                _LIFO = sjl.isset(LIFO) ? LIFO : false,
                _itemWrapperConstructor = PriorityList.DefaultPriorityListItemConstructor,
                _wrapItems = sjl.isset(wrapItems) ? wrapItems : true,
                contextName = 'sjl.stdlib.PriorityList',
                classOfIterable = sjl.classOf(objOrArray);

            /**
             * Public property docs
             *----------------------------------------------------- */
            /**
             * itemWrapperConstructor {Function<key, value, priority, serial>} - Item Wrapper Constructor.
             * Default `sjl.stdlib.PriorityListItem`.
             * @name itemWrapperConstructor
             * @member {Function} sjl.stdlib.PriorityList#itemWrapperConstructor
             */
            /**
             * wrapItems {Boolean} - Wrap items flag.  Default `false`.
             * @name wrapItems
             * @member {Boolean} sjl.stdlib.PriorityList#wrapItems
             */
            /**
             * LIFO ("last in first out") flag - Default `false`.
             * @name LIFO
             * @member {Boolean} sjl.stdlib.PriorityList#LIFO
             */
            /**
             * _internalSerialNumbers {Number} - Internal serial numbers counter.
             * Not meant for public consumption.
             * @private
             * @name _internalSerialNumbers
             * @member {Boolean} sjl.stdlib.PriorityList#_internalSerialNumbers
             */
            /**
             * _internalPriorities {Number} - Internal priorities counter.
             * Not meant for public consumption.
             * @note May be removed later cause we can set all items with no priorities to `0` and allow
             * them to be sorted by `serial`.
             * @deprecated
             * @private
             * @name _internalPriorities
             * @member {Boolean} sjl.stdlib.PriorityList#_internalPriorities
             */
            /**
             * _LIFO_modifier {Number} - "last in first out" modifier - Returns -1 or 1 based on `LIFO` flag.
             * Not meant for public consumption.
             * @private
             * @name LIFO
             * @member {Boolean} sjl.stdlib.PriorityList#LIFO
             */
            /**
             * _sorted {Boolean} - Flag used internally to track when priority list needs to be sorted or not.
             * Not meant for public consumption.
             * @private
             * @name LIFO
             * @member {Boolean} sjl.stdlib.PriorityList#LIFO
             */

            Object.defineProperties(this, {
                itemWrapperConstructor: {
                    get: function () {
                        return _itemWrapperConstructor;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'itemWrapperConstructor', value, Function);
                        _itemWrapperConstructor = value;
                    },
                    enumerable: true
                },
                wrapItems: {
                    get: function () {
                        return _wrapItems;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, 'wrapItems', value, Boolean);
                        _wrapItems = value;
                    },
                    enumerable: true
                },
                LIFO: {
                    get: function () {
                        return _LIFO;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, 'LIFO', value, Boolean);
                        _LIFO = value;
                        this._sorted = false;
                    },
                    enumerable: true
                },
                _internalSerialNumbers: {
                    get: function () {
                        return __internalSerialNumbers;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(contextName, '__internalSerialNumbers', value, Number);
                        __internalSerialNumbers = value;
                    }
                },
                _internalPriorities: {
                    get: function () {
                        return __internalPriorities;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, '_internalPriorities', value, Number);
                        __internalPriorities = value;
                    }
                },
                _LIFO_modifier: {
                    get: function () {
                        return this.LIFO ? 1 : -1;
                    }
                },
                _sorted: {
                    get: function () {
                        return _sorted;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(PriorityList.name, '_sorted', value, Boolean);
                        _sorted = value;
                    }
                }
            });

            // Validate these via their setters
            this.LIFO = _LIFO;
            this.wrapItems = _wrapItems;

            // Extend instance properties
            SjlMap.call(this);
            Iterator.call(this, this._values);

            // Inject incoming iterable(s)
            if (classOfIterable === 'Object') {
                this.addFromObject(objOrArray);
            }
            else if (classOfIterable === 'Array') {
                this.addFromArray(objOrArray);
            }
        };

    /**
     * Allows the sorting of items based on priority (serial index (order items were entered in) is
     * also taken into account when items have the same priority).  This class also
     * implements the es6 `Map` interface and the es6 `Iterator` interface thereby making it
     * easily manageable and iterable.
     * @class sjl.stdlib.PriorityList
     * @extends sjl.stdlib.SjlMap
     * @extends sjl.stdlib.Iterator
     * @param objOrArray {Object|Array} - Required.
     * @param LIFO {Boolean} - "Last In First Out" flag.  Default false.
     * @param wrapItems {Boolean} - Whether items should be wrapped (internal priority list props set on outer wrapper)
     * or whether items should not be wrapped (internal priority list properties set directly on passed in objects) (internal props used
     * for sorting and other internal calculations).  Default false.
     */
    PriorityList = SjlMap.extend(PriorityList, {
        // Iterator interface
        // -------------------------------------------

        /**
         * Returns iterator result for item at pointer's current position.
         * @method sjl.stdlib.PriorityList#current
         * @method sjl.stdlib.PriorityList#current
         * @returns {{done: boolean, value: *}|{done: boolean}} - Returns `value` key in result only while `done` is `false`.
         */
        current: function () {
            var current = Iterator.prototype.current.call(this);
            if (!current.done && this.wrapItems) {
                current.value = current.value.value;
            }
            return current;
        },

        /**
         * Returns the next iterator result for item at own `pointer`'s current position.
         * @method sjl.stdlib.PriorityList#next
         * @overrides sjl.stdlib.Iterator#next
         * @returns {{done: boolean, value: *}|{done: boolean}} - Returns `value` key in result only while `done` is `false`.
         */
        next: function () {
            var next = Iterator.prototype.next.call(this);
            if (!next.done && this.wrapItems) {
                next.value = next.value.value;
            }
            return next;
        },

        /**
         * Returns a boolean indicating whether a valid iterator result object can be retrieved from
         * self or not.
         * @method sjl.stdlib.PriorityList#valid
         * @overrides sjl.stdlib.Iterator#valid
         * @returns {boolean}
         */
        valid: function () {
            return Iterator.prototype.valid.call(this);
        },

        /**
         * Set's pointer to `0`.
         * @method sjl.stdlib.PriorityList#rewind
         * @overrides sjl.stdlib.Iterator#rewind
         * @returns {sjl.stdlib.Iterator}
         */
        rewind: function () {
            return Iterator.prototype.rewind.call(this);
        },
        // forEach doesn't get added as SjlMap already has an implementation of it

        // Overridden Map functions
        // -------------------------------------------
        /**
         * Clears any stored priority items.  Also
         * internally sets `sorted` to `false`.
         * @method sjl.stdlib.PriorityList#clear
         * @overrides sjl.stdlib.SjlMap#clear
         * @returns {sjl.stdlib.PriorityList}
         */
        clear: function () {
            SjlMap.prototype.clear.call(this);
            this._sorted = false;
            return this;
        },

        /**
         * Returns a key-value es6 compliant iterator.
         * @method sjl.stdlib.ObjectIterator#entries
         * @overrides sjl.stdlib.SjlMap#entries
         * @returns {sjl.stdlib.ObjectIterator}
         */
        entries: function () {
            return this.sort().wrapItems ?
                new ObjectIterator(this._keys, this._values.map(function (item) {
                    return item.value;
                })) :
                new SjlMap.prototype.entries.call(this.sort());
        },

        /**
         * Allows you to loop through priority items in priority list.
         * Same function signature as Array.prorotype.forEach.
         * @param callback {Function} - Same signature as SjlMap.prorotype.forEach; I.e., {Function<value, key, obj>}.
         * @param context {undefined|*}
         * @method sjl.stdlib.PriorityList#forEach
         * @overrides sjl.stdlib.SjlMap#forEach
         * @returns {sjl.stdlib.PriorityList}
         */
        forEach: function (callback, context) {
            SjlMap.prototype.forEach.call(this.sort(), function (value, key, map) {
                callback.call(context, this.wrapItems ? value.value : value, key, map);
            }, this);
            return this;
        },

        /**
         * Returns an iterator for keys in this priority list.
         * @method sjl.stdlib.PriorityList#keys
         * @overrides sjl.stdlib.SjlMap#keys
         * @returns {sjl.stdlib.Iterator}
         */
        keys: function () {
            return SjlMap.prototype.keys.call(this.sort());
        },

        /**
         * Returns an iterator for values in this priority list.
         * @method sjl.stdlib.PriorityList#values
         * @overrides sjl.stdlib.SjlMap#values
         * @returns {sjl.stdlib.Iterator}
         */
        values: function () {
            if (this.wrapItems) {
                return new Iterator(this.sort()._values.map(function (item) {
                    return item.value;
                }));
            }
            return new SjlMap.prototype.values.call(this.sort());
        },

        /**
         * Fetches value for key (returns unwrapped value if `wrapItems` is `true`).
         * @param key {*}
         * @method sjl.stdlib.PriorityList#get
         * @overrides sjl.stdlib.SjlMap#get
         * @returns {*}
         */
        get: function (key) {
            var result = SjlMap.prototype.get.call(this, key);
            return this.wrapItems && result ? result.value : result;
        },

        /**
         * Sets an item onto Map at passed in priority.  If no
         * priority is passed in value is set at internally incremented
         * priority.
         * @param key {*}
         * @param value {*}
         * @param priority {Number}
         * @overrides sjl.stdlib.SjlMap#set
         * @method sjl.stdlib.PriorityList#set
         * @returns {sjl.stdlib.PriorityList}
         */
        set: function (key, value, priority) {
            SjlMap.prototype.set.call(this, key, this.resolveItemWrapping(key, value, priority));
            this._sorted = false;
            return this;
        },

        // Non api specific functions
        // -------------------------------------------
        // Own Api functions
        // -------------------------------------------

        /**
         * Sorts priority list items based on `LIFO` flag.
         * @method sjl.stdlib.PriorityList#sort
         * @returns {sjl.stdlib.PriorityList} - Returns self.
         */
        sort: function () {
            var self = this,
                LIFO_modifier = self._LIFO_modifier;

            // If already sorted return self
            if (self._sorted) {
                return self;
            }

            // Sort entries
            self._values.sort(function (a, b) {
                    var retVal;
                    if (a.priority === b.priority) {
                        retVal = a.serial > b.serial;
                    }
                    else {
                        retVal = a.priority > b.priority;
                    }
                    return (retVal ? -1 : 1) * LIFO_modifier;
                })
                .forEach(function (item, index) {
                    self._keys[index] = item.key;
                    item.serial = index;
                });

            // Set sorted to true and pointer to 0
            self._sorted = true;
            self.pointer = 0;
            return self;
        },

        /**
         * Ensures priority returned is a number or increments it's internal priority counter
         * and returns it.
         * @param priority {Number}
         * @method sjl.stdlib.PriorityList#normalizePriority
         * @returns {Number}
         */
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

        /**
         * Used internally to get value either raw or wrapped as specified by the `wrapItems` flag.
         * @param key {*}
         * @param value {*}
         * @param priority {Number}
         * @method sjl.stdlib.PriorityList#resolveItemWrapping
         * @returns {*|PriorityListItem}
         */
        resolveItemWrapping: function (key, value, priority) {
            var normalizedPriority = this.normalizePriority(priority),
                serial = this._internalSerialNumbers++;
            if (this.wrapItems) {
                return new (this.itemWrapperConstructor) (key, value, normalizedPriority, serial);
            }
            try {
                value.key = key;
                value.priority = priority;
                value.serial = serial;
            }
            catch (e) {
                throw new TypeError('PriorityList can only work in "unwrapped" mode with values/objects' +
                    ' that can have properties created/set on them.  Type encountered: `' + sjl.classOf(value) + '`;' +
                    '  Original error: ' + e.message);
            }
            return value;
        },

        /**
         * Adds key-value array pairs in an array to this instance.
         * @overrides sjl.stdlib.SjlMap#addFromArray
         * @method sjl.stdlib.PriorityList#addFromArray
         * @param array {Array<Array<*, *>>} - Array of key-value array entries to parse.
         * @returns {PriorityList}
         */
        addFromArray: function (array) {
            this._sorted = false;
            return SjlMap.prototype.addFromArray.call(this, array);
        },

        /**
         * Add all the `object`'s instance's own property key-value pairs to this instance.
         * @overrides sjl.stdlib.SjlMap#addFromObject
         * @method sjl.stdlib.PriorityList#addFromObject
         * @param object {Object} - Object to operate on.
         * @returns {PriorityList}
         */
        addFromObject: function (object) {
            this._sorted = false;
            return SjlMap.prototype.addFromObject.call(this, object);
        }
    });

    Object.defineProperty(PriorityList, 'DefaultPriorityListItemConstructor', {
        value: sjl.stdlib.PriorityListItem,
        enumerable: true
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
