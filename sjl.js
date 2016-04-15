/**! sjljs 5.0.2
 * | License: GPL-2.0+ AND MIT
 * | md5checksum: a96e0f80375864713baaef71bbff3dd3
 * | Built-on: Fri Apr 15 2016 17:52:37 GMT-0400 (Eastern Daylight Time)
 **//**
 * The `sjl` module.
 * @module {Object} sjl
 * @created by Ely on 5/29/2015.
 * @todo add extract value from array if of type (only extract at array start or end).
 * @todo Ensure that all methods in library classes return a value ({self|*}) (makes for a more functional library).
 * @todo Cleanup jsdocs and make them more readable where possible (some of the jsdoc definitions in sjljs's source files are old and need to be written using es5 and es6 kind of language to make them more readable to the user (also since most of the functionality is es5/es6ish makes sense to perform this upgrade).
 * @todo add default value returns for isset, issetMulti, empty and their variations (makes code more functional and adds syntactical sugar).
 * @todo add a `pluck` method that allows you to pluck values from a `Set`, `Array`, `Map` or `Object` based on parameters passed in.
 */
(function (undefined) {

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
        start = typeof start === _undefined ? 0 : start;
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
     * @returns {Array<*,Array>|Null} - If passed in array has an element at `index` (and alternately) element
     *  matches `type` then returns an array with found index and resulting array of extraction of said value.
     *  Else returns `null`.
     * @todo Add readme entry for this function (`extractFromArrayAt`).
     */
    function extractFromArrayAt (array, index, type, makeCopyOfArray) {
        var retVal = null,
            matchesType, foundElement;
        makeCopyOfArray = classOfIs(makeCopyOfArray, 'Boolean') ? makeCopyOfArray : true;
        if (array.hasOwnProperty(index + '')) {
            if (makeCopyOfArray) {
                array = array.concat([]);
            }
            foundElement = array[index];
            matchesType = isset(type) ? classOfIs(foundElement, type) : true;
            foundElement = array.splice(index, 1);
            if (matchesType) {
                retVal = [foundElement, array];
            }
        }
        return retVal;
    }

    /**
     * Checks to see if value passed in is set (not undefined and not null).
     * @function module:sjl.isset
     * @returns {Boolean}
     */
    function isset (value) {
        return typeof value !== _undefined && value !== null;
    }

    /**
     * Checks if one or more parameters are set (not null and not undefined).
     * @returns {Boolean} - True if all params passed in are not null or undefined.
     */
    function issetMulti (/** arg... **/) {
        return argsToArray(arguments).some(function (value) {
            return !isset(value);
        }) ? false : true;
    }

    /**
     * Checks whether a value isset and if it's type is the same as the type name passed in.
     * @function module:sjl.issetAndOfType
     * @param value {*} - Value to check on.
     * @param type {String|Function} - Type name to check for;  E.g., 'Number', 'Array', 'HTMLMediaElement' etc.
     * @returns {Boolean}
     */
    function issetAndOfType (value, type) {
        return isset(value) && classOfIs(value, type);
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
        return classOf(obj) === (
                classOf(type) === String.name ? type : (
                    type instanceof Function ? type.name : null
                )
            );
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
     * @returns {Boolean} - Returns true if any of the values passed
     */
    function emptyMulti (/** arg... **/) {
        return argsToArray(arguments).some(function (value) {
            return isEmpty(value);
        });
    }

    /**
     * Retruns a boolean based on whether a key on an object has an empty value or is empty (not set, undefined, null)
     * @function module:sjl.isEmptyOrNotOfType
     * @param obj {Object} - Object to search on.
     * @param type {String} - Optional. Type Name to check for match for;  E.g., 'Number', 'Array', 'HTMLMediaElement' etc..
     * @returns {Boolean}
     */
    function isEmptyOrNotOfType (value, type) {
        return isEmpty(value) || isset(type) ? !classOfIs(value, type) : false;
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
     * returned.
     * @example
     * // will create/fetch within `obj`: hello: { world: { how: { are: { you: { doing: {} } } } } }
     * namespace('hello.world.how.are.you.doing', obj)
     *
     * @function module:sjl.naiveNamespace
     * @param ns_string {String} - The namespace you wish to fetch
     * @param objToSearch {Object} - The object to search for namespace on
     * @param valueToSet {Object} - Optional.  A value to set on the key (last key if key string (a.b.c.d = value)).
     * @returns {Object}
     */
    function naiveNamespace (ns_string, objToSearch, valueToSet) {
        var parts = ns_string.split('.'),
            parent = objToSearch,
            shouldSetValue = !classOfIs(valueToSet, 'Undefined'),
            i;

        for (i = 0; i < parts.length; i += 1) {
            if (parts[i] in parent === false || classOfIs(parent[parts[i]], 'Undefined')) {
                parent[parts[i]] = {};
            }
            if (i === parts.length - 1 && shouldSetValue) {
                parent[parts[i]] = valueToSet;
            }
            parent = parent[parts[i]];
        }

        return parent;
    }

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
     * @deprecated
     * @returns {Object}
     */
    function namespace (ns_string, objToSearch, valueToSet) {
        return naiveNamespace(ns_string, objToSearch, valueToSet);
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
        var newStr = '', i,

        // Get clean string
            parts = str.split(replaceStrRegex);

        // Upper Case First char for parts
        for (i = 0; i < parts.length; i += 1) {

            // If alpha chars
            if (/[a-z\d]/.test(parts[i])) {

                // ucase first char and append to new string,
                // if part is a digit just gets returned by `ucaseFirst`
                newStr += ucaseFirst(parts[i]);
            }
        }

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
        if (classOfIs(list, 'Array')) {
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
     * @returns {*} - If property chain is not found then returns `null`.
     */
    function searchObj (ns_string, objToSearch) {
        var parts = ns_string.split('.'),
            parent = objToSearch,
            i;
        for (i = 0; i < parts.length; i += 1) {
            if (parts[i] in parent === false || classOfIs(parent[parts[i]], 'Undefined')) {
                parent = null;
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
        return !isEmptyOrNotOfType(obj[method], 'Function');
    }

    /**
     * Searches obj for key and returns it's value.  If value is a function
     * calls function if `raw` is set to `false`, with optional `args`, and returns it's return value.
     * If `raw` is true returns the actual function if value found is a function.
     * @function module:sjl.getValueFromObj
     * @param key {String} The hash key to search for
     * @param obj {Object} the hash to search within
     * @param args {Array} optional the array to pass to value if it is a function
     * @param raw {Boolean} optional whether to return value even if it is a function.  Default `true`.
     * @param useLegacyGetters {Boolean} - Default false.
     *  Whether to use legacy getters to fetch the value ( get{key}() or overloaded {key}() )
     *
     * @returns {*}
     */
    function getValueFromObj (key, obj, args, raw, useLegacyGetters) {
        args = args || null;
        raw = isset(raw) ? raw : true;
        useLegacyGetters = !isset(useLegacyGetters) ? false : useLegacyGetters;

        // Get qualified getter function names
        var overloadedGetterFunc = camelCase(key, false),
            getterFunc = 'get' + camelCase(key, true),
            retVal = null;

        // Resolve return value
        if (key.indexOf('.') !== -1) {
            retVal = searchObj(key, obj);
        }
        // If obj has a getter function for key, call it
        else if (useLegacyGetters && hasMethod(obj, getterFunc)) {
            retVal = obj[getterFunc]();
        }
        else if (useLegacyGetters && hasMethod(obj, overloadedGetterFunc)) {
            retVal = obj[overloadedGetterFunc]();
        }
        else if (typeof obj[key] !== _undefined) {
            retVal = obj[key];
        }

        // Decide what to do if return value is a function
        if (classOfIs(retVal, 'Function') && isEmpty(raw)) {
            retVal = args ? retVal.apply(obj, args) : retVal.apply(obj);
        }

        // Return result of setting value on obj, else return obj
        return retVal;
    }

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
    function setValueOnObj (key, value, obj) {
        // Get qualified setter function name
        var overloadedSetterFunc = camelCase(key, false),
            setterFunc = 'set' + camelCase(key, true),
            retVal = obj;

        // Else set the value on the obj
        if (key.indexOf('.') !== -1) {
            retVal = naiveNamespace(key, obj, value);
        }
        // If obj has a setter function for key, call it
        else if (hasMethod(obj, setterFunc)) {
            retVal = obj[setterFunc](value);
        }
        else if (hasMethod(obj, overloadedSetterFunc)) {
            retVal = obj[overloadedSetterFunc](value);
        }
        else {
            obj[key] = typeof value !== _undefined ? value : null;
        }

        // Return result of setting value on obj, else return obj
        return retVal;
    }

    /** Idea:
     * Have hydrators for different hydration strategies (but simplified ones! jeje look at Zf's hydration stuff pretty cool
     * but a bit too granular for javascript: http://framework.zend.com/apidoc/2.4/namespaces/Zend.Stdlib.Hydrator.html

     // Hydration method
     sjl.hydrate = function () {
        var lastParam = sjl.extractFromArrayAt(arguments, arguments.length - 1),
            retVal;
        switch (lastParam) {
            case sjl.hydrate.BY_OVERLOADED_METHODS:
                break;
            case sjl.hydrate.BY_LEGACY_GETTERS_AND_SETTERS:
                break;
            case sjl.hydrate.BY_OWN_PROPS:
            default:
                sjl.extend();
                break;
        }
        return retVal;
     };

     // Strategy for hydration
     sjl.hydrateByOwnProps = function (obj, inheritFrom, deep) {};

     // Stategy for hydration
     sjl.hydrateByMethods = function (obj, inheritFrom, deep) {};

     // Constants representing different hydration strategies
     Object.defineProperties(sjl.hydrate, {
        BY_OWN_PROPS: {value: 0},
        BY_OVERLOADED_METHODS: {value: 1},
        BY_LEGACY_GETTERS_AND_SETTERS: {value: 2}
     });

     * Not pursuing idea just jotting it down here for future reference.
     */

    /**
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is overwritten.
     * If `useLegacyGettersAndSetters` is set method will inject values to o via
     * any setters it finds (whether overloaded setters/getters or setters of
     * the for `set{PropertyName}`).
     * @param o {*} - *object to extend
     * @param p {*} - *object to extend from
     * @param deep {Boolean} - Whether or not to do a deep extend (run extend on each prop if prop value is of type 'Object')
     * @param useLegacyGettersAndSetters {Boolean} - Whether or not to use legacy getters and setters (`(s|g)et{PropName}`) or overloaded methods ('propName' -> 'propName(in propName)')
     * @returns {*} - returns o
     */
    function extend(o, p, deep, useLegacyGettersAndSetters) {
        deep = deep || false;
        useLegacyGettersAndSetters = useLegacyGettersAndSetters || false;

        var propDescription;

        // If `o` or `p` are not set bail
        if (!isset(o) || !isset(p)) {
            return o;
        }

        // Merge all props from `p` to `o`
        Object.keys(p).forEach(function (prop) { // For all props in p.
            // If property is present on target (o) and is not writable, skip iteration
            propDescription = Object.getOwnPropertyDescriptor(o, prop);
            if (propDescription && (!isset(propDescription.get) && !isset(propDescription.set)) && !propDescription.writable) {
                return;
            }
            if (deep === true) {
                if (classOfIs(p[prop], Object)
                    && classOfIs(o[prop], Object)
                    && !isEmptyObj(p[prop])) {
                    extend(o[prop], p[prop], deep);
                }
                else if (useLegacyGettersAndSetters) {
                    setValueOnObj(prop,
                        getValueFromObj(prop, p, null, true, useLegacyGettersAndSetters),
                        o);
                }
                else {
                    o[prop] = p[prop];
                }
            }
            else if (useLegacyGettersAndSetters) {
                setValueOnObj(prop,
                    getValueFromObj(prop, p, null, true, useLegacyGettersAndSetters),
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
            useLegacyGettersAndSetters = extractBoolFromArrayEnd(args),
            arg0 = args.shift();

        // Extend object `0` with other objects
        args.forEach(function (arg) {
            // Extend `arg0` if `arg` is an object
            if (classOfIs(arg, 'Object')) {
                extend(arg0, arg, deep, useLegacyGettersAndSetters);
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

        // Helper for missing constructors.
        function StandInConstructor() {
            console.warn(
                'An anonymous constructor was used!  Please ' +
                'replace it with a named constructor for best ' +
                'interoperability.'
            );
            superclass.apply(this, arguments);
        }

        // If `constructor` param is an object then
        if (classOfIs(constructor, Object)) {

            // Set static methods, if any
            statics = methods;

            // Set methods
            methods = constructor;

            // Decide whether to use a stand in constructor or the user supplied one
            constructor = !( methods.constructor instanceof Function )
                ? StandInConstructor : methods.constructor;

            // Unset the constructor from the methods hash since we have a pointer to it
            unset(methods, 'constructor');
        }

        // Ensure a constructor is set
        constructor = isset(constructor) ? constructor : StandInConstructor;

        // Set up the prototype object of the subclass
        constructor.prototype = Object.create(superclass.prototype);

        /**
         * Extends a new copy of self with passed in parameters.
         * @memberof class:sjl.ns.stdlib.Extendable
         * @static sjl.ns.stdlib.Extendable.extend
         * @param constructor {Function|Object} - Required.  If this param is an `Object` then the `methods` param becomes
         *  the `statics` param (as if this param is an Object then it can contain methods within itself).
         * @param methods {Object|undefined} - Methods.  Optional.
         * @param statics {Object|undefined} - Static methods.  Optional.
         */
        constructor.extend = function (constructor_, methods_, statics_) {
            return defineSubClass(constructor, constructor_, methods_, statics_);
        };

        // Define constructor's constructor
        constructor.prototype.constructor = constructor;

        // Copy the methods and statics as we would for a regular class
        if (methods) extend(constructor.prototype, methods);

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
     * @param dirPath {String} - If using NodeJs only.  Optional.  Default `__dirname`.
     * @param pathsToIgnore {Array} - If using NodeJs only.  Causes the namespacer to
     *  ignore passed in paths as namespaces.  Optional.  Default `null`.
     * @return {Object|*} - Returns passed in `obj`.
     */
    function createTopLevelPackage (obj, funcKey, altFuncKey, dirPath, pathsToIgnore) {
        funcKey = funcKey || 'package';
        altFuncKey = altFuncKey || 'ns';
        if (isNodeEnv) {
            dirPath = dirPath || __dirname;
            obj[altFuncKey] = obj[funcKey] =
                require('./nodejs-specific/Namespace.js')(dirPath, ['.js', '.json'], pathsToIgnore);
            return obj;
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
    function constrainPointerWithinBounds (pointer, min, max) {
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
    function wrapPointerWithinBounds (pointer, min, max) {
        return pointer > max ? min : (pointer < min ? max : pointer);
    }

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
    function throwTypeErrorIfNotOfType (contextName, paramName, value, type, fixHint) {
        type = classOfIs(type, 'String') ? type : type.name;
        var classOfValue = classOf(value);
        if (classOfValue !== type) {
            throw new TypeError('#`' + contextName + '`.`' + paramName
                + '` is not of type "' + type + '".  ' + (fixHint || '')
                + '  Type received: "' + classOfValue);
        }
        return sjl;
    }

    /**
     * Returns value if it is set and of type else returns `defaultValue`
     * @function module:sjl.value
     * @param value {*} - Value to pass through.
     * @param defaultValue {*} - Optional.  Value to use as default value if value is not set.  Default `null`.
     * @param type {String|Function} - Optional.  Constructor or string representation of type;  E.g., String or 'String'
     */
    function value (value, defaultValue, type) {
        defaultValue = typeof defaultValue === _undefined ? null : defaultValue;
        var retVal;
        if (isset(type)) {
            retVal = issetAndOfType(value) ? value : defaultValue;
        }
        else {
            retVal = isset(value) ? value : defaultValue;
        }
        return retVal;
    }

    /**
     * Sets a property on `obj` as not `configurable` and not `writable` and allows you to set whether it is enumerable or not.
     * @function module:sjl.makeNotSettableProp
     * @param obj {Object}
     * @param key {String}
     * @param value {*}
     * @param enumerable {Boolean} - Default `false`.
     * @return {Void}
     */
    function makeNotSettableProp(obj, key, value, enumerable) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: classOfIs(enumerable, Boolean) ? enumerable : false
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
        if (classOfIs(search, 'Number') && search > -1) {

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
            retVal = false;
        if (classOfIs(expectedBool, 'Boolean')) {
            retVal = startOrEndBln ? array.shift() : array.pop();
        }
        else if (classOfIs(expectedBool, 'undefined')) {
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

    sjl = {
        argsToArray: argsToArray,
        restArgs: restArgs,
        extractFromArrayAt: extractFromArrayAt,
        isset: isset,
        issetMulti: issetMulti,
        issetAndOfType: issetAndOfType,
        classOf: classOf,
        classOfIs: classOfIs,
        empty: isEmpty,
        emptyMulti: emptyMulti,
        isEmptyObj: isEmptyObj,
        isEmptyOrNotOfType: isEmptyOrNotOfType,
        unset: unset,
        naiveNamespace: naiveNamespace,
        namespace: naiveNamespace,
        lcaseFirst: lcaseFirst,
        ucaseFirst: ucaseFirst,
        camelCase: camelCase,
        implode: implode,
        searchObj: searchObj,
        hasMethod: hasMethod,
        getValueFromObj: getValueFromObj,
        setValueOnObj: setValueOnObj,
        extend: extendMulti,
        clone: clone,
        jsonClone: jsonClone,
        defineSubClass: defineSubClass,
        createTopLevelPackage: createTopLevelPackage,
        makeNotSettableProp: makeNotSettableProp,
        extractBoolFromArrayEnd: extractBoolFromArrayEnd,
        extractBoolFromArrayStart: extractBoolFromArrayStart,
        throwTypeErrorIfNotOfType: throwTypeErrorIfNotOfType,
        value: value,
        constrainPointerWithinBounds: constrainPointerWithinBounds,
        wrapPointerWithinBounds: wrapPointerWithinBounds
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

        // Allow all members from `sjl.ns.stdlib` to live and be accesible directly on `sjl`
        var path = require('path'),
            fs = require('fs'),
            stdlibPath = path.join(libSrcRootPath, 'stdlib');

        // Loop through files in 'sjl/stdlib'
        fs.readdirSync(stdlibPath).forEach(function (file) {
            var filePath = path.join(stdlibPath, file);

            // If file is not a directory, of either *.js or *.json file format, and a constructor
            // then make it accessible on `sjl`
            if (!fs.statSync(filePath).isDirectory()
                && ['.js', '.json'].indexOf(path.extname(file)) > -1
                && file[0].toUpperCase() === file[0]) {

                // Allow module to be fetched as a getter
                Object.defineProperty(sjl, file.substr(0, file.lastIndexOf('.')), {
                    get: function () {
                        return require(filePath);
                    }
                });
            }
        });
    }

    // Create top level frontend package.
    sjl = createTopLevelPackage(sjl, 'package', 'ns', libSrcRootPath);

    // Export sjl globally g(the node global export will be deprecated at a later version)
    Object.defineProperty(globalContext, 'sjl', {
        value: sjl
    });

    // Return sjl if amd is being used
    if (!isNodeEnv && globalContext.__isAmd) {
        return sjl;
    }

}());

/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Extendable = function Extendable () {};

    /**
     * The `sjl.ns.stdlib.Extendable` constructor (a constructor that has a static `extend` method for easy extending).
     * @class module:sjl.ns.stdlib.Extendable
     * @memberof namespace:sjl.ns.stdlib
     */
    Extendable = sjl.defineSubClass(Function, Extendable);


    // Export `Extendable`
    if (isNodeEnv) {
        module.exports = Extendable;
    }
    else {
        sjl.ns('stdlib.Extendable', Extendable);
        sjl.makeNotSettableProp(sjl, 'Extendable', Extendable);
        if (window.__isAmd) {
            return Extendable;
        }
    }

    /**
     * @static class:sjl.ns.stdlib.Extendable#extend
     */

})();

/**
 * Created by Ely on 6/21/2014.
 */
(function () {

    'use strict';

    var _undefined = 'undefined',
        isNodeEnv = typeof window === _undefined,
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Attributable = function Attributable(attributes) {
            this.attr(attributes);
        };

    /**
     * @class Attributable
     * @extends sjl.ns.stdlib.Extendable
     * @memberof module:sjl.ns.stdlib
     * @param attributes {Object} - Attributes to set on instantiation of the Attributable.  Optional.
     * @deprecated This class is going to be removed for version `0.6.0`.
     * @type {void|Object|*}
     */
    Attributable = sjl.ns.stdlib.Extendable.extend(Attributable, {

        /**
         * Gets or sets a collection of attributes.
         * @method sjl.ns.stdlib.Attributable#attr
         * @param attr {mixed|Array|Object} - Attributes to set or get from object
         * @returns {sjl.ns.stdlib.Attributable}
         */
        attr: function (attr) {
            var self = this,
                retVal = self;

            switch (sjl.classOf(attr)) {
                // If is 'array' then is a getter
                case 'Array':
                    retVal = self._getAttribs(attr);
                    break;

                // If is an 'object' then is a setter
                case 'Object':
                    sjl.extend(true, self, attr, true);
                    break;

                // If is a 'string' then is a getter
                case 'String':
                    // Is setter
                    if (arguments.length >= 2) {
                        sjl.setValueOnObj(attr, arguments[1], self);
                    }
                    // Is getter
                    else {
                        retVal = sjl.getValueFromObj(attr, self);
                    }
                    break;
                default:
                    sjl.extend(true, self, attr);
                    break;
            }

            return retVal;
        },

        /**
         * Gets a set of attributes hash for queried attributes.
         * @method sjl.ns.stdlib.Attributable#_getAttribs
         * @param attribsList {Array} - Attributes list to return
         * @returns {*}
         * @private
         */
        _getAttribs: function (attrList) {
            var out = {},
                self = this;

            // Loop through attributes to get and set them for return
            attrList.forEach(function (attrib) {
                out[attrib] = typeof self[attrib] !== _undefined
                    ? sjl.getValueFromObj(attrib, self) : null;
            });

            // Return queried attributes
            return out;
        }

    });

    if (isNodeEnv) {
        module.exports = Attributable;
    }
    else {
        sjl.ns('stdlib.Attributable', Attributable);
        sjl.makeNotSettableProp(sjl, 'Attributable', Attributable);
        if (window.__isAmd) {
            return Attributable;
        }
    }

})();

/**
 * Created by Ely on 7/21/2014.
 * @note `set` and `setOptions` are different from the `merge` function in
 *  that they force the use of legacy setters if they are available;
 *  e.g., setName, setSomePropertyName, etc..
 */
(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Optionable = function Optionable(/*[, options]*/) {
            this.options = new sjl.ns.stdlib.Attributable();
            this.merge.apply(this, arguments);
        };

    /**
     * Optionable Constructor merges all objects passed in to it's `options` hash.
     * Also this class has convenience methods for querying it's `options` hash (see `get` and `set` methods.
     * @note when using this class you shouldn't have a nested `options` attribute directly within options
     * as this will cause adverse effects when getting and setting properties via the given methods.
     * @class sjl.ns.stdlib.Optionable
     * @extends sjl.ns.stdlib.Extendable
     * @type {void|sjl.ns.stdlib.Optionable}
     */
    Optionable = sjl.ns.stdlib.Extendable.extend(Optionable, {
        /**
         * Sets an option on Optionable's `options` using `sjl.setValueOnObj`;
         *  E.g., `optionable.options = value`;
         * @deprecated - Will be removed in version 1.0.0
         * @method sjl.ns.stdlib.Optionable#setOption
         * @param key
         * @param value
         * @returns {sjl.ns.stdlib.Optionable}
         */
        setOption: function (key, value) {
            sjl.setValueOnObj(key, value, this.options);
            return this;
        },

        /**
         * Sets each key value pair to  Optionable's `options` using
         *  `sjl.Attributable`'s `attr` function;
         *  E.g., `optionable.options.attr(Object);
         * @deprecated - Will be removed in version 1.0.0
         * @method sjl.ns.stdlib.Optionable#setOptions
         * @param key {String}
         * @param value {Object}
         * @returns {sjl.ns.stdlib.Optionable}
         */
        setOptions: function (options) {
            if (sjl.classOfIs(options, 'Object')) {
                this.options.attr(options);
            }
            return this;
        },

        /**
         * Gets an options value by key.
         * @deprecated - Slotted for removal in version 1.0.0
         * @method sjl.ns.stdlib.Optionable#getOption
         * @param key {String}
         * @returns {*}
         */
        getOption: function (key) {
            return sjl.getValueFromObj(key, this.options);
        },

        /**
         * Gets options by either array or just by key.
         * @deprecated - Slotted for removal in version 1.0.0
         * @method sjl.ns.stdlib.Optionable#getOptions
         * @param options {Array|String}
         * @returns {*}
         */
        getOptions: function (options) {
            var classOfOptions = sjl.classOf(options),
                retVal = this.options;
            if (classOfOptions === 'Array' || classOfOptions === 'String') {
                retVal = this.options.attr(options);
            }
            return retVal;
        },

        /**
         * Gets one or many option values.
         * @method sjl.ns.stdlib.Optionable#get
         * @param keyOrArray
         * @returns {*}
         */
        get: function (keyOrArray) {
            return this.getOptions(keyOrArray);
        },

        /**
         * Sets an option (key, value) or multiple options (Object)
         * based on what's passed in.
         * @method sjl.ns.stdlib.Optionable#set
         * @param0 {String|Object}
         * @param1 {*}
         * @returns {sjl.ns.stdlib.Optionable}
         */
        set: function () {
            var self = this,
                args = arguments,
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
         * @method sjl.ns.stdlib.Optionable#has
         * @param nsString - key or namespace string
         * @returns {Boolean}
         */
        has: function (nsString) {
            return sjl.isset(sjl.searchObj(nsString, this.options));
        },

        /**
         * Merges all objects passed in to `options`.
         * @method sjl.ns.stdlib.Optionable#merge
         * @param ...options {Object} - Any number of `Object`s passed in.
         * @param useLegacyGettersAndSetters {Object|Boolean|undefined}
         * @returns {sjl.ns.stdlib.Optionable}
         */
        merge: function (options) {
            sjl.extend.apply(sjl, [true, this.options].concat(sjl.argsToArray(arguments)));
            return this;
        }
    });

    if (isNodeEnv) {
        module.exports = Optionable;
    }
    else {
        sjl.ns('stdlib.Optionable', Optionable);
        sjl.makeNotSettableProp(sjl, 'Optionable', Optionable);
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
        errorContextName = 'sjl.ns.stdlib.Iterator',

        Iterator = function Iterator(values, pointer) {
            var _values,
                _pointer = 0;

            // Define properties before setting values
            Object.defineProperties(this, {
                _values: {
                    /**
                     * @returns {Array}
                     */
                    get: function () {
                        return _values;
                    },
                    /**
                     * @param values {Array}
                     * @throws {TypeError}
                     * @note Pointer gets constrained to bounds of `values`'s length if it is out of
                     *  bounds (if it is less than `0` gets pushed to `0` if it is greater than values.length
                     *      gets pulled back down to values.length).
                     */
                    set: function (values) {
                        sjl.throwTypeErrorIfNotOfType(errorContextName, 'values', values, Array);
                        _values = values;
                        this._pointer = _pointer; // Force pointer within bounds (if it is out of bounds)
                    }
                },
                _pointer: {
                    /**
                     * @returns {Number}
                     */
                    get: function () {
                        return _pointer;
                    },
                    /**
                     * @param pointer {Number}
                     * @throws {TypeError}
                     */
                    set: function (pointer) {
                        sjl.throwTypeErrorIfNotOfType(errorContextName, 'pointer', pointer, Number);
                        _pointer = sjl.constrainPointerWithinBounds(pointer, 0, _values.length);
                    }
                },
                size: {
                    get: function () {
                        return _values.length;
                    }
                }
            }); // End of properties define

            // Set values
            this._values = values || [];
        };

    /**
     * @class sjl.ns.stdlib.Iterator
     * @extends sjl.ns.stdlib.Extendable
     * @type {void|Object|*}
     */
    Iterator = sjl.ns.stdlib.Extendable.extend(Iterator, {
        /**
         * Returns the current value that `pointer` is pointing to.
         * @method sjl.ns.stdlib.Iterator#current
         * @returns {{done: boolean, value: *}}
         */
        current: function () {
            var self = this;
            return self.valid() ? {
                done: false,
                value: self._values[self._pointer]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.ns.stdlib.Iterator#next
         * @returns {{done: boolean, value: *}}
         */
        next: function () {
            var self = this,
                pointer = self._pointer,
                retVal = self.valid() ? {
                    done: false,
                    value: self._values[pointer]
                } : {
                    done: true
                };
            self._pointer += 1;
            return retVal;
        },

        /**
         * Rewinds the iterator.
         * @method sjl.ns.stdlib.Iterator#rewind
         * @returns {sjl.ns.stdlib.Iterator}
         */
        rewind: function () {
            return this.pointer(0);
        },

        /**
         * Returns whether the iterator has reached it's end.
         * @method sjl.ns.stdlib.Iterator#valid
         * @returns {boolean}
         */
        valid: function () {
            return this._pointer < this._values.length;
        },

        /**
         * Overloaded getter and setter for `_pointer` property.
         * @param pointer {Number|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.ns.stdlib.Iterator}
         * @throws {TypeError} - If `pointer` is set and is not of type `Number`.
         */
        pointer: function (pointer) {
            var retVal = this;
            // If is a getter call get the value
            if (typeof pointer === _undefined) {
                retVal = this._pointer;
            }
            // If is a setter call
            else {
                // Set and validate pointer (validated via `_pointer` getter property definition)
                this._pointer = pointer;
            }
            return retVal;
        },

        /**
         * Overloaded getter and setter for `_values` property.
         * @param values {Array|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.ns.stdlib.Iterator}
         * @throws {TypeError} - If `values` is set and is not of type `Array`.
         */
        values: function (values) {
            var retVal = this;
            // If is a getter call get the value
            if (typeof values === _undefined) {
                retVal = this._values;
            }
            // If is a setter call
            else {
                // Set and check if value is of expected type and throw error if
                // it is not (done via `_values` property definition).
                this._values = values;
            }
            return retVal;
        },

        /**
         * Iterates through all elements in iterator.  @note Delegates to it's values `forEach` method.
         * @param callback {Function}
         * @param context {Object}
         * @returns {sjl.ns.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            this._values.forEach(callback, context);
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = Iterator;
    }
    else {
        sjl.ns('stdlib.Iterator', Iterator);
        sjl.makeNotSettableProp(sjl, 'Iterator', Iterator);
        if (window.__isAmd) {
            return sjl.ns.stdlib.Iterator;
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
        Iterator = sjl.ns.stdlib.Iterator,
        contextName = 'sjl.ns.stdlib.ObjectIterator',

        /**
         * Constructor for ObjectIterator.
         * @param keysOrObj {Array|Object}
         * @param valuesOrPointer {Array|Number} - Array of values if first param is an array of keys.  Else the
         *  value would be used as the iterator's pointer in which case it would be optional.
         * @param pointer {Number} - Optional.
         */
        ObjectIterator = function ObjectIterator(keysOrObj, valuesOrPointer, pointer) {
            var obj, values,
                classOfParam1 = sjl.classOf(keysOrObj),
                receivedParamTypesList,
                _keys;

            // If called with obj as first param
            if (classOfParam1 === 'Object') {
                obj = keysOrObj;
                _keys = Object.keys(obj);
                pointer = valuesOrPointer;
                values = _keys.map(function (key) {
                    return obj[key];
                });
            }
            else if (classOfParam1 === 'Array') {
                _keys = keysOrObj;
                sjl.throwTypeErrorIfNotOfType(contextName, 'valuesOrPointer', valuesOrPointer, Array,
                    'With the previous param being an array `valuesOrPointer` can only be an array in this scenario.');
                values = valuesOrPointer;
                pointer = pointer || 0;
            }
            else {
                receivedParamTypesList = [sjl.classOf(keysOrObj), sjl.classOf(valuesOrPointer), sjl.classOf(pointer)];
                throw new TypeError ('#`' + contextName + '` recieved incorrect parameter values.  The expected ' +
                    'parameter list should one of two: [Object, Number] or [Array, Array, Number].  ' +
                    'Parameter list recieved: [' + receivedParamTypesList.join(', ') + '].');
            }

            // Extend #own properties with #Iterator's own properties
            Iterator.call(this, values, pointer);

            // Define other own properties
            Object.defineProperties(this, {
                _keys: {
                    get: function () {
                        return _keys;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType('ObjectIterator.keys', 'keys', value, Array);
                        _keys = value;
                    }
                }
            });
        };

    /**
     * @class sjl.ns.stdlib.ObjectIterator
     * @extends sjl.ns.stdlib.Iterator
     * @name ObjectIterator
     * @param keysOrObj {Array|Object} - Array of keys or object to create (object) iterator from.
     * @param valuesOrPointer {Array|Number} - Array of values if first param is an array of keys.  Else pointer.
     * @param pointer {Number} - Optional.
     * @type {sjl.ns.stdlib.ObjectIterator}
     */
    ObjectIterator = Iterator.extend(ObjectIterator, {
        /**
         * Returns the current key and value that `pointer()` is pointing to as an array [key, value].
         * @method sjl.ns.stdlib.Iterator#current
         * @returns {{ done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        current: function () {
            var self = this,
                pointer = self.pointer();
            return self.valid() ? {
                done: false,
                value: [self._keys[pointer], self.values[pointer]]
            } : {
                done: true
            };
        },

        /**
         * Method which returns the current position in the iterator based on where the pointer is.
         * This method also increases the pointer after it is done fetching the value to return.
         * @method sjl.ns.stdlib.Iterator#next
         * @returns {{done: boolean, value: (Array|undefined) }} - Where Array is actually [<*>, <*>] or of type [any, any].
         */
        next: function () {
            var self = this,
                pointer = self.pointer(),
                retVal = self.valid() ? {
                    done: false,
                    value: [self._keys[pointer], self._values[pointer]]
                } : {
                    done: true
                };
            self.pointer(pointer + 1);
            return retVal;
        },

        valid: function () {
            var pointer = this._pointer;
            return pointer < this._values.length && pointer < this._keys.length;
        },

        /**
         * Overloaded getter/setter method for internal `keys` property.
         * @returns {sjl.ns.stdlib.ObjectIterator|Array<*>}
         */
        keys: function (keys) {
            var retVal = this;
            if (typeof keys === _undefined) {
                retVal = this._keys;
            }
            else {
                // Type validated by property definition `this._keys`
                this._keys = keys;
            }
            return retVal;
        },

        /**
         * Iterates through all elements in iterator.  @note Delegates to it's values `forEach` method.
         * @param callback {Function}
         * @param context {Object}
         * @returns {sjl.ns.stdlib.Iterator}
         */
        forEach: function (callback, context) {
            var self = this,
                values = self._values;
            context = context || self;
            self._keys.forEach(function (key, index, keys) {
                callback.call(context, values[index], key, self);
            });
            return this;
        }

    });

    if (isNodeEnv) {
        module.exports = ObjectIterator;
    }
    else {
        sjl.ns('stdlib.ObjectIterator', ObjectIterator);
        sjl.makeNotSettableProp(sjl, 'ObjectIterator', ObjectIterator);
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
        Iterator = sjl.ns.stdlib.Iterator,
        ObjectIterator = sjl.ns.stdlib.ObjectIterator;

    /**
     * Turns an array into an iterable.
     * @function module:sjl.iterable
     * @param array {Array|Object} - Array or object to set iterator function on.
     * @param pointer {Number|undefined}
     * @returns array {Array|Object}
     */
    sjl.iterable = function (arrayOrObj, pointer) {
        var classOfArrayOrObj = sjl.classOf(arrayOrObj),
            keys, values;
        if (classOfArrayOrObj === 'Array') {
            arrayOrObj[sjl.Symbol.iterator] = function () {
                return new Iterator(arrayOrObj, pointer);
            };
        }
        else if (classOfArrayOrObj === 'Object') {
            keys = Object.keys(arrayOrObj);
            values = keys.map(function (key) {
                return arrayOrObj[key];
            });
            arrayOrObj[sjl.Symbol.iterator] = function () {
                return new ObjectIterator(keys, values, pointer);
            };
        }
        else {
            throw new Error('sjl.iterable only takes objects or arrays.  ' +
                'arrayOrObj param recieved type is "' + classOfArrayOrObj + '".  Value recieved: ' + arrayOrObj);
        }
        return arrayOrObj;
    };

    if (isNodeEnv) {
        module.exports = sjl.iterable;
    }
    else {
        sjl.ns('stdlib.iterable', sjl.iterable);
        sjl.makeNotSettableProp(sjl, 'iterable', sjl.iterable);
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
        stdlib = sjl.ns.stdlib,
        Extendable = stdlib.Extendable,
        ObjectIterator = stdlib.ObjectIterator,
        makeIterable = stdlib.iterable,
        SjlSet = function SjlSet (iterable) {
            var self = this,
                _values = [];

            Object.defineProperties(this, {
                _values: {
                    get: function () {
                        return _values;
                    },
                    set: function (value) {
                        sjl.throwTypeErrorIfNotOfType(SjlSet.name, '_values', value, Array);
                        _values = makeIterable(value);
                    }
                },
                size: {
                    get: function () {
                        return _values.length;
                    }
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
            self._iteratorOverridden = true;
        };

    /**
     * SjlSet constructor.  This object has the same interface as the es6 `Set`
     * object.  The only difference is this one uses a more sugery iterator which
     * has, in addition to the `next` method, `current`, `iterator`, `pointer`, `rewind`, and
     * `valid` methods (@see sjl.Iterator)
     * @constructor SjlSet
     * @memberof namespace:sjl.ns.stdlib
     * @extends sjl.ns.stdlib.Extendable
     * @param iterable {Array}
     */
    SjlSet = Extendable.extend(SjlSet, {
        add: function (value) {
            if (!this.has(value)) {
                this._values.push(value);
            }
            return this;
        },
        clear: function () {
            while (this._values.length > 0) {
                this._values.pop();
            }
            return this;
        },
        delete: function (value) {
            var _index = this._values.indexOf(value);
            if (_index > -1 && _index <= this._values.length) {
                this._values.splice(_index, 1);
            }
            return this;
        },
        entries: function () {
            return new ObjectIterator(this._values, this._values, 0);
        },
        forEach: function (callback, context) {
            this._values.forEach(callback, context);
            return this;
        },
        has: function (value) {
            return this._values.indexOf(value) > -1 ? true : false;
        },
        keys: function () {
            return this._values[sjl.Symbol.iterator]();
        },
        values: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**************************************************
         * METHODS NOT PART OF THE `Set` spec for ES6:
         **************************************************/

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

        iterator: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        toJSON: function () {
            return this._values;
        }
    });

    if (isNodeEnv) {
        module.exports = SjlSet;
    }
    else {
        sjl.ns('stdlib.SjlSet', SjlSet);
        sjl.makeNotSettableProp(sjl, 'SjlSet', SjlSet);
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

        Extendable = sjl.ns.stdlib.Extendable,

        ObjectIterator = sjl.ns.stdlib.ObjectIterator,

        makeIterable = sjl.ns.stdlib.iterable,

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
     * @constructor sjl.ns.stdlib.SjlMap
     */
    SjlMap = Extendable.extend(SjlMap, {
        /**
         * Clears the `SjlMap` object of all data that has been set on it.
         * @method sjl.ns.stdlib.SjlMap#clear
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
         * @method sjl.ns.stdlib.SjlMap#delete
         * @param key {String} - Key of key-value pair to remove.
         * @returns {SjlMap}
         */
        delete: function (key) {
                var _index = this._keys.indexOf(key);
                if (this.has(key)) {
                    this._values.splice(_index, 1);
                    this._keys.splice(_index, 1);
                }
                return this;
            },

        /**
         * Returns the entries in this `SjlMap` as a valid es6 iterator to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.ns.stdlib.SjlMap#entries
         * @returns {sjl.ns.stdlib.ObjectIterator}
         */
        entries: function () {
                return new ObjectIterator(this._keys, this._values, 0);
            },

        /**
         * Iterates through all key value pairs in itself and passes them to `callback`
         *  on each iteration.
         * @method sjl.ns.stdlib.SjlMap#forEach
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
         * @method sjl.ns.stdlib.SjlMap#has
         * @param key {String} - Required.
         * @returns {boolean}
         */
        has: function (key) {
            return this._keys.indexOf(key) > -1;
        },

        /**
         * Returns the keys in this `SjlMap` as a valid es6 iterator object to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.ns.stdlib.SjlMap#keys
         * @returns {sjl.ns.stdlib.Iterator}
         */
        keys: function () {
            return this._keys[sjl.Symbol.iterator]();
        },

        /**
         * Returns the values in this `SjlMap` as a valid es6 iterator object to iterate over (usable in
         *  older versions of javascript).
         * @method sjl.ns.stdlib.SjlMap#values
         * @returns {sjl.ns.stdlib.Iterator}
         */
        values: function () {
            return this._values[sjl.Symbol.iterator]();
        },

        /**
         * Returns the value "set" for a key in instance.
         * @method sjl.ns.stdlib.SjlMap#get
         * @param key {String}
         * @returns {*}
         */
        get: function (key) {
            var index = this._keys.indexOf(key);
            return index > -1 ? this._values[index] : undefined;
        },

        /**
         * Sets a key-value pair in this instance.
         * @method sjl.ns.stdlib.SjlMap#set
         * @param key {String} - Key to set.
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
            index = null;
            return this;
        },

        /**************************************************
         * METHODS NOT PART OF THE `Set` spec for ES6:
         **************************************************/

        /**
         * Adds key-value array pairs in an array to this instance.
         * @method sjl.ns.stdlib.SjlMap#addFromArray
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
         * @method sjl.ns.stdlib.SjlMap#addFromObject
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
         * @method sjl.ns.stdlib.SjlMap#iterator
         * @returns {sjl.ns.stdlib.ObjectIterator}
         */
        iterator: function () {
            return this.entries();
        },

        /**
         * Shallow to json method.
         * @method sjl.ns.stdlib.SjlMap#toJSON
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

        // Set shortcut to class on `sjl`
        sjl.makeNotSettableProp(sjl, 'SjlMap', SjlMap);

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
        Extendable = sjl.ns.stdlib.Extendable,
        ObjectIterator = sjl.ns.stdlib.ObjectIterator,
        SjlMap = sjl.ns.stdlib.SjlMap,
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
         * @method sjl.ns.stdlib.PriorityList#current
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
         * @method sjl.ns.stdlib.PriorityList#next
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
         * @method sjl.ns.stdlib.PriorityList#rewind
         * @returns {sjl.ns.stdlib.PriorityList}
         */
        rewind: function () {
            this.itemsMap.rewind();
            return this;
        },

        /**
         * Overloaded getter and setter for internal maps `_pointer` property.
         * @param pointer {Number|undefined} - If undefined then method is a getter call else it is a setter call.
         * @returns {sjl.ns.stdlib.PriorityList}
         * @throws {TypeError} - If `pointer` is set and is not of type `Number`.
         */
        pointer: function (pointer) {
            var retVal = this;
            // If is a getter call get the value
            if (typeof pointer === _undefined) {
                retVal = this.itemsMap._pointer;
            }
            // If is a setter call
            else {
                // Set and validate pointer (validated via `_pointer` getter property definition)
                this.itemsMap._pointer = pointer;
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
            return new sjl.ns.stdlib.ObjectIterator(keys, values);
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
            return new sjl.ns.stdlib.Iterator(out);
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
         * @method sjl.ns.stdlib.PriorityList#addFromArray
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
         * @method sjl.ns.stdlib.PriorityList#addFromObject
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
         * @method sjl.ns.stdlib.PriorityList#iterator
         * @returns {sjl.ns.stdlib.ObjectIterator}
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

        // Set shortcut to class on `sjl`
        sjl.makeNotSettableProp(sjl, 'PriorityList', PriorityList);

        // If `Amd` return the class
        if (window.__isAmd) {
            return PriorityList;
        }
    }

})();
