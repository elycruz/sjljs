/**
 * Created by Ely on 8/6/2015.
 */
(function () {
    var PriorityList = function PriorityList () {
        this.__internal = this.__internal || {};
        sjl.extend(true, this.__internal, {
            serial: 0,
            isLIFO: 1,
            sorted: false
        });

    };
    sjl.PriorityList = sjl.Iterator.extend(PriorityList, {
        insert: function () {},
        priority: function (priority) {
            var isGetterCall = typeof priority === 'undefined';
        }
    });
})