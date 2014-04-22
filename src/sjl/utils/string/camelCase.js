(function (context) {

    /**
     * Created by Ely on 4/21/2014.
     */
    if (typeof context.camelCase) {

        /**
         * Make a string code friendly. Camel cases a dirty string into
         * a valid javascript variable/constructor name;  Uses `replaceStrRegex`
         * to replace unwanted characters with a '-' and then splits and merges
         * the parts with the proper casing, pass in `true` for lcaseFirst
         * to lower case the first character.
         * @param {String} str
         * @param {Boolean} lowerFirst default `false`
         * @param {Regex} replaceStrRegex default /[^a-z0-9\-_] * /i (without spaces before and after '*')
         * @returns {String}
         */
        context.camelCase = function (str, lowerFirst, replaceStrRegex) {
            lowerFirst = lowerFirst || false;
            replaceStrRegex = replaceStrRegex || /[^a-z0-9\-_]*/i;
            var newStr = "";
            str = str + "";
            str = str.replace(replaceStrRegex, '-');
            for (_str in str.split('-')) {
                if (/^[a-z]/i.test(_str)) {
                    newStr += ucaseFirst(_str);
                }
                else {
                    newStr += _str;
                }
            }
            ;
            if (lowerFirst) {
                newStr = lcaseFirst(newStr);
            }
            return newStr;
        };
    }

})(typeof window === 'undefined' ? global : window);
