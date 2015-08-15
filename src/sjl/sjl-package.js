/**
 * Created by Ely on 8/15/2015.
 */
(function (context) {

    'use strict';

    /**
     * Private package object.
     * @type {{}}
     */
    var packages = {};

    /**
     * Makes a property non settable on `obj` and sets `value` as the returnable property.
     * @param obj {Object}
     * @param key {String}
     * @param value {*}
     */
    function makeNotSettableProp(obj, key, value) {
        (function (_obj, _key, _value) {
            Object.defineProperty(_obj, _key, {
                get: function () { return _value; }
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
    function namespace (ns_string, objToSearch, valueToSet) {
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
     * Returns a property from sjl packages.
     * @note If `nsString` is undefined returns the protected packages object itself.
     * @function module:sjl.package
     * @param propName {String}
     * @param value {*}
     * @returns {*}
     */
    context.sjl.package = function (nsString, value) {
        return typeof nsString === 'undefined' ? packages
            : namespace(nsString, packages, value);
    };

}(typeof window === 'undefined' ? global : window));