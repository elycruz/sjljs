/**
 * Created by Ely on 4/21/2014.
 */
if (typeof context.sjl.isset !== 'function') {

    /**
     * Checks to see if value is set (not null and not undefined).
     * @param value
     * @returns {boolean}
     */
    function isSet(value) {
        return (value !== undefined && value !== null);
    }

    /**
     * Checks to see if any of the arguments passed in are
     * set (not undefined and not null).
     * Returns false on the first argument encountered that
     * is null or undefined.
     * @returns {boolean}
     */
    context.sjl.isset = function () {
        var retVal = false,
            check;

        if (arguments.length > 1) {
            for (var i in arguments) {
                i = arguments[i];
                check = isSet(i);
                if (!check) {
                    retVal = check;
                    break;
                }
            }
        }
        else if (arguments.length === 1) {
            retVal = isSet(arguments[0]);
        }

        return retVal;
    };
}