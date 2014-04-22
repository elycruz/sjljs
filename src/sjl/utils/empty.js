/**
 * Created by Ely on 4/21/2014.
 */
if (typeof context.sjl.empty !== 'function') {
    /**
     * Checks object's own properties to see if it is empty.
     * @param obj object to be checked
     * @returns {boolean}
     */
    function isEmptyObj(obj) {
        var retVal = obj === true ? false : true;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                retVal = false;
                break;
            }
        }
        return retVal;
    }

    /**
     * Checks to see if value is empty (objects, arrays,
     * strings etc.).
     * @param value
     * @returns {boolean}
     */
    function isEmptyValue(value) {
        var retVal;

        // If value is an array or a string
        if (classOfIs(value, 'Array') || classOfIs(value, 'String')) {
            retVal = value.length === 0;
        }

        // If value is a number and is not 0
        else if (classOfIs(value, 'Number') && value !== 0) {
            retVal = false;
        }

        // Else
        else {
            retVal = (value === 0 || value === false
                || value === undefined || value === null
                || isEmptyObj(value));
        }

        return retVal;
    }

    /**
     * Checks to see if any of the arguments passed in are empty.
     * @returns {boolean}
     */
    context.sjl.empty = function () {
        var retVal, check,
            i, item,
            args = argsToArray(arguments);

        // If multiple arguments
        if (args.length > 1) {

            // No empties empties until proven otherwise
            retVal = false;

            // Loop through args and check their values
            for (i = 0; i < args.length - 1; i += 1) {
                item = args[i];
                check = isEmptyValue(item);
                if (check) {
                    retVal = true;
                    break;
                }
            }
        }

        // If one argument
        else if (args.length === 1) {
            retVal = isEmptyValue(args[0]);
        }

        // If no arguments
        else {
            retVal = true;
        }

        return retVal;
    };
}