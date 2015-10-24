/**
 * Created by Ely on 5/24/2014.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    /**
     * Creates a copy of a prototype to use for inheritance.
     * @function module:sjl.copyOfProto
     * @param proto {Prototype|Object} - Prototype to make a copy of.
     * @returns {*}
     */
    sjl.copyOfProto = function (proto) {
        if (proto === null) throw new TypeError('`copyOfProto` function expects param1 to be a non-null value.'); // proto must be a non-null object
        if (Object.create) // If Object.create() is defined...
            return Object.create(proto); // then just use it.
        var type = typeof proto; // Otherwise do some more type checking
        if (type !== 'object' && type !== 'function') throw new TypeError('`copyOfProto` function expects param1 ' +
            'to be of type "Object" or of type "Function".');
        function Func() {} // Define a dummy constructor function.
        Func.prototype = proto; // Set its prototype property to p.
        return new Func();
    };

    /**
     * Defines a class using a `superclass`, `constructor`, methods and/or static methods
     * @function module:sjl.defineSubClass
     * @param superclass {Constructor} - SuperClass's constructor.  Optional.
     * @param constructor {Constructor} -  Constructor.  Required.
     * @param methods {Object} - Optional.
     * @param statics {Object} - Static methods. Optional.
     * @returns {Constructor}
     */
    sjl.defineSubClass = function (superclass,  // Constructor of the superclass
                                constructor, // The constructor for the new subclass
                                methods,     // Instance methods: copied to prototype
                                statics)     // Class properties: copied to constructor
    {
        // Resolve superclass
        superclass = superclass || sjl.copyOfProto(Object.prototype);

        // If `constructor` is a string give deprecation notice to user
        if (sjl.classOfIs(constructor, 'String')) {
            throw new Error('`sjl.defineSubClass` no longer allows a string value in the `constructor` param position.  ' +
                'This functionality is now deprecated.  Please pass in an actual constructor instead.');
        }

        // Set up the prototype object of the subclass
        constructor.prototype = sjl.copyOfProto(superclass.prototype || superclass);

        if (!constructor.prototype.hasOwnProperty('super')) {
            constructor.prototype.super = function (_super_) {
                console.log(_super_);
            };
        }

        // Make the constructor extendable
        constructor.extend = function (constructor_, methods_, statics_) {
                return sjl.defineSubClass(this, constructor_, methods_, statics_);
            };

        // Define constructor's constructor
        constructor.prototype.constructor = constructor;

        // Copy the methods and statics as we would for a regular class
        if (methods) sjl.extend(constructor.prototype, methods);

        // If static functions set them
        if (statics) sjl.extend(constructor, statics);

        // Return the class
        return constructor;
    };

    /**
     * Throws an error using a formatted string that reports the function name,
     * the expected parameter type, and the value recieved.
     * @function module:sjl.throwNotOfTypeError
     * @param value
     * @param paramName
     * @param funcName
     * @param expectedType
     * @throws {Error}
     */
    sjl.throwNotOfTypeError = function (value, paramName, funcName, expectedType) {
        throw Error(funcName + ' expects ' + paramName +
            ' to be of type "' + expectedType + '".  Value received: ' + value);
    };

})(typeof window === 'undefined' ? global : window);
