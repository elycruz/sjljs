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
     * Helper function which creates a constructor using `val` as a string
     * or just returns the constructor if `val` is a constructor.
     * @param value {*} - Value to resolve to constructor.
     * @returns {*}
     * @throws {Error} - If can't resolve constructor from `value`
     */
    function resolveConstructor (value) {
        // Check if is string and hold original string
        // Check if is string and hold original string
        var isString = sjl.classOfIs(value, 'String'),
            originalString = value,
            _val = value;

        // If constructor is a string, create it from string
        if (isString) {

            // Make sure constructor has uppercased first letter
            _val = sjl.camelCase(_val, true);

            try {
                // Evaluate string as constructor
                eval('_val = function ' + _val + '(){}');
            }
            catch (e) {
                // Else throw error
                throw new Error('An error occurred while trying to define a ' +
                    'sub class using: "' + originalString + '" as a sub class in `sjl.defineClass`.  ' +
                    'In unminified source: "./src/sjl/sjl-oop-util-functions.js"');
            }
        }

        // If not a constructor and is original string
        if (!sjl.classOfIs(_val, 'Function') && isString) {
            throw new Error ('Could not create constructor from string: "' + originalString + '".');
        }

        // If not a constructor and not a string
        else if (!sjl.classOfIs(_val, 'Function') && !isString) {
            throw new Error ('`sjl.defineClass` requires constructor ' +
                'or string to create a subclass of "' +
                '.  In unminified source "./src/sjl/sjl-oop-util-functions.js"');
        }

        return _val;
    }

    /**
     * Defines a subclass using a `superclass`, `constructor`, methods and/or static methods
     * @function module:sjl.defineClass
     * @param superclass {Constructor} - SuperClass's constructor.  Required.
     * @param constructor {Constructor} -  Constructor.  Required.
     * @param methods {Object} - Optional.
     * @param statics {Object} - Static methods. Optional.
     * @returns {Constructor}
     */
    sjl.defineClass = function (superclass, // Constructor of the superclass
                                   constructor, // The constructor for the new subclass
                                   methods, // Instance methods: copied to prototype
                                   statics) // Class properties: copied to constructor
    {
        // Resolve superclass
        superclass = superclass || sjl.copyOfProto(Object.prototype);

        // Resolve constructor
        var _constructor = resolveConstructor(constructor);

        // Set up the prototype object of the subclass
        _constructor.prototype = sjl.copyOfProto(superclass.prototype || superclass);

        // Make the constructor extendable
        _constructor.extend = function (constructor_, methods_, statics_) {
                return sjl.defineClass(this, constructor_, methods_, statics_);
            };

        // Define constructor's constructor
        _constructor.prototype.constructor = constructor;

        // Copy the methods and statics as we would for a regular class
        if (methods) sjl.extend(_constructor.prototype, methods);

        // If static functions set them
        if (statics) sjl.extend(_constructor, statics);

        // Return the class
        return _constructor;
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
