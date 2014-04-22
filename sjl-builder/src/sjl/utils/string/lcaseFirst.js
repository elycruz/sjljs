/**
 * Created by Ely on 4/21/2014.
 */
if (typeof context.lcaseFirst !== 'function') {
    /**
     * Lower cases first character of a string.
     * @param {String} str
     * @returns {String}
     */
    context.lcaseFirst = function (str) {
        var retVal = str = str ? str + "" : "";
        if (str.length > 0) {
            var rslt = str.match(/[a-z]/i);
            retVal = rslt.length > 0 ? rslt[0].toLowerCase() + str.substr(1) : str;
        }
        return retVal;
    };
}