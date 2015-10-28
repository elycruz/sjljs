/**
 * Created by elydelacruz on 10/28/15.
 */

(function (isNodeEnv) {

    var sjl,
        Iterator,
        ObjectIterator;

    if (isNodeEnv) {
        sjl = require('sjljs');
        Iterator = require('Iterator');
        ObjectIterator = require('ObjectIterator');
    }
    else {
        sjl = window.sjl || {};
        Iterator = sjl.package.Iterator;
        ObjectIterator = sjl.package.ObjectIterator;
    }

    /**
     * Turns an array into an iterable.
     * @param array {Array}
     * @param pointer {Number|undefined}
     * @returns {*}
     */
    sjl.iterable = function (arrayOrObj, pointer) {
        var classOfArrayOrObj = sjl.classOf(arrayOrObj),
            keys, values;
        if (classOfArrayOrObj === 'Array') {
            arrayOrObj[iteratorKey] = function () {
                return Iterator(arrayOrObj, pointer);
            };
        }
        else if (classOfArrayOrObj === 'Object') {
            keys = sjl.keys(arrayOrObj);
            values = keys.map(function (key) {
                return arrayOrObj[key];
            });
            arrayOrObj[iteratorKey] = function () {
                return ObjectIterator(keys, values, pointer);
            }
        }
        else {
            throw new Error('sjl.iterable only takes objects or arrays.  ' +
                'arrayOrObj param recieved type is "' + classOfArrayOrObj + '".  Value recieved: ' + arrayOrObj);
        }
        return arrayOrObj;
    };

}(typeof window === 'undefined'));
