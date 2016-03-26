/**! sjljs 0.5.39
 * | License: GPL-2.0+ AND MIT
 * | md5checksum: dfd0eb7e9b3ea4a23028f24947519073
 * | Built-on: Fri Mar 25 2016 20:56:31 GMT-0400 (EDT)
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
        return extend(true, {}, obj);
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
     * @return {Object|*} - Returns passed in `obj`.
     */
    function createTopLevelPackage (obj, funcKey, altFuncKey, dirPath) {
        funcKey = funcKey || 'package';
        altFuncKey = altFuncKey || 'ns';
        if (isNodeEnv) {
            dirPath = dirPath || __dirname;
            obj[altFuncKey] = obj[funcKey] =
                require('../sjl-nodejs/Namespace.js')(dirPath);
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

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */

'use strict';

(function () {

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Optionable = sjl.ns.stdlib.Optionable,
        BaseValidator = function BaseValidator(options) {
            var self = this,
                customTemplates;

            // Extend with optionable and set preliminary defaults
            Optionable.call(self, {
                messages: [],
                messageTemplates: {},
                messageVariables: {},
                messagesMaxLength: 100,
                valueObscured: false,
                value: null
            });

            // Merge custom templates in if they are set
            if (sjl.isset(options.customMessageTemplates)) {
                customTemplates = options.customMessageTemplates;
                options.customeMessageTemplates = null;
                delete options.customeMessageTemplates;
                self.setCustomMessageTemplates(customTemplates);
            }

            // Set passed in options if (any)
            self.setOptions(options);
        };

    BaseValidator = Optionable.extend(BaseValidator, {
        getMessagesMaxLength: function () {
            var self = this,
                maxMessageLen = self.getOption('maxMessagesLength');
            return sjl.classOfIs(maxMessageLen, 'Number') ? maxMessageLen : -1;
        },

        getMessages: function () {
            var self = this,
                messages = self.getOption('messages');
            return sjl.classOfIs(messages, 'Array') ? messages : [];
        },

        setMessages: function (messages) {
            this.options.messages = sjl.classOfIs(messages, 'Array') ? messages : [];
            return this;
        },

        clearMessages: function () {
            this.options.messages = [];
        },

        isValid: function (value) {
            throw Error('Can not instantiate `BaseValidator` directly, all class named with ' +
                'a prefixed "Base" should not be instantiated.');
        },

        isValueObscured: function () {
            var self = this,
                valObscured = self.getOption('valueObscured');
            return sjl.classOfIs(valObscured, 'Boolean') ? valObscured : false;
        },

        setValue: function (value) {
            this.options.value = value;
            this.options.messages = [];
            return this;
        },

        getValue: function (value) {
            var self = this;
            return !sjl.classOfIs(value, 'Undefined') ? (function () {
                self.setValue(value);
                return value;
            })() : this.getOption('value');
        },

        value: function (value) {
            var classOfValue = sjl.classOf(value),
                retVal = this.get('value');
            if (classOfValue !== 'Undefined') {
                this.options.value = value;
                retVal = this;
            }
            return retVal;
        },

        addErrorByKey: function (key) {
            var self = this,
                messageTemplate = self.getOption('messageTemplates'),
                messages = self.getOption('messages');

            // If key is string
            if (sjl.classOfIs(key, 'String') &&
                sjl.isset(messageTemplate[key])) {
                if (typeof messageTemplate[key] === 'function') {
                    messages.push(messageTemplate[key].apply(self));
                }
                else if (sjl.classOfIs(messageTemplate[key], 'String')) {
                    messages.push(messageTemplate[key]);
                }
            }
            else if (sjl.classOfIs(key, 'function')) {
                messages.push(key.apply(self));
            }
            else {
                messages.push(key);
            }
            return self;
        },

        getMessageTemplates: function () {
            return this.options.messageTemplates;
        },

        setMessageTemplates: function (templates) {
            if (!sjl.classOfIs(templates, 'Object')) {
                throw new Error('`AddToBagModel.setMessageTemplates` ' +
                    'expects parameter 1 to be of type "Object".');
            }
            this.options.messagesTemplates = templates;
            return this;
        },

        updateMessageTemplates: function (templates) {
            var self = this;
            if (!sjl.classOfIs(templates, 'Object')) {
                throw new Error('`AddToBagModel.updateMessageTemplates` ' +
                    'expects parameter 1 to be of type "Object".');
            }
            self.options.messageTemplates = sjl.extend(true, self.getMessageTemplates(), templates);
            return self;
        }

    });

    if (isNodeEnv) {
        module.exports = BaseValidator;
    }
    else {
        sjl.ns('validator.BaseValidator', BaseValidator);
        if (window.__isAmd) {
            return BaseValidator;
        }

    }

})();

/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {
    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.ns.validator.BaseValidator,
        ValidatorChain = function ValidatorChain(options) {

            // Call BaseValidator's constructor on this with some default options
            BaseValidator.call(this, {
                breakChainOnFailure: false
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    ValidatorChain = BaseValidator.extend(ValidatorChain, {
        isValid: function (value) {
            var self = this,
                retVal = true,
                validators,
                validator;

            // Set value internally and return it or get it
            value = self.getValue(value);

            // If an incorrectly implemented validator is found in chain
            // throws an error.
            self.verifyValidatorsInChain();

            // Clear any existing messages
            self.clearMessages();

            // Get validators
            validators = self.getValidators();

            // If we've made it this far validators are good proceed
            for (validator in validators) {
                if (!validators.hasOwnProperty(validator)) {
                    continue;
                }
                validator = validators[validator];
                if (validator.isValid(value)) {
                    continue;
                }

                // Else invalid validator found
                retVal = false;
                self.appendMessages(validator.getMessages());
                if (self.getOption('breakChainOnFailure')) {
                    break;
                }
            }

            return retVal;
        },

        addValidator: function (validator) {
            var self = this;
            if (self.verifyHasValidatorInterface(validator)) {
                self.getValidators().push(validator);
            }
            else {
                throw new Error('addValidator of ValidatorChain only ' +
                    'accepts validators that have the validator ' +
                    'interface ([\'isValid\', \'getMessages\'])');
            }
            return self;
        },

        addValidators: function (validators) {
            if (sjl.classOfIs(validators, 'Array')) {
                for (var i = 0; i < validators.length; i += 1) {
                    this.addValidator(validators[i]);
                }
            }
            else if (sjl.classOfIs(validators, 'Object')) {
                for (var validator in validators) {
                    if (validator.hasOwnProperty(validator)) {
                        this.addValidator(validators[validator]);
                    }
                }
            }
        },

        addByName: function (value) {
            // @todo flesh this method out
        },

        prependByName: function (value) {
            // @todo flesh this method out
        },

        mergeValidatorChain: function (validatorChain) {
            // @todo flesh this method out
        },

        appendMessages: function (messages) {
            var self = this;
            self.setMessages(self.getMessages().concat(messages));
            return self;
        },

        getValidators: function () {
            var self = this;
            if (!sjl.isset(self.options.validators)) {
                self.options.validators = [];
            }
            return self.options.validators;
        },

        setValidators: function (validators) {
            if (sjl.classOfIs(validators, 'Array')) {
                this.addValidators(validators);
            }
            else {
                throw new Error('`setValidators` of `ValidatorChain` expects ' +
                    '`param1` to be of type "Array".');
            }
            return this;
        },

        verifyHasValidatorInterface: function (validator) {
            var _interface = ['isValid', 'getMessages'],
                retVal = true,
                value;
            for (value in _interface) {
                if (!_interface.hasOwnProperty(value)) {
                    continue;
                }
                value = _interface[value];
                if (!sjl.isset(validator[value]) ||
                    typeof validator[value] !== 'function') {
                    retVal = false;
                    break;
                }
            }
            return retVal;
        },

        verifyValidatorsInChain: function (validatorChain) {

            var self = this,
                validators,
                validator;

            // Get validtor chain
            validatorChain = validatorChain || self;

            // Get validators
            validators = validatorChain.getValidators();

            for (validator in validators) {
                if (!validators.hasOwnProperty(validator)) {
                    continue;
                }
                validator = validators[validator];
                if (!self.verifyHasValidatorInterface(validator)) {
                    throw new Error('A validator with out the validator interface' +
                        'was found in ValidatorChain.  Please check the validators you are passing ' +
                        'in and make sure that they have the validator interface (["isValid", "getMessages"]).');
                }
            }
            return self;
        }
    });

    if (isNodeEnv) {
        module.exports = ValidatorChain;
    }
    else {
        sjl.ns('validator.ValidatorChain', ValidatorChain);
        if (window.__isAmd) {
            return ValidatorChain;
        }
    }

})();


/**
 * Created by Ely on 1/21/2015.
 */
/**
 * Created by Ely on 7/21/2014.
 * Initial idea copied from the Zend Framework 2's Between Validator
 */

'use strict';

(function () {

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.ns.validator.BaseValidator,
        AlphaNumValidator = function AlphaNumValidator (options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                messageTemplates: {
                    NOT_ALPHA_NUMERIC: function () {
                        return 'The input value is not alpha-numeric.  Value received: "' + this.getMin() + '" and "' + this.getMax() + '".';
                    }
                }
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    AlphaNumValidator = BaseValidator.extend(AlphaNumValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            value = sjl.isset(value) ? value : self.getValue();

            if (!sjl.isset(value)) {
                self.addErrorByKey('NOT_ALPHA_NUMERIC');
                return retVal;
            }
            else if (!/^[\da-z]+$/i.test(value)) {
                self.addErrorByKey('NOT_ALPHA_NUMERIC');
            }
            else {
                retVal = true;
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = AlphaNumValidator;
    }
    else {
        sjl.ns('validator.AlphaNumValidator', AlphaNumValidator);
        if (window.__isAmd) {
            return AlphaNumValidator;
        }

    }

})();

/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {
    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.ns.validator.BaseValidator,
        EmptyValidator = function EmptyValidator(options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                messageTemplates: {
                    EMPTY_NOT_ALLOWED: function () {
                        return 'Empty values are not allowed.';
                    }
                }
            });

            // Set options passed, if any
            this.setOptions(options);
        };

    EmptyValidator = BaseValidator.extend(EmptyValidator, {

        isValid: function (value) {
            var self = this,
                retVal = false;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            value = self.getValue(value);

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
        module.exports = EmptyValidator;
    }
    else {
        sjl.ns('validator.EmptyValidator', EmptyValidator);
        if (window.__isAmd) {
            return EmptyValidator;
        }
    }

})();

/**
 * Created by Ely on 7/21/2014.
 * Initial idea copied from the Zend Framework 2's Between Validator
 */

'use strict';

(function () {

    function throwNotIntError (value, paramName, funcName, expectedType) {
        throw Error(funcName + ' expects ' + paramName +
            ' to be of type "' + expectedType + '".  Value received: ' + value);
    }

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.ns.validator.BaseValidator,
        InRangeValidator = function InRangeValidator (options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                min: 0,
                messageTemplates: {
                    NOT_IN_RANGE_EXCLUSIVE: function () {
                        return 'The input value is not exclusively between "' + this.getMin() + '" and "' + this.getMax() + '".';
                    },
                    NOT_IN_RANGE_INCLUSVE: function () {
                        return 'The input value is not inclusively between "' + this.getMin() + '" and "' + this.getMax() + '".';
                    },
                    INVALID_TYPE: function () {
                        return 'The value "' + this.getValue() + '" is expected to be of type "Number".';
                    }
                },
                inclusive: true,
                max: 9999
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    InRangeValidator = BaseValidator.extend(InRangeValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            value = sjl.isset(value) ? value : self.getValue();

            if (!sjl.classOfIs(value, 'Number')) {
                self.addErrorByKey('INVALID_TYPE');
                return retVal;
            }

            if (self.getInclusive()) {
                retVal = value >= this.getMin() && value <= this.getMax();
                if (!retVal) {
                    self.addErrorByKey('NOT_IN_RANGE_INCLUSVE');
                }
            }
            else {
                retVal = value > this.getMin() && value < this.getMax();
                if (!retVal) {
                    self.addErrorByKey('NOT_IN_RANGE_EXCLUSIVE');
                }
            }
            return retVal;
        },

        getMin: function () {
            return this.getOption('min');
        },

        getMax: function () {
            return this.getOption('max');
        },

        getInclusive: function () {
            return this.getOption('inclusive');
        },

        setMin: function (min) {
            if (sjl.classOfIs(min, 'Number')) {
                return this.setOption('min', min);
            }
            throwNotIntError(min, 'min', 'InRangeValidator.setMin', 'Number');
        },

        setMax: function (max) {
            if (sjl.classOfIs(max, 'Number')) {
                return this.setOption('max', max);
            }
            throwNotIntError(max, 'max', 'InRangeValidator.setMax', 'Number');
        },

        setInclusive: function (value) {
            if (sjl.classOfIs(value, 'Boolean')) {
                return this.setOption('inclusive', value);
            }
            throwNotIntError(value, 'parameter 1', 'InRangeValidator.setInclusive', 'Boolean');
        }

    });

    if (isNodeEnv) {
        module.exports = InRangeValidator;
    }
    else {
        sjl.ns('validator.InRangeValidator', InRangeValidator);
        if (window.__isAmd) {
            return InRangeValidator;
        }
    }

})();

/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.ns.validator.BaseValidator,
        RegexValidator = function RegexValidator(options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                pattern: /./,
                messageTemplates: {
                    DOES_NOT_MATCH_PATTERN: function () {
                        return 'The value passed in does not match pattern"'
                            + this.getPattern() + '".  Value passed in: "'
                            + this.getValue() + '".';
                    }
                }
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    RegexValidator = BaseValidator.extend(RegexValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            value = self.getValue(value);

            // Run the test
            retVal = self.getPattern().test(value);

            // Clear messages before checking validity
            if (self.getMessages().length > 0) {
                self.clearMessages();
            }

            // If test failed
            if (retVal === false) {
                self.addErrorByKey('DOES_NOT_MATCH_PATTERN');
            }

            return retVal;
        },

        getPattern: function () {
            return this.options.pattern;
        },

        setPattern: function (pattern) {
            if (sjl.classOfIs(pattern, 'RegExp')) {
                this.clearMessages();
                this.options.pattern = pattern;
                return pattern;
            }
            throw new Error('RegexValidator.setPattern expects `pattern` ' +
                'to be of type "RegExp".  Type and value recieved: type: "' +
                sjl.classOf(pattern) + '"; value: "' + pattern + '"');
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
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        RegexValidator = sjl.ns.validator.RegexValidator,
        EmailValidator = function EmailValidator(options) {

            // Set defaults and extend with Base validator
            RegexValidator.call(this, {
                /**
                 * Pulled Directly from the php 5.5 source
                 * ------------------------------------------------------------------------
                 * The regex below is based on a regex by Michael Rushton.
                 * However, it is not identical.  I changed it to only consider routeable
                 * addresses as valid.  Michael's regex considers a@b a valid address
                 * which conflicts with section 2.3.5 of RFC 5321 which states that:
                 *
                 *   Only resolvable, fully-qualified domain names (FQDNs) are permitted
                 *   when domain names are used in SMTP.  In other words, names that can
                 *   be resolved to MX RRs or address (i.e., A or AAAA) RRs (as discussed
                 *   in Section 5) are permitted, as are CNAME RRs whose targets can be
                 *   resolved, in turn, to MX or address RRs.  Local nicknames or
                 *   unqualified names MUST NOT be used.
                 *
                 * This regex does not handle comments and folding whitespace.  While
                 * this is technically valid in an email address, these parts aren't
                 * actually part of the address itself.
                 *
                 * Michael's regex carries this copyright:
                 *
                 * Copyright © Michael Rushton 2009-10
                 * http://squiloople.com/
                 * Feel free to use and redistribute this code. But please keep this copyright notice.
                 * -----------------------------------------------------------------------
                 * This regex is the javascript version of the aforementioned pulled from
                 * Michael Ruston's website
                 */
                pattern: /^(?!("?(\\[ -~]|[^"])"?){255,})(?!("?(\\[ -~]|[^"])"?){65,}@)([!#-'*+\/-9=?^-~-]+|"(([\x01-\x08\x0B\x0C\x0E-!#-\[\]-\x7F]|\\[\x00-\xFF]))*")(\.([!#-'*+\/-9=?^-~-]+|"(([\x01-\x08\x0B\x0C\x0E-!#-\[\]-\x7F]|\\[\x00-\xFF]))*"))*@((?![a-z0-9-]{64,})([a-z0-9]([a-z0-9-]*[a-z0-9])?)(\.(?![a-z0-9-]{64,})([a-z0-9]([a-z0-9-]*[a-z0-9])?)){0,126}|\[((IPv6:(([a-f0-9]{1,4})(:[a-f0-9]{1,4}){7}|(?!(.*[a-f0-9][:\]]){8,})([a-f0-9]{1,4}(:[a-f0-9]{1,4}){0,6})?::([a-f0-9]{1,4}(:[a-f0-9]{1,4}){0,6})?))|((IPv6:([a-f0-9]{1,4}(:[a-f0-9]{1,4}){5}:|(?!(.*[a-f0-9]:){6,})([a-f0-9]{1,4}(:[a-f0-9]{1,4}){0,4})?::(([a-f0-9]{1,4}(:[a-f0-9]{1,4}){0,4}):)?))?(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}))\])$/i,
                messageTemplates: {
                    INVALID_EMAIL: function () {
                        return 'The email "' + this.getValue() + '" is not a valid email address.';
                    }
                }
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    EmailValidator = RegexValidator.extend(EmailValidator, {

        isValid: function (value) {
            var self = this,
                retVal = false;

            // Clear any existing messages
            self.clearMessages();

            // Set and get or get value (gets the set value if value is undefined
            value = self.getValue(value);

            // Run the test
            retVal = self.getPattern().test(value);

            // If test failed
            if (retVal === false) {
                self.addErrorByKey('INVALID_EMAIL');
            }

            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = EmailValidator;
    }
    else {
        sjl.ns('validator.EmailValidator', EmailValidator);
        if (window.__isAmd) {
            return EmailValidator;
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

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.ns.validator.BaseValidator,
        NumberValidator = function NumberValidator(options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                messageTemplates: {
                    NOT_A_NUMBER: function () {
                        return 'The input value is not a number.  Value received: "' + this.getValue() + '".';
                    },
                    NOT_IN_RANGE: function () {
                        return 'The number passed in is not within the specified '
                            + (this.get('inclusive') ? 'inclusive' : '') + ' range. ' +
                            ' Value received: "' + this.getValue() + '".';
                    },
                    NO_FLOATS_ALLOWED: function () {
                        return 'No floats allowed.  ' +
                            'Value received: "' + this.getValue() + '".';
                    },
                    NO_COMMAS_ALLOWED: function () {
                        return 'No commas allowed.  ' +
                            'Value received: "' + this.getValue() + '".';
                    }
                },
                regexForHex: /^(?:(?:\dx)|(?:\#))[\da-z]+$/i,
                regexForOctal: /^0\d+?$/,
                regexForBinary: /^\db\d+$/i,
                regexForScientific: /^(?:\-|\+)?\d+(?:\.\d+)?(?:e(?:\-|\+)?\d+(?:\.\d+)?)?$/i,
                allowFloat: true,
                allowCommas: false,
                allowSigned: false,
                allowBinary: false,
                allowHex: false,
                allowOctal: false,
                allowScientific: false,
                checkRange: false,
                defaultRangeSettings: {
                    min: Number.NEGATIVE_INFINITY,
                    max: Number.POSITIVE_INFINITY,
                    inclusive: true
                },
                min: Number.NEGATIVE_INFINITY,
                max: Number.POSITIVE_INFINITY,
                inclusive: true
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    NumberValidator = BaseValidator.extend(NumberValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false,

                originalValue = value,

            // Booleans
                allowFloat = self.get('allowFloat'),
                allowCommas = self.get('allowCommas'),
            //allowSigned =  self.get('allowSigned'),
                allowBinary = self.get('allowBinary'),
                allowHex = self.get('allowHex'),
                allowOctal = self.get('allowOctal'),
                allowScientific = self.get('allowScientific'),

            // Regexes'
                regexForHex = self.get('regexForHex'),
                regexForOctal = self.get('regexForOctal'),
                regexForBinary = self.get('regexForBinary'),
                regexForScientific = self.get('regexForScientific'),

            // Class of initial value
                classOfValue = sjl.classOf(value),

            // Check range `Boolean`
                checkRange = self.get('checkRange'),

            // Used if `checkRange` is true
                inRangeValidator;

            // Get value
            value = sjl.isset(value) ? value : self.getValue();

            // If number return true
            if (classOfValue === 'Number') {
                retVal = true;
            }

            // If is string, ...
            else if (classOfValue === 'String') {

                // Lower case any alpha characters to make the value easier to validate
                value = value.toLowerCase();

                // If allow commas, remove them
                if (allowCommas) {
                    value = value.replace(',', '');
                }

                // If hex ...
                if (allowHex && value.indexOf('x') > -1) {
                    retVal = regexForHex.test(value);
                    value = parseInt(value, 16);
                }

                // If octal ...
                else if (allowOctal && value.indexOf('0') === 0) {
                    retVal = regexForOctal.test(value);
                    value = parseInt(value, 8);
                }

                // If binary ...
                else if (allowBinary && value.indexOf('b') > -1) {
                    retVal = regexForBinary.test(value);
                    value = Number(value);
                }

                // If normal number (scientific numbers are considered normal (@todo should we have a flag for scientific numbers(?)) ...
                else if (allowScientific) {
                    retVal = regexForScientific.test(value);
                    value = Number(value);
                }

            } // End of 'If string ...'

            // Add error message if not a number

            // If no floats are allowed, add error message
            if (!allowFloat && /\./.test(value)) {
                self.addErrorByKey('NO_FLOATS_ALLOWED');
                retVal = false;
            }

            // If no commas allowed, add error message
            else if (!allowCommas && /\,/.test(originalValue)) {
                self.addErrorByKey('NO_COMMAS_ALLOWED');
                retVal = false;
            }

            // Else if 'Not a Number' add error message
            else if (!retVal) {
                self.addErrorByKey('NOT_A_NUMBER');
            }

            // Check min and max if necessary or if 'Class of value is a `Number`' (pretty much a solid NaN check)
            else if (retVal === true && (checkRange || classOfValue === 'Number')) {

                // If not check range and value is a number set the defaults so we can check for `NaN`
                if (!checkRange && classOfValue === 'Number') {
                    self.set(self.get('defaultRangeSettings'));
                }

                // Run validator
                inRangeValidator = new NumberValidator(self.get(['min', 'max', 'inclusive']));
                inRangeValidator.setValue(value);
                retVal = inRangeValidator.isValid();

                // If validator failed set error message
                if (!retVal) {

                    // If `NaN`
                    if (!checkRange && classOfValue === 'Number') {
                        self.addErrorByKey('NOT_A_NUMBER');
                    }

                    // Else 'Not in Range' message
                    else {
                        self.addErrorByKey('NOT_IN_RANGE');
                    }

                } // End of 'If error message'

            } // End of 'If `Number` class or check range'

            return retVal;

        } // End of `isValid` function
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
 * Created by Ely on 4/22/2015.
 */
/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function () {
    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.ns.validator.BaseValidator,
        PostCodeValidator = function PostCodeValidator(options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                region: 'US',
                format: null,
                service: null,
                loose: false,
                loosePostCodeRegexes: {
                    'GB': /^[ABCDEFGHIJKLMNOPRSTUWYZ]([ABCDEFGHKLMNOPQRSTUVWXY]\d[ABEHMNPRVWXY]|\d[ABCDEFGHJKPSTUW]|\d\d?|[ABCDEFGHKLMNOPQRSTUVWXY]\d\d?)(\s?\d[ABDEFGHJLNPQRSTUVWXYZ]{2})?$/i
                },
                postCodeRegexes: {
                    'GB': /^[A-PR-UWYZ]([A-HK-Y]\d[ABEHMNPRVWXY]|\d[A-HJKPSTUW]|\d\d?|[A-HK-Y]\d\d?)(\s?\d[A-HJLNP-Z]{2})?$/i,
                    //'GB': 'GIR\\s?0AA|^((A[BL]|B[ABDHLNRST]|C[ABFHMORTVW]|D[ADEGHLNTY]|E[CHNX]|F[KY]|G[LYU]|H[ADGPRSUX]|' +
                    //    'I[GMPV]|JE|K[ATWY]|L[ADELNSU]{0,1}|M[EKL]{0,1}|N[EGNPRW]{0,1}|O[LX]|P[AEHLOR]|R[GHM]|' +
                    //    'S[AEGKLMNOPRSTWY]{0,1}|T[ADFNQRSW]|UB|W[ACDFNRSV]|YO|ZE)' +
                    //    '(\\d[\\dA-Z]?\\s?\\d[ABD-HJLN-UW-Z]{2}))$|^BFPO\\s?\\d{1,4}',
                    'JE': 'JE\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}',
                    'GG': 'GY\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}',
                    'IM': 'IM\\d[\\dA-Z]?[ ]?\\d[ABD-HJLN-UW-Z]{2}',
                    'US': '\\d{5}([ \\-]\\d{4})?',
                    'CA': '[ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z](?:[ ]\\d[ABCEGHJ-NPRSTV-Z]\\d)?',
                    'DE': '\\d{5}',
                    'JP': '\\d{3}-\\d{4}',
                    'FR': '(?!(0{2})|(9(6|9))[ ]?\\d{3})(\\d{2}[ ]?\\d{3})',
                    'AU': '\\d{4}',
                    'IT': '\\d{5}',
                    'CH': '\\d{4}',
                    'AT': '\\d{4}',
                    'ES': '\\d{5}',
                    'NL': '\\d{4}[ ]?[A-Z]{2}',
                    'BE': '\\d{4}',
                    'DK': '\\d{4}',
                    'SE': '\\d{3}[ ]?\\d{2}',
                    'NO': '(?!0000)\\d{4}',
                    'BR': '\\d{5}[\\-]?\\d{3}',
                    'PT': '\\d{4}([\\-]\\d{3})?',
                    'FI': '\\d{5}',
                    'AX': '22\\d{3}',
                    'KR': '\\d{3}[\\-]\\d{3}',
                    'CN': '\\d{6}',
                    'TW': '\\d{3}(\\d{2})?',
                    'SG': '\\d{6}',
                    'DZ': '\\d{5}',
                    'AD': 'AD\\d{3}',
                    'AR': '([A-HJ-NP-Z])?\\d{4}([A-Z]{3})?',
                    'AM': '(37)?\\d{4}',
                    'AZ': '\\d{4}',
                    'BH': '((1[0-2]|[2-9])\\d{2})?',
                    'BD': '\\d{4}',
                    'BB': '(BB\\d{5})?',
                    'BY': '\\d{6}',
                    'BM': '[A-Z]{2}[ ]?[A-Z0-9]{2}',
                    'BA': '\\d{5}',
                    'IO': 'BBND 1ZZ',
                    'BN': '[A-Z]{2}[ ]?\\d{4}',
                    'BG': '\\d{4}',
                    'KH': '\\d{5}',
                    'CV': '\\d{4}',
                    'CL': '\\d{7}',
                    'CR': '\\d{4,5}|\\d{3}-\\d{4}',
                    'HR': '\\d{5}',
                    'CY': '\\d{4}',
                    'CZ': '\\d{3}[ ]?\\d{2}',
                    'DO': '\\d{5}',
                    'EC': '([A-Z]\\d{4}[A-Z]|(?:[A-Z]{2})?\\d{6})?',
                    'EG': '\\d{5}',
                    'EE': '\\d{5}',
                    'FO': '\\d{3}',
                    'GE': '\\d{4}',
                    'GR': '\\d{3}[ ]?\\d{2}',
                    'GL': '39\\d{2}',
                    'GT': '\\d{5}',
                    'HT': '\\d{4}',
                    'HN': '(?:\\d{5})?',
                    'HU': '\\d{4}',
                    'IS': '\\d{3}',
                    'IN': '\\d{6}',
                    'ID': '\\d{5}',
                    'IE': '((D|DUBLIN)?([1-9]|6[wW]|1[0-8]|2[024]))?',
                    'IL': '\\d{5}',
                    'JO': '\\d{5}',
                    'KZ': '\\d{6}',
                    'KE': '\\d{5}',
                    'KW': '\\d{5}',
                    'LA': '\\d{5}',
                    'LV': '\\d{4}',
                    'LB': '(\\d{4}([ ]?\\d{4})?)?',
                    'LI': '(948[5-9])|(949[0-7])',
                    'LT': '\\d{5}',
                    'LU': '\\d{4}',
                    'MK': '\\d{4}',
                    'MY': '\\d{5}',
                    'MV': '\\d{5}',
                    'MT': '[A-Z]{3}[ ]?\\d{2,4}',
                    'MU': '(\\d{3}[A-Z]{2}\\d{3})?',
                    'MX': '\\d{5}',
                    'MD': '\\d{4}',
                    'MC': '980\\d{2}',
                    'MA': '\\d{5}',
                    'NP': '\\d{5}',
                    'NZ': '\\d{4}',
                    'NI': '((\\d{4}-)?\\d{3}-\\d{3}(-\\d{1})?)?',
                    'NG': '(\\d{6})?',
                    'OM': '(PC )?\\d{3}',
                    'PK': '\\d{5}',
                    'PY': '\\d{4}',
                    'PH': '\\d{4}',
                    'PL': '\\d{2}-\\d{3}',
                    'PR': '00[679]\\d{2}([ \\-]\\d{4})?',
                    'RO': '\\d{6}',
                    'RU': '\\d{6}',
                    'SM': '4789\\d',
                    'SA': '\\d{5}',
                    'SN': '\\d{5}',
                    'SK': '\\d{3}[ ]?\\d{2}',
                    'SI': '\\d{4}',
                    'ZA': '\\d{4}',
                    'LK': '\\d{5}',
                    'TJ': '\\d{6}',
                    'TH': '\\d{5}',
                    'TN': '\\d{4}',
                    'TR': '\\d{5}',
                    'TM': '\\d{6}',
                    'UA': '\\d{5}',
                    'UY': '\\d{5}',
                    'UZ': '\\d{6}',
                    'VA': '00120',
                    'VE': '\\d{4}',
                    'ZM': '\\d{5}',
                    'AS': '96799',
                    'CC': '6799',
                    'CK': '\\d{4}',
                    'RS': '\\d{6}',
                    'ME': '8\\d{4}',
                    'CS': '\\d{5}',
                    'YU': '\\d{5}',
                    'CX': '6798',
                    'ET': '\\d{4}',
                    'FK': 'FIQQ 1ZZ',
                    'NF': '2899',
                    'FM': '(9694[1-4])([ \\-]\\d{4})?',
                    'GF': '9[78]3\\d{2}',
                    'GN': '\\d{3}',
                    'GP': '9[78][01]\\d{2}',
                    'GS': 'SIQQ 1ZZ',
                    'GU': '969[123]\\d([ \\-]\\d{4})?',
                    'GW': '\\d{4}',
                    'HM': '\\d{4}',
                    'IQ': '\\d{5}',
                    'KG': '\\d{6}',
                    'LR': '\\d{4}',
                    'LS': '\\d{3}',
                    'MG': '\\d{3}',
                    'MH': '969[67]\\d([ \\-]\\d{4})?',
                    'MN': '\\d{6}',
                    'MP': '9695[012]([ \\-]\\d{4})?',
                    'MQ': '9[78]2\\d{2}',
                    'NC': '988\\d{2}',
                    'NE': '\\d{4}',
                    'VI': '008(([0-4]\\d)|(5[01]))([ \\-]\\d{4})?',
                    'PF': '987\\d{2}',
                    'PG': '\\d{3}',
                    'PM': '9[78]5\\d{2}',
                    'PN': 'PCRN 1ZZ',
                    'PW': '96940',
                    'RE': '9[78]4\\d{2}',
                    'SH': '(ASCN|STHL) 1ZZ',
                    'SJ': '\\d{4}',
                    'SO': '\\d{5}',
                    'SZ': '[HLMS]\\d{3}',
                    'TC': 'TKCA 1ZZ',
                    'WF': '986\\d{2}',
                    'YT': '976\\d{2}'
                },
                messageTemplates: {
                    INVALID_VALUE_TYPE: function () {
                        return 'The postal code passed in does not match any postal code formats in our database.'
                            + '  Value passed in: "' + this.value() + '".';
                    },
                    REGION_NOT_FOUND: function () {
                        return 'Unable to verify postal code "' + this.value() + '" for region '
                            + this.region() + '" was found.';
                    },
                    INVALID_VALUE: function () {
                        return 'The input does not appear to be a postal code.  Input received: "' + this.value() + '".';
                    },
                    SERVICE: 'The input does not appear to be a postal code',
                    SERVICE_FAILURE: 'An exception has been raised while validating the input'
                }
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    PostCodeValidator = BaseValidator.extend(PostCodeValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false,
                classOfValue,
                countryCode = self.region().toUpperCase(),
                postCodeRegexes,
                format;

            // Clear any existing messages
            self.clearMessages();

            // Set and get
            value = value || self.value();

            classOfValue = sjl.classOf(value);

            // If value is not a String or is empty (0, false, '', {}, [], null, undefined);,
            // set 'invalid type' error
            if (classOfValue !== 'String' || sjl.empty(value)) {
                self.addErrorByKey('INVALID_VALUE_TYPE');
            }

            // Get regexes
            postCodeRegexes = this.get('postCodeRegexes');

            if (!postCodeRegexes.hasOwnProperty(countryCode)) {
                self.addErrorByKey('REGION_NOT_FOUND');
            }

            // Get format regex
            format = this.format(postCodeRegexes[countryCode]).format();

            // Run the test
            retVal = format.test(value);

            // If test failed
            if (retVal === false) {
                self.addErrorByKey('INVALID_VALUE');
            }

            return retVal;
        },

        region: function (region) {
            var classOfLocale = sjl.classOf(region),
                retVal = this.get('region');
            if (classOfLocale !== 'String' && classOfLocale !== 'Undefined') {
                throw new Error('');
            }
            if (classOfLocale !== 'Undefined') {
                this.set('region', region.toUpperCase());
                retVal = this;
            }

            return retVal;
        },

        format: function (format) {
            var classOfFormat = sjl.classOf(format),
                retVal = this.get('format');
            if (classOfFormat !== 'String'
                && classOfFormat !== 'RegExp'
                && classOfFormat !== 'Undefined') {
                throw new Error('`PostCodeValidator.format` method only accepts a `format` parameter of type' +
                    ' "String", "RegExp", or "Undefined".  `format` parameter value received: "' + format + '".');
            }
            if (classOfFormat !== 'Undefined') {
                // Normalize regex
                if (classOfFormat === 'String') {
                    format = (format.indexOf('^') !== 0 ? '^' : '') + format;
                    format = format + (format.indexOf('$') !== format.length - 1 ? '$' : '');
                    format = new RegExp(format);
                }
                this.set('format', format);
                retVal = this;
            }
            return retVal;
        },

        service: function (service) {
            var classOfService = sjl.classOf(service),
                retVal = this.get('service');
            if (classOfService !== 'Function' && classOfService !== 'Undefined') {
                throw new Error('');
            }
            if (classOfService !== 'Undefined') {
                this.set('service', service);
                retVal = this;
            }
            return retVal;
        }

    });

    if (isNodeEnv) {
        module.exports = PostCodeValidator;
    }
    else {
        sjl.ns('validator.PostCodeValidator', PostCodeValidator);
        if (window.__isAmd) {
            return PostCodeValidator;
        }
    }

})();

/**
 * Created by Ely on 7/24/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Optionable = sjl.ns.stdlib.Optionable,
        ValidatorChain = sjl.ns.validator.ValidatorChain,
        Input = function Input(options) {
            var alias = null;

            if (sjl.classOfIs(options, 'String')) {
                alias = options;
            }

            // Set defaults as options on this class
            Optionable.call(this, {
                allowEmpty: false,
                continueIfEmpty: true,
                breakOnFailure: false,
                fallbackValue: null,
                filterChain: null,
                alias: alias,
                required: true,
                validatorChain: null,
                value: null,
                messages: []
            });

            if (!sjl.empty(options)) {
                this.setOptions(options);
            }

            // Protect from adding programmatic validators, from within `isValid`, more than once
            this.options.isValidHasRun = false;

            // Only functions on objects;  Will
            // ignore options if it is a string
            //if (sjl.classOfIs(options, 'Object')) {
            //    sjl.extend(true, this.options, options, true);
            //}

        };

    Input = Optionable.extend(Input, {

        /**
         * This is a crude implementation
         * @todo review if we really want to have fallback value
         *      functionality for javascript
         * @returns {Boolean}
         */
        isValid: function (value) {

            var self = this,

            // Get the validator chain, value and validate
                validatorChain = self.getValidatorChain(),

                retVal = false;

            // Clear messages
            self.clearMessages();

            // Check whether we need to add an empty validator
            if (!self.options.isValidHasRun && !self.getContinueIfEmpty()) {
                validatorChain.addValidator(new sjl.EmptyValidator());
            }

            value = value || self.getValue();
            retVal = validatorChain.isValid(value);

            // Fallback value
            if (retVal === false && self.hasFallbackValue()) {
                self.setValue(self.getFallbackValue());
                retVal = true;
            }

            // Set messages internally
            self.setMessages();

            // Protect from adding programmatic validators more than once..
            if (!self.options.isValidHasRun) {
                self.options.isValidHasRun = true;
            }

            return retVal;
        },

        getInputFilter: function () {
            return this.options.inputFilter;
        },

        setInputFilter: function (value) {
            this.options.inputFilter = value;
        },

        getFilterChain: function () {
            return this.options.filterChain;
        },

        setFilterChain: function (value) {
            this.options.filterChain = value;
        },

        getValidatorChain: function () {
            var self = this;
            if (!sjl.isset(self.options.validatorChain)) {
                self.options.validatorChain = new ValidatorChain({
                    breakOnFailure: self.getBreakOnFailure()
                });
            }
            return self.options.validatorChain;
        },

        setValidatorChain: function (value) {
            if (sjl.classOfIs(value, 'Object')
                && sjl.isset(value.validators)) {
                this.getValidatorChain().setOption('validators', value.validators);
            }
            else {
                this.options.validatorChain = value;
            }
            return this;
        },

        getAlias: function () {
            return this.options.alias;
        },

        setAlias: function (value) {
            this.options.alias = value;
        },

        getRawValue: function () {
            return this.options.rawValue;
        },

        setRawValue: function (value) {
            this.options.rawValue = value;
        },

        getValue: function (value) {
            return this.options.value;
        },

        setValue: function (value) {
            this.options.value =
                this.options.rawValue = value;
        },

        getFallbackValue: function () {
            return this.options.fallbackValue;
        },

        setFallbackValue: function (value) {
            this.options.fallbackValue = value;
        },

        hasFallbackValue: function () {
            return !sjl.classOfIs(this.getFallbackValue(), 'Undefined') && !sjl.classOfIs(this.getFallbackValue(), 'Null');
        },

        getRequired: function () {
            return this.options.required;
        },

        setRequired: function (value) {
            this.options.required = value;
        },

        getAllowEmpty: function () {
            return this.options.allowEmpty;
        },

        setAllowEmpty: function (value) {
            this.options.allowEmpty = value;
        },

        getBreakOnFailure: function () {
            return this.options.breakOnFailure;
        },

        setBreakOnFailure: function (value) {
            this.options.breakOnFailure = value;
        },

        getContinueIfEmpty: function () {
            return this.options.continueIfEmpty;
        },

        setContinueIfEmpty: function (value) {
            this.options.continueIfEmpty = value;
        },

        clearMessages: function () {
            this.options.messages = [];
        },

        setMessages: function (messages) {
            var self = this;
            if (sjl.classOfIs(messages, 'Array')) {
                self.options.messages = messages;
            }
            else {
                self.options.messages = self.getValidatorChain().getMessages();
            }
            return self;
        },

        getMessages: function () {
            var self = this;
            if (!sjl.isset(self.options.messages)) {
                self.options.messages = [];
            }
            return self.options.messages;
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
 * Created by Ely on 7/24/2014.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        Optionable = sjl.ns.stdlib.Optionable,
        Input = sjl.ns.input.Input,
        InputFilter = function InputFilter(options) {

            // Set defaults as options on this class
            Optionable.call(this, {
                data: [],
                inputs: {},
                invalidInputs: [],
                validInputs: [],
                validationGroup: null,
                messages: {}
            });

            sjl.extend(true, this.options, options);

        };

    InputFilter = Optionable.extend(InputFilter, {

        // @todo beef up add, get, and has methods (do param type checking before using param)
        add: function (value) {
            if (value instanceof Input) {
                this.getInputs()[value.getAlias()] = value;
            }

            return this;
        },

        get: function (value) {
            return this.getInputs()[value];
        },

        has: function (value) {
            return this.getInputs().hasOwnProperty(value);
        },

        isValid: function () {
            var self = this,
                inputs = self.getInputs(),
                data = self.getData();

            self.clearInvalidInputs()
                .clearValidInputs()
                .clearMessages();

            // Populate inputs with data
            self.setDataOnInputs();


            // If no data bail and throw an error
            if (sjl.empty(data)) {
                throw new Error('InputFilter->isValid could\'nt ' +
                    'find any data for validation.');
            }

            return self.validateInputs(inputs, data);
        },

        validateInput: function (input, dataMap) {
            var name = input.getAlias(),
                dataExists = sjl.isset(dataMap[name]),
                data = dataExists ? dataMap[name] : null,
                required = input.getRequired(),
                allowEmpty = input.getAllowEmpty(),
                continueIfEmpty = input.getContinueIfEmpty(),
                retVal = true;

            // If data doesn't exists and input is not required
            if (!dataExists && !required) {
                retVal = true;
            }

            // If data doesn't exist, input is required, and input allows empty value,
            // then input is valid only if continueIfEmpty is false;
            else if (!dataExists && required && allowEmpty && !continueIfEmpty) {
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

        validateInputs: function (inputs, data) {
            var self = this,
                validInputs = {},
                invalidInputs = {},
                retVal = true,

            // Input vars
                input, name;

            // Get inputs
            inputs = inputs || self.getInputs();

            // Get data
            data = data || self.getRawValues();

            // Validate inputs
            for (input in inputs) {
                if (!inputs.hasOwnProperty(input)) {
                    continue;
                }
                name = input;
                input = inputs[input];

                // @todo Check that input has the required interface(?)
                if (self.validateInput(input, data)) {
                    validInputs[name] = input;
                }
                else {
                    invalidInputs[name] = input;
                }
            }

            // If no invalid inputs then validation passed
            if (sjl.empty(invalidInputs)) {
                retVal = true;
            }
            // else validation failed
            else {
                retVal = false;
            }

            // Set valid inputs
            self.setOption('validInputs', validInputs);

            // Set invalid inputs
            self.setOption('invalidInputs', invalidInputs);

            return retVal;
        },

        setInputs: function (inputs) {
            var self = this,
                input, name,
                validators;

            // Set default inputs value if inputs is not of type 'Object'
            if (!sjl.classOfIs(inputs, 'Object')) {
                self.options.inputs = inputs = {};
            }

            // Populate inputs
            for (input in inputs) {
                if (!inputs.hasOwnProperty(input)) {
                    continue;
                }

                name = input;

                validators = self._getValidatorsFromInputHash(inputs[input]);
                inputs[input].validators = null;
                delete inputs[input].validators;

                // Set name if it is not set
                if (!sjl.isset(inputs[input].alias)) {
                    inputs[input].alias = name;
                }

                // Create input
                input = new Input(inputs[input]);

                // Set input's validators
                input.getValidatorChain().addValidators(validators);

                // Save input
                self.options.inputs[input.getAlias()] = input;
            }

            return self;
        },

        getInputs: function () {
            var self = this;
            if (!sjl.classOfIs(self.options.inputs, 'Object')) {
                self.options.inputs = {};
            }
            return self.options.inputs;
        },

        remove: function (value) {
            var self = this,
                inputs = self.options.inputs;
            if (inputs.hasOwnProperty(value)) {
                inputs[value] = null;
                delete self.options.inputs[value];
            }
            return self;
        },

        setData: function (data) {
            var self = this;
            self.options.data = data;
            return self;
        },

        getData: function () {
            return this.options.data;
        },

        setValidationGroup: function () {
        },

        getInvalidInputs: function () {
            if (!sjl.classOfIs(this.options.invalidInputs, 'Object')) {
                this.options.invalidInputs = {};
            }
            return this.options.invalidInputs;
        },

        getValidInputs: function () {
            if (!sjl.classOfIs(this.options.validInputs, 'Object')) {
                this.options.validInputs = {};
            }
            return this.options.validInputs;
        },

        getRawValues: function () {
            var self = this,
                rawValues = {},
                input,
                invalidInputs = self.getInvalidInputs();

            for (input in invalidInputs) {
                if (!invalidInputs.hasOwnProperty(input)) {
                    continue;
                }
                input = invalidInputs[input];
                rawValues[input.getAlias()] = input.getRawValue();
            }
            return rawValues;
        },

        getValues: function () {
            var self = this,
                values = {},
                input,
                invalidInputs = self.getInvalidInputs();

            for (input in invalidInputs) {
                if (!invalidInputs.hasOwnProperty(input)) {
                    continue;
                }
                input = invalidInputs[input];
                values[input.getAlias()] = input.getValue();
            }
            return values;
        },

        getMessages: function () {
            var self = this,
                messages = self.options.messages,
                input, key,
                invalidInputs = self.getInvalidInputs(),
                messageItem;

            for (key in invalidInputs) {
                if (!invalidInputs.hasOwnProperty(key)) {
                    continue;
                }
                input = invalidInputs[key];
                if (sjl.empty())
                    messageItem = messages[input.getAlias()];
                if (sjl.classOfIs(messageItem, 'Array')) {
                    messages[input.getAlias()] = messageItem.concat(input.getMessages());
                }
                else {
                    messages[input.getAlias()] = input.getMessages();
                }
            }
            return messages;
        },

        mergeMessages: function (messages) {
            if (!messages) {
                throw new Error('`InputFilter.mergeMessages` requires a "messages" hash parameter.');
            }
            var currentMessages = this.options.messages,
                key;
            for (key in messages) {
                if (messages.hasOwnProperty(key)) {
                    currentMessages[key] = messages[key].concat(currentMessages.hasOwnProperty(key) ? currentMessages[key] : []);
                }
            }
            return this;
        },

        clearMessages: function () {
            this.options.messages = {};
        },

        setDataOnInputs: function (data) {
            var self = this,
                inputs = self.getInputs(),
                key;

            data = data || self.getData();

            for (key in data) {
                if (!data.hasOwnProperty(key)
                    || !sjl.isset(inputs[key])
                    || !sjl.isset(data[key])) {
                    continue;
                }
                inputs[key].setValue(data[key]);
            }
        },

        clearValidInputs: function () {
            this.setOption('validInputs', {});
            return this;
        },

        clearInvalidInputs: function () {
            this.setOption('invalidInputs', {});
            return this;
        },

        _getValidatorsFromInputHash: function (inputHash) {
            return sjl.isset(inputHash.validators) ? inputHash.validators : null;
        }

    }, {

        factory: function (inputSpec) {
            if (!sjl.classOfIs(inputSpec, 'Object')
                || !sjl.isset(inputSpec.inputs)) {
                throw new Error('InputFilter class expects param 1 to be of type "Object".');
            }
            var inputFilter = new InputFilter();
            inputFilter.setInputs(inputSpec.inputs);
            return inputFilter;
        },

        VALIDATE_ALL: 0

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
