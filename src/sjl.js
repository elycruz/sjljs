/**
 * The `sjl` module definition.
 * @created by Ely on 5/29/2015.
 * @todo Begin extracting contents of core into separate modules (where necessary) and/or files.
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
        PlaceHolder = function PlaceHolder() {},
        placeholder = new PlaceHolder(),
        __ = Object.freeze ? Object.freeze(placeholder) : placeholder;

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
     * Curries a function with or without placeholders (sjl._ is `Placeholder`)
     * @example
     * ```
     * var slice = Array.prototype.slice,
     *     add = function () {...}, // recursively adds
     *     multiply = function () {...}; // recursively multiplies
     *
     *   sjl.curry(add, __, __, __)(1, 2, 3, 4, 5) === 15 // `true`
     *   sjl.curry(multiply, __, 2, __)(2, 2) === Math.pow(2, 3) // `true`
     *   sjl.curry(divide, __, 625, __)(3125, 5)
     *
     * ```
     * @function module:sjl.curry
     * @param fn {Function}
     * @returns {Function}
     */
    function curry (fn) {
        var curriedArgs = restArgs(arguments, 1);
        return function () {
            var args = argsToArray(arguments),
                concatedArgs = replacePlaceHolders(curriedArgs, args),
                placeHolders = concatedArgs.filter(isPlaceholder),
                canBeCalled = placeHolders.length === 0;
            return canBeCalled ? fn.apply(null, concatedArgs) : curry.apply(null, [fn].concat(concatedArgs));
        };
    }

    /**
     * Curries a function and only executes the function when the arity reaches the .
     * @function module:sjl.curryN
     * @param fn - Function to curry.
     * @param executeArity - Arity at which to execute curried function.
     * @throws {TypeError} - If `fn` is not a function.
     */
    function curryN (fn, executeArity) {
        var curriedArgs = restArgs(arguments, 2);
        return function () {
            var args = argsToArray(arguments),
                concatedArgs = replacePlaceHolders(curriedArgs, args),
                placeHolders = concatedArgs.filter(isPlaceholder),
                canBeCalled = (concatedArgs.length - placeHolders.length >= executeArity) || !executeArity;
            return !canBeCalled ? curryN.apply(null, [fn, executeArity].concat(concatedArgs)) :
                fn.apply(null, concatedArgs);
        };
    }

    /**
     * Replaces found placeholder values and appends any left over `args` to resulting array.
     * @param array {Array}
     * @param args {Array}
     * @returns {Array.<T>|string|Buffer}
     */
    function replacePlaceHolders (array, args) {
        var out = array.map(function (element) {
            return ! (element instanceof PlaceHolder) ? element :
                (args.length > 0 ? args.shift() : element);
        });
        return args.length > 0 ? out.concat(args) : out;
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
     * Checks to see if argument is an instanceof `Placeholder`|`__`|`sjl._`.
     * @param arg {*}
     * @returns {boolean}
     */
    function isPlaceholder (arg) {
        return arg instanceof PlaceHolder;
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
     * @param deep [Boolean=false] - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
     * @todo rename these variables to be more readable.
     * @returns {*} - returns o
     */
    function extend(o, p, deep) {
        // If `o` or `p` are not set bail
        if (!o || !p) {
            return o;
        }

        // Merge all props from `p` to `o`
        Object.keys(p).forEach(function (prop) { // For all props in p.
            // If property is present on target (o) and is not writable, skip iteration
            var propDescription = Object.getOwnPropertyDescriptor(o, prop);
            if (propDescription &&
                !(isset(propDescription.get) && isset(propDescription.set)) &&
                !propDescription.writable) {
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
     * Normalized the parameters required for `defineSubClassPure` and `defineSubClass` to operate.
     * @param superClass {Function} - Superclass to inherit from.
     * @param constructor {Function|Object} - Required.  Note:  If this param is an object, then other params shift over by 1 (`methods` becomes `statics` and this param becomes `methods` (constructor key expected else empty stand in constructor is used).
     * @param methods {Object|undefined} - Methods for prototype.  Optional.  Note:  If `constructor` param is an object, this param takes the place of the `statics` param.
     * @param statics {Object|undefined} - Constructor's static methods.  Optional.  Note:  If `constructor` param is an object, this param is not used.
     * @returns {{constructor: (Function|*), methods: *, statics: *, superClass: (*|Object)}}
     */
    function normalizeArgsForDefineSubClass (superClass, constructor, methods, statics) {
        superClass = superClass || Object.create(Object.prototype);

        // Snatched statics
        var _statics;

        // Should extract statics?
        if (isFunction(superClass)) {
            // Extract statics
            _statics = Object.keys(superClass).reduce(function (agg, key) {
                if (key === 'extend' || key === 'extendWith') { return agg; }
                agg[key] = superClass[key];
                return agg;
            }, {});
        }

        // Re-arrange args if constructor is object
        if (isObject(constructor)) {
            statics = methods;
            methods = clone(constructor);
            constructor = ! isFunction(methods.constructor) ? standInConstructor(superClass) : methods.constructor;
            unset(methods, 'constructor');
        }

        // Ensure constructor
        constructor = isset(constructor) ? constructor : standInConstructor(superClass);

        // Returned normalized args
        return {
            constructor: constructor,
            methods: methods,
            statics: extend(_statics || {}, statics || {}, true),
            superClass: superClass
        };
    }

    /**
     * Creates classical styled `toString` method;  E.g. `toString` method that returns
     * `'[object ' + constructor.name + ']'` a` la` '[object Array]', '[object Function]' format.
     * @fyi method is a named function (named `toStringOverride` to be precise).
     * @note Only overrides `toString` method if it is a `named` method with the name `toString` or
     * if it doesn't exist.  If the `toString` method is `named` and the name is anything other than 'toString'
     * it will not be overridden by this method.
     * @function module:sjl.classicalToStringMethod
     * @param constructor {Function}
     * @returns {Function} - Passed in constructor.
     */
    function classicalToStringMethod (constructor) {
        if (!constructor.hasOwnProperty('toString') || constructor.toString.name === 'toString') {
            constructor.prototype.toString = function toStringOverride() {
                return '[object ' + constructor.name + ']';
            };
        }
        return constructor;
    }

    /**
     * Adds `extend` and `extendWith` static methods to the passed in constructor for having easy extensibility via said
     * methods;  I.e., passed in constructor will now be extendable via added methods.
     * @see sjl.defineSubClass(superClass, constructor, methods, statics)
     * @function module:sjl.makeExtendableConstructor
     * @param constructor {Function}
     * @returns {*}
     */
    function makeExtendableConstructor (constructor) {
        var extender = function (constructor_, methods_, statics_) {
            return defineSubClass(constructor, constructor_, methods_, statics_);
        };

        /**
         * Extends a new copy of self with passed in parameters.
         * @memberof class:sjl.stdlib.Extendable
         * @static sjl.stdlib.Extendable.extend
         * @param constructor {Function|Object} - Required.  Note: if is an object, then other params shift over by 1 (`methods` becomes `statics` and this param becomes `methods`).
         * @param methods {Object|undefined} - Methods.  Optional.  Note:  If `constructor` param is an object, this gets cast as `statics` param.  Also for overriding
         * @param statics {Object|undefined} - Static methods.  Optional.  Note:  If `constructor` param is an object, it is not used.
         */
        constructor.extend =
            constructor.extendWith =
                extender;

        // Return constructor
        return constructor;
    }

    /**
     * Same as `defineSubClass` with out side-effect of `extend` method and `toString` method.
     * @function module:sjl.defineSubClassPure
     * @param superClass {Function} - Superclass to inherit from.
     * @param constructor {Function|Object} - Required.  Note:  If this param is an object, then other params shift over by 1 (`methods` becomes `statics` and this param becomes `methods` (constructor key expected else empty stand in constructor is used).
     * @param methods {Object|undefined} - Methods for prototype.  Optional.  Note:  If `constructor` param is an object, this param takes the place of the `statics` param.
     * @param statics {Object|undefined} - Constructor's static methods.  Optional.  Note:  If `constructor` param is an object, this param is not used.
     * @returns {Function} - Constructor with extended prototype and added statics.
     */
    function defineSubClassPure (superClass, constructor, methods, statics) {
        var normalizedArgs = normalizeArgsForDefineSubClass.apply(null, arguments),
            _superClass = normalizedArgs.superClass,
            _statics = normalizedArgs.statics,
            _constructor = normalizedArgs.constructor,
            _methods = normalizedArgs.methods;

        // Set prototype
        _constructor.prototype = Object.create(_superClass.prototype);

        // Define constructor
        Object.defineProperty(_constructor.prototype, 'constructor', {value: _constructor});

        // Extend constructor
        extend(_constructor.prototype, _methods);
        extend(_constructor, _statics, true);

        // Return constructor
        return _constructor;
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
    function defineSubClass (superClass, constructor, methods, statics) {
        var _constructor_ = defineSubClassPure.apply(null, arguments);

        // set overridden `toString` method and set `extend` and `extendWith` methods after create a
        // pure sub class of `superClass`
        return compose(makeExtendableConstructor, classicalToStringMethod)(_constructor_);
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
         * @private
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

    function isIteratorLike (obj) {
        return hasMethod(obj, 'next');
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
            current = iterator.next();
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
            case _Array:
                out = arrayLike;
                break;
            case _String:
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
            case _Object:
                if (hasIterator(classOfArrayLike)) {
                    out = iteratorToArray(getIterator(classOfArrayLike));
                }
                else if (isIteratorLike(arrayLike)) {
                    out = iteratorToArray(arrayLike);
                }
                else {
                    out = objToArrayMap(arrayLike);
                }
                break;
            case _Number:
                out = arrayLike + ''.split('');
                break;
            case _Function:
                out = toArray(arrayLike());
                break;
            default:
                // If can't operate on value throw an error
                if (classOfIsMulti(arrayLike, _Null, _Undefined, 'Symbol', _Boolean)) {
                    throw new TypeError('`sjl.toArray` cannot operate on values of type' +
                        ' `Null`, `Undefined`, `Symbol`, `Boolean`.  ' +
                        'Value type passed in: `' + classOfArrayLike + '`.');
                }
                console.warn('`sjl.toArray` has wrapped a value unrecognized to it.  ' +
                    'Value received: ' + arrayLike + ', Type of value: ', classOfArrayLike);
                out = [arrayLike];
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
            return arr1.concat(arrayLikeToArray(arr2));
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
        classicalToStringMethod: classicalToStringMethod,
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
        defineSubClassPure: defineSubClassPure,
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
    if (isUndefined(Symbol)) {
        sjl.Symbol = {
            iterator: '@@iterator'
        };
    }
    else {
        sjl.Symbol = Symbol;
    }

    /**
     * Function argument placeholder (for functions curried with sjl.curry and it's variants (sjl.curryN, sjl.curry2 etc.)
     * @note `PlaceHolder` is a private type (in case you are looking for it).
     * @type {PlaceHolder}
     */
    sjl.defineEnumProp(sjl, '_', __); // Placeholder object

    /**
     * 'Is node env' check.
     * @type {Boolean}
     */
    sjl.defineEnumProp(sjl, 'isNodeEnv', isNodeEnv);

    // Node specific code
    if (isNodeEnv) {
        /**
         * @namespace sjl.nodejs {sjl.nodejs.Namespace}
         */
        // Set package namespace and alias for it
        sjl.package = sjl.ns = new (require('./nodejs/Namespace'))(
            __dirname, ['.js', '.json'], null, ['sjl.js']
        );

        // Short cut to namespaces
        // Object.keys(sjl.ns).forEach(function (key) {
        //     sjl[key] = sjl.ns[key];
        // });

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
         * @namespace module:sjl.stdlib {Object}
         */
        defineEnumProp(sjl,     'stdlib',       sjl.ns('stdlib'));

        /**
         * Is amd check (helps eliminate 'is amd' being used boilerplate code).
         * @type {Boolean}
         */
        defineEnumProp(sjl, 'isAmd', isFunction(window.define) && isset(window.define.amd));

        // Export sjl globally
        window.sjl = sjl;

        // Return sjl if amd is being used
        if (sjl.isAmd) {
            return sjl;
        }
    }

}());
