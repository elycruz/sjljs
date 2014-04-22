/**
 * Created by Ely on 4/21/2014.
 */
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