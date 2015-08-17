/**
 * Created by Ely on 8/15/2015.
 */
(function (context) {

    'use strict';

    var sjl = context.sjl,
        BaseContainer = function BaseContainer (pages) {
            sjl.SjlMap.call(this);
            this.addPages(pages);
        };

    return sjl.package('navigation.BaseContainer',

        sjl.SjlMap.extend(BaseContainer, {
            addPage: function (page) {
                return this.set(page.name, page);
            },
            addPages: function (pages) {
                var self = this;
                pages.forEach(function (page) {
                    self.addPage(page);
                });
                return self;
            },
            findAllBy: function (params) {},
            findBy: function (params) {},
            findFirstBy: function (params) {},
            children: function () {},
            removePage: function (name) {
                return this.delete(sjl.classOfIs(name, 'String')
                    ? name : name.name);
            },
            removePages: function (pages) {
                var self = this;
                sjl.forEach(pages, function (page) {
                    self.removePage(page);
                });
                return self;
            },
            setPages: function (pages) {
                return this.clear()
                    .addPages(pages);
            }
        }));

}(typeof window === 'undefined' ? global : window));