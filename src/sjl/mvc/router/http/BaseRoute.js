/**
 * Created by Ely on 8/16/2015.
 */
(function () {

    var Constructor = function BaseRoute () {},
        BaseRoute = sjl.Extendable.extend(Constructor, {
           getAssembledParams: function () { return []; }
        });

    sjl.package('router.http.BaseRoute', BaseRoute);

}());