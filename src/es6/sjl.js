/**
 * Created by elydelacruz on 10/25/15.
 * @file: ./src/es6/sjl.js
 * @description:  This file consists of all the utils of the sjl library.
 * @module sjl
 */

(function (isNodeEnv) {

    var  sjl = {

        /**
         * Checks to see value passed in is not set (not undefined and not null).
         * Returns false if value is not set (undefined or null).
         * is null or undefined.
         * @function module:sjl.isset
         * @returns {Boolean}
         */
        isset: function (value) {
            return value !== undefined && value !== null;
        },

        /**
         * Checks whether a value isset and of one of the types passed in (**note the `type` params is actually `...type`)
         * @function module:sjl.issetAndOfType
         * @param value {*} - Value to check on.
         * @param ...type {String|Array} - One or more type strings to match for or array of type strings.
         * @returns {Boolean}
         */
        issetAndOfType: function (value, ...type) {
            return sjl.isset(value) && sjl.classOfIs(value, ...type);
        },

        /**
         * Checks whether a key on an object is set.
         * @function module:sjl.issetObjKey
         * @param obj {Object} - Object to search on.
         * @param key {String} - Key to search on `obj`.
         * @returns {Boolean}
         */
        issetObjKey: function (obj, key) {
            return key in obj && sjl.isset(obj[key]);
        },

        /**
         * Checks whether an object's key is set and is of type (...type one of the types passed in)
         * @function module:sjl.issetObjKeyAndOfType
         * @param obj {Object}
         * @param key {String}
         * @param type {String|Array} - Optional.
         * @returns {Boolean}
         */
        issetObjKeyAndOfType: function (obj, key, ...type) {
            return sjl.issetObjKey(obj, key)
                && sjl.classOfIs(obj[key], ...type);
        },

        /**
         * Returns the class name of an object from it's class string.
         * **Note** - Returns 'NaN' if type is 'Number' and isNaN as of version 0.4.85.
         * @function module:sjl.classOf
         * @param value {*}
         * @returns {string} - A string representation of the type of the value; E.g., 'Number' for `0`
         */
        classOf: function (value) {
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
        },

        /**
         * Checks to see if an object is of type humanString (class name) .
         * @function module:sjl.classOfIs
         * @param obj {*} - Object to be checked.
         * @param ...humanString {String|Array} - Class string to check for or Array of class strings to check for.
         *  Can also just be ...rest params of class strings which will be parsed internally as an array of class strings;
         *  I.e., "Number", "Object", etc.
         * @returns {Boolean} - Whether object matches class string(s) or not.
         */
        classOfIs: function (obj, ...humanString) {
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
        },

        /**
         * Checks to see if any of the arguments passed in are empty.
         * @function module:sjl.empty
         * @todo change this to isempty for later version of lib.
         * @returns {Boolean}
         */
        empty: function (value) {
            var classOfValue = sjl.classOf(value),
                retVal;

            // If value is an array or a string
            if (classOfValue === 'Array'
                || classOfValue === 'String') {
                retVal = value.length === 0;
            }

            else if (classOfValue === 'Set' || classOfValue === 'Map'
                || classOfValue === 'WeakMap') {
                retVal = value.size === 0;
            }

            else if ((classOfValue === 'Number' && value !== 0) || (classOfValue === 'Function')) {
                retVal = false;
            }

            // If value is not number and is not equal to zero or if value is not a function
            // then check for other empty values
            else {
                retVal = (value === 0 || value === false
                || !sjl.isset(value)
                || sjl.isEmptyObj(value));
            }

            return retVal;
        },

        /**
         * Checks object for own properties.
         * @param obj {Object} object to be checked
         * @returns {Boolean}
         */
        isEmptyObj: function (obj) {
            return Object.keys(obj).length > 0;
        },

        /**
         * Retruns a boolean based on whether a key on an object has an empty value or is empty (not set, undefined, null)
         * @function module:sjl.isEmptyObjKeyOrNotOfType
         * @param obj {Object} - Object to search on.
         * @param key {String} - Key to search for one `obj`.
         * @param type {String} - Optional. {...type} one or more types to search on.
         * @returns {Boolean}
         */
        isEmptyObjKeyOrNotOfType: function (obj, key, type) {
            var issetObjKey = arguments.length > 2
                ? sjl.issetObjKeyAndOfType(...arguments) : sjl.issetObjKey(obj, key);
            return !issetObjKey || sjl.empty(obj[key]);
        },

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
        isEmptyObjKey: function () {
            sjl.isEmptyObjKeyOrNotOfType(...arguments);
        },

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
        namespace: function (ns_string, objToSearch, valueToSet) {
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
        },

        /**
         * Lower cases first character of a string.
         * @function module:sjl.lcaseFirst
         * @param {String} str
         * @throws {TypeError}
         * @returns {String}
         */
        lcaseFirst: function (str) {
            return changeCaseOfFirstChar(str, 'toLowerCase', 'lcaseFirst');
        },

        /**
         * Upper cases first character of a string.
         * @function module:sjl.ucaseFirst
         * @param {String} str
         * @returns {String}
         */
        ucaseFirst: function (str) {
            return changeCaseOfFirstChar(str, 'toUpperCase', 'ucaseFirst');
        },

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
        camelCase: function (str, upperFirst, replaceStrRegex) {
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
        },

        /**
         * Returns boolean from beginning of array if any.  If item at beginning of array is undefined returns `false`.
         * @function module:sjl.extractBoolFromArrayStart
         * @param array {Array}
         * @returns {Boolean}
         */
        extractBoolFromArrayStart: function (array) {
            return extractBoolFromArray(array, true);
        },

        /**
         * Returns boolean from beginning of array if any.  If item at beginning of array is undefined returns `false`.
         * @function module:sjl.extractBoolFromArrayEnd
         * @param array {Array}
         * @returns {Boolean}
         */
        extractBoolFromArrayEnd: function (array) {
            return extractBoolFromArray(array, false);
        },

        /**
         * Ensures passed in value is a usable number (a number which is also not NaN).
         * @function module:sjl.isUsableNumber
         * Sugar for checking for 'Number' type and that the passed in value is not NaN.
         * @param value {*}
         * @returns {Boolean|boolean}
         */
        isUsableNumber: function (value) {
            return sjl.classOfIs(value, 'Number') && !isNaN(value);
        },

        /**
         * Implodes a `Set`, `Array` or `SjlSet` passed in.
         * @function module:sjl.implode
         * @param list {Array|Set|SjlSet} - Members to join.
         * @param separator {String} - Separator to join members with.
         * @returns {string} - Imploded string.  *Returns empty string if no members, to join, are found.
         */
        implode: function (list, separator) {
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
        },

        /**
         * Searches an object for namespace string.
         * @param ns_string {String} - Namespace string;  E.g., 'all.your.base'
         * @param objToSearch {*}
         * @returns {*} - If property chain is not found then returns `null`.
         */
        searchObj: function (ns_string, objToSearch) {
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
        },

        /**
         * Checks if object has method key passed.
         * @function module:sjl.hasMethod
         * @param obj {Object|*} - Object to search on.
         * @param method - Method name to search for.
         * @returns {Boolean}
         */
        hasMethod: function (obj, method) {
            return !sjl.isEmptyObjKeyOrNotOfType(obj, method, 'Function');
        },

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
         * @returns {*}
         */
        getValueFromObj: function (key, obj, args, raw, noLegacyGetters) {
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
        },

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
        setValueOnObj: function (key, value, obj) {
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
        },

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
        extend: function () {
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
        },

        /**
         * Returns copy of object.
         * @function module:sjl.clone
         * @param obj {Object}
         * @returns {*} - Cloned object.
         */
        clone: function (obj) {
            return  sjl.extend(true, {}, obj);
        },

        /**
         * Returns copy of object using JSON stringify/parse.
         * @function module:sjl.jsonClone
         * @param obj {Object} - Object to clone.
         * @returns {*} - Cloned object.
         */
        jsonClone: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        /**
         * Package factory method.  Allows object to have a `package` method
         * which acts like java like namespace except it allows you to set
         * it's members (once) and then protects it's members.
         * @function module:sjl.createTopLevelPackage
         * @param obj {Object|*} - Object to set the `package` method on.
         * @return {Object|*} - Returns passed in `obj`.
         */
        createTopLevelPackage: function (obj, funcKey) {
            funcKey = funcKey || 'package';
            return (function () {
                /**
                 * Private package object.
                 * @type {{}}
                 */
                var packages = {};

                /**
                 * Returns a property from sjl packages.
                 * @note If `nsString` is undefined returns the protected packages object itself.
                 * @function module:sjl.package
                 * @param propName {String}
                 * @param value {*}
                 * @returns {*}
                 */
                obj[funcKey] = function (nsString, value) {
                    return typeof nsString === 'undefined' ? packages
                        : namespace(nsString, packages, value);
                };

                // Return passed in obj
                return obj;
            }());
        },

        //filterWhereType: function (obj, type) {},


        /**
         * Flattens passed in array.
         * @function module:sjl.flattenArray
         * @param array {Array}
         * @returns {Array}
         */
        flattenArray: function (array) {
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
        },

        //primitives: new Set('Array', 'Object', 'Boolean', 'String', 'Map', 'Set', 'WeakMap', 'Function'),

        /**
         * Creates a new primitive based on passed in string representation of type.  E.g., sjl.newPrimitive('Map')
         * @note Used internally when needing to flatten an object of a particular type (@see sjl.flatten)
         * @param type
         */
        newPrimitive: function (type) {
            var retVal = {};
            switch(type) {
                case 'Array':
                    retVal = [];
                    break;
                case 'String':
                    retVal = '';
                    break;
                case 'Map':
                    retVal = new Map();
                    break;
                case 'Set':
                    retVal = new Set();
                    break;
                case 'WeakMap':
                    retVal = new WeakMap();
                    break;
                case 'Function':
                    retVal = function () {};
                    break;
                case 'Object':
                default:
                    retVal = {};
                    break;
            }
        }
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
     * Extracts a boolean from the beginning or ending of an array depending on startOrEndBln.
     * @todo ** Note ** Closure within this function is temporary and should be removed.
     * @param array {Array}
     * @param startOrEndBln {Boolean}
     * @returns {Boolean}
     */
    function extractBoolFromArray(array, startOrEndBln) {
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

    // If is server environment
    if (isNodeEnv) {

        // Make top level namespace object
        sjl.package = require('../sjl-nodejs/Namespace')(__dirname)

        // Export sjl
        module.exports = sjl;
    }

    // Is frontend use
    else {

        // Make sjl un-overwrittable from the frontend
        Object.defineProperty(window, 'sjl', {
            value: sjl
        });

        // Create top level frontend package
        sjl.createTopLevelPackage(sjl);
    }

})(typeof window === 'undefined');
