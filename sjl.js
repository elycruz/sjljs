/**
 * Created by Ely on 4/19/2014.
 */
var sjl = sjl || {};
/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */
(function (context) {

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
        if (typeof o !== "object") throw TypeError(); // Object argument required
        var result = []; // The array we will return
        for (var prop in o) { // For all enumerable properties
            if (o.hasOwnProperty(prop)) // If it is an own property
                result.push(prop); // add it to the array.
        }
        return result; // Return the array.
    }

    function inherit(proto) {
        if (proto == null) throw TypeError(); // p must be a non-null object
        if (Object.create) // If Object.create() is defined...
            return Object.create(proto); // then just use it.
        var type = typeof proto; // Otherwise do some more type checking
        if (type !== "object" && type !== "function") throw TypeError();
        function func() {
        } // Define a dummy constructor function.
        func.prototype = proto; // Set its prototype property to p.
        return new func();
    }

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

    function Extendable() {}

    var proto = Extendable.prototype;

    proto.extend = function (constructor, methods, statics) {
        return defineSubclass(this, constructor, methods, statics);
    };

    /**
     * Takes a namespace string and fetches that location out from
     * an object/Map.  If the namespace doesn't exists it is created then
     * returned.
     * Example: _namespace('hello.world.how.are.you.doing', obj) will
     * create/fetch within `obj`:
     * hello: { world: { how: { are: { you: { doing: {} } } } } }
     * @param ns_string {String} the namespace you wish to fetch
     * @param objToSearch {Object} object to search for namespace on
     * @param valueToSet {Object} optional, a value to set on the key
     *  (last key if key string (a.b.c.d = value))
     * @returns {Object}
     */
    proto._namespace = function (ns_string, objToSearch, valueToSet) {
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

    if (context) {
        context.Extendable = Extendable;
    }
    else {
        return Extendable;
    }

})(sjl);

/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    var Iterator = Extendable.extend(
        function Iterator(values, pointer) {
            this.collection = values || [];
            this.pointer = pointer || 0;
        },
        {
            current: function () {
                var self = this;
                return {
                    done: this.valid(),
                    value: self.getCollection()[self.getPointer()]
                };
            },

            next: function () {
                var self = this,
                    pointer = self.getPointer()

                self.pointer = pointer += 1;

                return {
                    done: self.valid(),
                    value: self.getCollection()[pointer]
                };
            },

            rewind: function () {
                this.pointer = 0;
            },

            valid: function () {
                return this.getCollection().length - 1 <= this.getPointer();
            },

            getPointer: function () {
                return /^\d+$/.test(this.pointer + '') ? 0 : this.pointer;
            },

            getCollection: function () {
                return classOfIs(this.collection, 'Array') ? this.collection : [];
            }

        });

    if (context) {
        context.Iterator = Iterator;
    }
    else {
        return Iterator;
    }

})(sjl);