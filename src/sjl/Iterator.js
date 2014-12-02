/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    context.sjl.Iterator = context.sjl.Extendable.extend(
        function Iterator(values, pointer) {
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
                    pointer = self.getPointer();

                pointer += 1;

                self.pointer = pointer;

                return self.valid() ? {
                    done: false,
                    value: self.getCollection()[pointer]
                } : {
                    done: true
                };
            },

            rewind: function () {
                this.pointer = 0;
            },

            valid: function () {
                return this.getPointer() < this.getCollection().length;
            },

            getPointer: function () {
                return context.sjl.classOfIs(this.pointer, 'Number') ? this.pointer : 0;
            },

            getCollection: function () {
                return context.sjl.classOfIs(this.collection, 'Array') ? this.collection : [];
            }

        });

})(typeof window === 'undefined' ? global : window);
