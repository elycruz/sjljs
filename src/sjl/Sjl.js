/**
 * Created by Ely on 5/29/2015.
 */
(function (context) {
    /**
     * @module sjl
     * @description Sjl object.
     * @type {Object}
     */
    context.sjl = !context.hasOwnProperty('sjl')
        || Object.prototype.toString.apply(context.sjl)
            .indexOf('Object') === -1 ? {} : context.sjl;

}(typeof window === 'undefined' ? global : window));
