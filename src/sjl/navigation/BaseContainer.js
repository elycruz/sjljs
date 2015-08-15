/**
 * Created by Ely on 8/15/2015.
 */
(function () {
    sjl.navigation.BaseContainer = sjl.SjlMap.extend(function BaseContainer (pages) {
        sjl.SjlMap.call(this);
        this.addPages(pages);
    }, {
        addPage: function (page) {},
        addPages: function (pages) {},
        findAllBy: function (params) {},
        findBy: function (params) {},
        findFirstBy: function (params) {},
        children: function () {},
        removePage: function (params) {},
        removePages: function (params) {},
        setPages: function (pages) {}
    });

    return sjl.navigation.BaseContainer;
}());