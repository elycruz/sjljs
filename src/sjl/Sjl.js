/**
 * Created by Ely on 4/19/2014.
 */

/**
 * Defines argsToArray, classOfIs, classOf, empty, isset, and namespace, on the passed in context.
 * @param {Object} context
 * @returns void
 * @todo make all functions ecmascript < 5 compatible
 */
(function (context) {

    context.sjl = context.sjl || {};

    var slice = Array.prototype.slice;

    if (typeof context.sjl.argsToArray !== 'function') {
        context.sjl.argsToArray = function (args) {
            return slice.call(args, 0, args.length);
        };
    }

    if (typeof context.sjl.isset !== 'function') {

        /**
         * Checks to see if value is set (not null and not undefined).
         * @param value
         * @returns {boolean}
         */
        function isSet(value) {
            return (value !== undefined && value !== null);
        }

        /**
         * Checks to see if any of the arguments passed in are
         * set (not undefined and not null).
         * Returns false on the first argument encountered that
         * is null or undefined.
         * @returns {boolean}
         */
        context.sjl.isset = function () {
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
    }

    if (typeof context.sjl.classOf !== 'function') {
        /**
         * Returns the class name of an object from it's class string.
         * @param val {mixed}
         * @returns {string}
         */
        context.sjl.classOf = function (val) {
            return typeof val === 'undefined' ? 'Undefined' :
                Object.prototype.toString.call(val).split(/\[object\s/)[1].split(']')[0];
        };
    }

    if (typeof context.sjl.classOfIs !== 'function') {

        /**
         * Checks to see if an object is of type humanString (class name) .
         * @param humanString {string} (class string; I.e., "Number", "Object", etc.)
         * @param obj {mixed}
         * @returns {boolean}
         */
        context.sjl.classOfIs = function (obj, humanString) {
            return classOf(obj) === humanString;
        };
    }

    if (typeof context.sjl.empty !== 'function') {
        /**
         * Checks object's own properties to see if it is empty.
         * @param obj object to be checked
         * @returns {boolean}
         */
        function isEmptyObj(obj) {
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
         * @returns {boolean}
         */
        function isEmptyValue(value) {
            var retVal;

            // If value is an array or a string
            if (classOfIs(value, 'Array') || classOfIs(value, 'String')) {
                retVal = value.length === 0;
            }

            // If value is a number and is not 0
            else if (classOfIs(value, 'Number') && value !== 0) {
                retVal = false;
            }

            // Else
            else {
                retVal = (value === 0 || value === false
                    || value === undefined || value === null
                    || isEmptyObj(value));
            }

            return retVal;
        }

        /**
         * Checks to see if any of the arguments passed in are empty.
         * @returns {boolean}
         */
        context.sjl.empty = function () {
            var retVal, check,
                i, item,
                args = argsToArray(arguments);

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
    }

    if (typeof context.sjl.namespace !== 'function') {
        /**
         * Takes a namespace string and fetches that location out from
         * an object/Map.  If the namespace doesn't exists it is created then
         * returned.
         * Example: namespace('hello.world.how.are.you.doing', obj) will
         * create/fetch within `obj`:
         * hello: { world: { how: { are: { you: { doing: {} } } } } }
         * @param ns_string {String} the namespace you wish to fetch
         * @param objToSearch {Object} object to search for namespace on
         * @param valueToSet {Object} optional, a value to set on the key
         *  (last key if key string (a.b.c.d = value))
         * @returns {Object}
         */
        context.sjl.namespace = function (ns_string, objToSearch, valueToSet) {
            var parts = ns_string.split('.'),
                parent = objToSearch,
                shouldSetValue = classOfIs(valueToSet, 'Undefined')
                    ? false : true,
                i;

            for (i = 0; i < parts.length; i += 1) {
                if (classOfIs(parent[parts[i]], 'Undefined') && !shouldSetValue) {
                    parent[parts[i]] = {};
                }
                else if (i === parts.length - 1 && shouldSetValue) {
                    parent[parts[i]] = valueToSet;
                }
                parent = parent[parts[i]];
            }

            return parent;
        };
    }

    if (typeof context.sjl.lcaseFirst !== 'function') {
        /**
         * Lower cases first character of a string.
         * @param {String} str
         * @returns {String}
         */
        context.lcaseFirst = function (str) {
            var retVal = str = str ? str + "" : "";
            if (str.length > 0) {
                var rslt = str.match(/[a-z]/i);
                retVal = rslt.length > 0 ? rslt[0].toLowerCase() + str.substr(1) : str;
            }
            return retVal;
        };
    }

    if (typeof context.sjl.ucaseFirst !== 'function') {
        /**
         * Upper cases first character of a string.
         * @param {String} str
         * @returns {String}
         */
        context.ucaseFirst = function (str) {
            str = str + "";
            s0 = str.match(/^[a-z]/i);
            if (!s0 instanceof Array) {
                return null;
            }
            return s0[0].toUpperCase() + str.substr(1);
        };
    }

    if (typeof context.sjl.camelCase) {

        /**
         * Make a string code friendly. Camel cases a dirty string into
         * a valid javascript variable/constructor name;  Uses `replaceStrRegex`
         * to replace unwanted characters with a '-' and then splits and merges
         * the parts with the proper casing, pass in `true` for lcaseFirst
         * to lower case the first character.
         * @param {String} str
         * @param {Boolean} lowerFirst default `false`
         * @param {Regex} replaceStrRegex default /[^a-z0-9\-_] * /i (without spaces before and after '*')
         * @returns {String}
         */
        context.camelCase = function (str, lowerFirst, replaceStrRegex) {
            lowerFirst = lowerFirst || false;
            replaceStrRegex = replaceStrRegex || /[^a-z0-9\-_]*/i;
            var newStr = "";
            str = str + "";
            str = str.replace(replaceStrRegex, '-');
            for (_str in str.split('-')) {
                if (/^[a-z]/i.test(_str)) {
                    newStr += context.sjl.ucaseFirst(_str);
                }
                else {
                    newStr += _str;
                }
            }
            ;
            if (lowerFirst) {
                newStr = context.sjl.lcaseFirst(newStr);
            }
            return newStr;
        };
    }

})(typeof window === 'undefined' ? global : window);
