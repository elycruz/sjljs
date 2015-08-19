/**
 * Created by Ely on 8/19/2015.
 * @idea Maybe allow auto calling of functions found when traversing namespace string
 * 'hello.world.how.are.you' if `are` and lets say `how` are methods we should call them and expect the
 * proceeding property in the ns_string to exist in the return value.
 * @idea Allow calling of `has` methods via boolean in `has` method;  E.g., any objects encountered when searching
 * a namespace string that has a `has` method would have said method automatically called.
 */

(function (context) {

    'use strict';

    var sjl = context.sjl,

        /**
         * SjlSearchableMap Constructor.
         * @param iterable
         * @constructor
         */
        SjlSearchableMap = function SjlSearchableMap (iterable) {
            sjl.SjlMap.call(this, iterable);
        };

    sjl.SjlSearchableMap = sjl.SjlMap.extend(SjlSearchableMap, {
        //delete: function (key) {
        //    var _index = sjl.indexOf(this._keys, key);
        //    if (this.has(key)) {
        //        delete this._values[_index];
        //        delete this._keys[_index];
        //        this.size -= sjl.classOfIs(this.size, 'Number') && this.size > 0 ? 1 : 0;
        //    }
        //    return this;
        //},
        //
        //has: function (key) {
        //    return sjl.indexOf(this._keys, key) > -1 ? true : false;
        //},
        //get: function (key) {
        //    var index = sjl.indexOf(this._keys, key);
        //    return index > -1 ? this._values[index] : undefined;
        //},
        //set: function (key, value) {
        //    var index = sjl.indexOf(this._keys, key);
        //    if (index > -1) {
        //        this._keys[index] = key;
        //        this._values[index] = value;
        //        this.size += 1;
        //    }
        //    else {
        //        this._keys.push(key);
        //        this._values.push(value);
        //        this.size += 1;
        //    }
        //    index = null;
        //    return this;
        //}

    });

})(typeof window === 'undefined' ? global : window);