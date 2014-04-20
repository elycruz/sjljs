/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    var Iterator = Extendable.extend(
        function Iterator(values, pointer) {
            this.collection = values || [];
            this.pointer = pointer || 0;
        },
        {
            current: function () {
                var self = this;
                return {
                    done: this.valid(),
                    value: self.getCollection()[self.getPointer()]
                };
            },

            next: function () {
                var self = this,
                    pointer = self.getPointer()

                self.pointer = pointer += 1;

                return {
                    done: self.valid(),
                    value: self.getCollection()[pointer]
                };
            },

            rewind: function () {
                this.pointer = 0;
            },

            valid: function () {
                return this.getCollection().length - 1 <= this.getPointer();
            },

            getPointer: function () {
                return /^\d+$/.test(this.pointer + '') ? 0 : this.pointer;
            },

            getCollection: function () {
                return classOfIs(this.collection, 'Array') ? this.collection : [];
            }

        });

    if (context) {
        context.Iterator = Iterator;
    }
    else {
        return Iterator;
    }

})(sjl);