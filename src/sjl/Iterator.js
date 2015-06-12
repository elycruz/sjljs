/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl;

    /**
     * @class sjl.Iterator
     * @extends sjl.Extendable
     * @type {void|Object|*}
     */
    sjl.Iterator = sjl.Extendable.extend(
        function Iterator(values, pointer) {
            if (!(this instanceof sjl.Iterator)) {
                return new sjl.Iterator(values, pointer);
            }
            this.collection = values || [];
            this.pointer = sjl.classOfIs(pointer, 'Number') ? parseInt(pointer, 10) : 0;
        },
        {
            current: function () {
                var self = this;
                return self.valid() ? {
                    done: false,
                    value: self.getCollection()[self.getPointer()]
                } : {
                    done: true
                };
            },

            next: function () {
                var self = this,
                    pointer = self.getPointer(),
                    retVal = self.valid() ? {
                        done: false,
                        value: self.getCollection()[pointer]
                    } : {
                        done: true
                    };
                self.pointer = pointer + 1;
                return retVal;
            },

            rewind: function () {
                this.pointer = 0;
            },

            valid: function () {
                return this.getPointer() < this.getCollection().length;
            },

            getPointer: function (defaultNum) {
                defaultNum = sjl.classOfIs(defaultNum, 'Number') ?
                    (isNaN(defaultNum) ? 0 : defaultNum) : 0;
                if (!sjl.classOfIs(this.pointer, 'Number')) {
                    this.pointer = parseInt(this.pointer, 10);
                    if (isNaN(this.pointer)) {
                        this.pointer = defaultNum;
                    }
                }
                return this.pointer;
            },

            getCollection: function () {
                return sjl.classOfIs(this.collection, 'Array') ? this.collection : [];
            }

        });

})(typeof window === 'undefined' ? global : window);
