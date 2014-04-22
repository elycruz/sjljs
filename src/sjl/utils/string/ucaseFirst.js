/**
 * Created by Ely on 4/21/2014.
 */
if (typeof context.ucaseFirst !== 'function') {
    /**
     * Upper cases first character of a string.
     * @param {String} str
     * @returns {String}
     */
    context.ucaseFirst = function (str) {
        str = str + "";
        s0 = str.match(/^[a-z]/i);
        if (!s0 instanceof Array) {
            return null;
        }
        return s0[0].toUpperCase() + str.substr(1);
    };
}