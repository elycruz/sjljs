/**
 * Created by Ely on 8/16/2015.
 */
(function () {

    /**
     * Base Http Route constructor.
     * @constructor
     */
    var BaseRoute = function BaseRoute () {};

    /**
     * Base Http Route statics and prototype
     * @type {router.http.BaseRoute}
     */
    BaseRoute = sjl.Extendable.extend(BaseRoute, {
       getAssembledParams: function () { return []; }
    });

    // Set `BaseRoute` on package path
    sjl.package('router.http.BaseRoute', BaseRoute);

}());