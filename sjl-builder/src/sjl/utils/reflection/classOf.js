/**
 * Created by Ely on 4/21/2014.
 */
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