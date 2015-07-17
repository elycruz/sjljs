/**
 * Created by Ely on 7/17/2015.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    function forEach (array, callback, context) {
        for (var i in array) {
            if (array.hasOwnProperty(i)) {
                i = parseInt(i, 10);
                callback.call(context, array[i], i, array);
            }
        }
        return array;
    }

    function arrayIndexOf (array, value) {
        var classOfValue = sjl.classOf(value),
            _index = -1;
        forEach(array, function (_value, i) {
            if (sjl.classOf(_value) === classOfValue
                && _value === value) {
                _index = i;
            }
        });
        return _index;
    }

    sjl.SjlSet = sjl.Extendable.extend(function SjlSet (iterable) {
        this._values = [];
        this.size = 0;
        var iterator = sjl.iterable(iterable, 0)['@@iterator']();
        while (iterator.valid()) {
            this.add(iterator.next().value);
        }
    }, {
        add: function (value) {
            if (!this.has(value)) {
                this._values.push(value);
                this.size += 1;
            }
            return this;
        },
        clear: function () {
            while (this._values.length > 0) {
                this._values.pop();
            }
            this.size = 0;
            return this;
        },
        delete: function (value) {
            var _index = arrayIndexOf(value, this._values);
            if (_index > -1) {
                delete this._values[_index];
                this.size -= 1;
                this.size = this.size < 0 ? 1 : 0;
            }
            return this;
        },
        entries: function () {
            return sjl.ObjectIterator(this.keys(), this.values(), 0);
        },
        forEach: function (callback) {
            forEach(this._values, callback);
            return this;
        },
        has: function (value) {
            return arrayIndexOf(this._values, value) > -1 ? true : false;
        },
        keys: function () {
            return this.values();
        },
        values: function () {
            return this.iterator();
        },
        iterator: function () {
            return this['@@iterator']();
        },
        '@@iterator': function () {
            return sjl.Iterator(this._values, 0);
        }
    });

})(typeof window === 'undefined' ? global : window);