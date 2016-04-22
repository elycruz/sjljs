/**
 * Created by Ely on 3/26/2016.
 */

'use strict';

module.exports = {
    repeatStr: function repeatStr(str, times) {
        var out = '';
        while (out.length < times) {
            out += str;
        }
        return out;
    }
};
