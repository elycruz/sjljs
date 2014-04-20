/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */
(function (context) {

    /**
     * Make functions/constructors extendable
     * @param constructor {function}
     * @param methods {object} - optional
     * @param statics {mixed|object|null|undefined} - optional
     * @todo refactor this.  Figure out a way not to extend `Function`
     * @returns {*}
     */
    Function.prototype.extend = function (constructor, methods, statics) {
        return defineSubClass(this, constructor, methods, statics);
    };

    /*
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is overwritten.
     * This function does not handle getters and setters or copy attributes.
     */
    function extend(o, p) {
        for (prop in p) { // For all props in p.
            o[prop] = p[prop]; // Add the property to o.
        }
        return o;
    }

    /*
     * Copy the enumerable properties of p to o, and return o.
     * If o and p have a property by the same name, o's property is left alone.
     * This function does not handle getters and setters or copy attributes.
     */
    function merge(o, p) {
        for (prop in p) { // For all props in p.
            if (o.hasOwnProperty[prop]) continue; // Except those already in o.
            o[prop] = p[prop]; // Add the property to o.
        }
        return o;
    }

    /*
     * Remove properties from o if there is not a property with the same name in p.
     * Return o.
     */
    function restrict(o, p) {
        for (prop in o) { // For all props in o
            if (!(prop in p)) delete o[prop]; // Delete if not in p
        }
        return o;
    }

    /*
     * For each property of p, delete the property with the same name from o.
     * Return o.
     */
    function subtract(o, p) {
        for (prop in p) { // For all props in p
            delete o[prop]; // Delete from o (deleting a
            // nonexistent prop is harmless)
        }
        return o;
    }

    /*
     * Return a new object that holds the properties of both o and p.
     * If o and p have properties by the same name, the values from p are used.
     */
    function union(o, p) {
        return extend(extend({}, o), p);
    }

    /*
     * Return a new object that holds only the properties of o that also appear
     * in p. This is something like the intersection of o and p, but the values of
     * the properties in p are discarded
     */
    function intersection(o, p) {
        return restrict(extend({}, o), p);
    }

    /*
     * Return an array that holds the names of the enumerable own properties of o.
     */
    function keys(o) {
        if (typeof o !== "object") throw TypeError('`keys` function expects param1 to be an object.'); // Object argument required
        var result = []; // The array we will return
        for (var prop in o) { // For all enumerable properties
            if (o.hasOwnProperty(prop)) // If it is an own property
                result.push(prop); // add it to the array.
        }
        return result; // Return the array.
    }

    /**
     *
     * @param proto
     * @returns {*}
     */
    function inherit(proto) {
//        console.log(proto);
        if (proto == null) throw TypeError('`inherit` function expects param1 to be a non-null value.'); // p must be a non-null object
        if (Object.create) // If Object.create() is defined...
            return Object.create(proto); // then just use it.
        var type = typeof proto; // Otherwise do some more type checking
        if (type !== "object" && type !== "function") throw TypeError();
        function func() {
        } // Define a dummy constructor function.
        func.prototype = proto; // Set its prototype property to p.
        return new func();
    }

    /**
     * Defines a subclass using a `superclass`, `constructor`, methods and/or static methods
     * @param superclass {Function}
     * @param constructor {Function}
     * @param methods {Object} - optional
     * @param statics {Object} - optional
     * @returns {*}
     */
    function defineSubClass(superclass, // Constructor of the superclass
                            constructor, // The constructor for the new subclass
                            methods, // Instance methods: copied to prototype
                            statics) // Class properties: copied to constructor
    {
        // Set up the prototype object of the subclass
        constructor.prototype = inherit(superclass.prototype);

        constructor.prototype.constructor = constructor;

        // Copy the methods and statics as we would for a regular class
        if (methods) extend(constructor.prototype, methods);

        if (statics) extend(constructor, statics);

        // Return the class
        return constructor;
    }

    /**
     * The `Extendable` constructor
     * @constructor
     */
    function Extendable() {}

    // Get a handle to Extendable's prototype
    var proto = Extendable.prototype;

    /**
     * Creates a subclass off of `constructor`
     * @param constructor {Function}
     * @param methods {Object} - optional
     * @param statics {Object} - optional
     * @returns {*}
     */
    proto.extend = function (constructor, methods, statics) {
        return defineSubClass(this, constructor, methods, statics);
    };

    proto.intersect = intersection;

    proto.keys = keys;

    proto.merge = merge;

    proto.restrict = restrict;

    proto.subtract = subtract;

    proto.union = union;

    context.sjl.Extendable = Extendable;

})(typeof window === 'undefined' ? global : window);

