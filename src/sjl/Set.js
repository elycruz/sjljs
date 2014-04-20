/**
 * Created by Ely on 4/12/2014.
 */
(function (context) {

    var Set = Extendable.extend(
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


})(typeof window === 'undefined' ? global : window);