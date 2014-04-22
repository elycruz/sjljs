/**
 * Created by Ely on 4/21/2014.
 */
var slice = Array.prototype.slice;

if (typeof context.sjl.argsToArray !== 'function') {
    context.sjl.argsToArray = function (args) {
        return slice.call(args, 0, args.length);
    };
}