/**
 * Created by Ely on 8/15/2015.
 */
(function (context) {

    var sjl = context.sjl,
        BaseContainer = function BaseContainer (pages) {
            sjl.SjlMap.call(this);
            this.addPages(pages);
        };

    return sjl.package('navigation.BaseContainer',
        sjl.SjlMap.extend(BaseContainer, {
            addPage: function (page) {},
            addPages: function (pages) {},
            findAllBy: function (params) {},
            findBy: function (params) {},
            findFirstBy: function (params) {},
            children: function () {},
            removePage: function (params) {},
            removePages: function (params) {},
            setPages: function (pages) {}
        }));

}(typeof window === 'undefined' ? global : window));