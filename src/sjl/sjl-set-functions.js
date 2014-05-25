/**
 * Created by Ely on 5/24/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */
(function (context) {

    context.sjl = context.sjl || {};

    if (typeof context.sjl.extend === 'undefined') {
        /*
         * Copy the enumerable properties of p to o, and return o.
         * If o and p have a property by the same name, o's property is overwritten.
         * This function does not handle getters and setters or copy attributes.
         * @param o {mixed} - *object to extend
         * @param p {mixed} - *object to extend from
         * @returns {*} - returns o
         */
        context.sjl.extend = function (o, p) {
            for (prop in p) { // For all props in p.
                o[prop] = p[prop]; // Add the property to o.
            }
            return o;
        };
    }

    if (typeof context.sjl.merge === 'undefined') {
        /*
         * Copy the enumerable properties of p to o, and return o.
         * If o and p have a property by the same name, o's property is left alone.
         * This function does not handle getters and setters or copy attributes.
         * @param o {mixed} - *object to merge to
         * @param p {mixed} - *object to merge from
         * @returns {*} - returns o
         */
        context.sjl.merge = function (o, p) {
            for (prop in p) { // For all props in p.
                if (o.hasOwnProperty[prop]) continue; // Except those already in o.
                o[prop] = p[prop]; // Add the property to o.
            }
            return o;
        };
    }

    if (typeof context.sjl.subtract === 'undefined') {
        /*
         * For each property of p, delete the property with the same name from o.
         * Return o.
         */
        context.sjl.subtract = function (o, p) {
            for (prop in p) { // For all props in p
                delete o[prop]; // Delete from o (deleting a
                // nonexistent prop is harmless)
            }
            return o;
        };
    }

    if (typeof context.sjl.restrict === 'undefined') {
        /*
         * Remove properties from o if there is not a property with the same name in p.
         * Return o.
         */
        context.sjl.restrict = function (o, p) {
            for (prop in o) { // For all props in o
                if (!(prop in p)) delete o[prop]; // Delete if not in p
            }
            return o;
        };
    }

    if (typeof context.sjl.union === 'undefined') {
        /*
         * Return a new object that holds the properties of both o and p.
         * If o and p have properties by the same name, the values from p are used.
         */
        context.sjl.union = function (o, p) {
            return context.sjl.extend(context.sjl.extend({}, o), p);
        };
    }

    if (typeof context.sjl.intersection === 'undefined') {
        /*
         * Return a new object that holds only the properties of o that also appear
         * in p. This is something like the intersection of o and p, but the values of
         * the properties in p are discarded
         */
        context.sjl.intersection = function (o, p) {
            return context.sjl.restrict(context.sjl.extend({}, o), p);
        };
    }

})(typeof window === 'undefined' ? global : window);
