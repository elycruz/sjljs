/**
 * Created by Ely on 8/16/2015.
 */
/**
 * Created by Ely on 8/16/2015.
 */
(function () {

    var Constructor = function RouteMatch () {},
        RouteMatch = sjl.Extendable.extend(Constructor, {
            getMatchedRouteName: function () {},
            getParam: function (name, defaultValue) {},
            getParams: function () {},
            setMatchedRouteName: function () {},
            setParam: function () {}
        });

    sjl.package('router.RouteMatch', RouteMatch);

}());