/**
 * Created by Ely on 4/12/2014.
 * Code copy pasted from "Javascript the definitive guide"
 */
(function (context) {
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
        return context.sjl.defineSubClass(this, constructor, methods, statics);
    };

    proto.mixin = function () {
        var args = context.sjl.argsToArray(arguments),
            arg, self = this;
        for (arg in args) {
            arg = args[arg];
            arg.apply(self);
            context.sjl.extend(self.prototype, arg.prototype);
        }
        context.sjl.extend(this.prototype, obj.prototype);
    };

    context.sjl.Extendable = Extendable;

})(typeof window === 'undefined' ? global : window);

//
///*
// * Return an array that holds the names of the enumerable own properties of o.
// */
//function keys(o) {
//    if (typeof o !== "object") throw TypeError('`keys` function expects param1 to be an object.'); // Object argument required
//    var result = []; // The array we will return
//    for (var prop in o) { // For all enumerable properties
//        if (o.hasOwnProperty(prop)) // If it is an own property
//            result.push(prop); // add it to the array.
//    }
//    return result; // Return the array.
//}