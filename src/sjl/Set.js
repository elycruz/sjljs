/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    var Set = context.Extendable.extend(
        function Set (vals) {

        },
        {

        },
        {

        });

    if (context) {
        context.Set = Set;
    }
    else {
        return Set;
    }


})(typeof sjl === 'undefined' ? (typeof window === 'undefined' ? global : window) : sjl);
