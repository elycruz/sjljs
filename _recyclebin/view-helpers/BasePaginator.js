/**
 * Created by Ely on 8/19/2015.
 */
(function () {

    var BasePaginator = function BasePaginator () {
        var self = this;
        sjl.Optionable.apply(self, arguments);
        self._gotoPageNum(self.options.pages.pointer);
    };

    sjl.Optionable.extend(BasePaginator, {

        _nextPage: function () {
            var self = this,
                ops = self.options;

            // Set direction to next
            ops.pages.pointerDirection = 1;

            if (ops.pages.pointer < ops.pages.length - 1) {
                ops.pages.pointer += 1;
            }
            else {
                ops.pages.pointer = 0;
            }

            // Goto Page src number
            self._gotoPageNum(ops.pages.pointer);

            // Trigger event
            self.element.trigger(self.widgetName + ':nextPage',
                {pointer: ops.pages.pointer});

            return self;
        },

        _prevPage: function () {
            var self = this,
                ops = self.options;
            if (ops.pages.pointer > 0) {
                ops.pages.pointer -= 1;
            }
            else {
                ops.pages.pointer = ops.pages.length - 1;
            }

            // Set direction to previous
            ops.pages.pointerDirection = -1;

            // Goto Page src number
            self._gotoPageNum(ops.pages.pointer);

            // Trigger event
            self.element.trigger(self.widgetName + ':prevPage',
                {pointer: ops.pages.pointer});

            return self;
        },

        _gotoPageNum: function (num) {
            var self = this,
                ops = self.options;
            // Set prev and next
            ops.pages.prev = num - 1;

            ops.pages.next = num + 1;

            // Ensure less than pages length
            if (num > ops.pages.length - 1) {
                num = ops.pages.length - 1;
            }

            // Ensure positive number
            if (num < 0) {
                num = 0;
            }

            // Set pointer
            ops.pages.pointer = num;

            // If callback is set call it
            sjl.getValueFromObj(ops, 'onGotoPageNum', false);

            // Trigger gotoPageNum
            self.element.trigger(self.constructor.name + ':gotoPageNum', {pointer: num});

            return self;
        },

        pointer: function (pointer) {
            var self = this,
                isGetterCall = typeof pointer === 'undefined',
                retVal = self;
            if (isGetterCall) {
                retVal = self.options.pages.pointer;
            }
            else {
                self.options.pages.pointer = parseInt(pointer, 10);
            }
            return retVal;
        }
    });
}());