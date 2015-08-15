/**
 * Created by Ely on 8/15/2015.
 */
(function () {
    /**
     * BaseContainer constructor
     * @type {Object|void|*}
     */
    var BaseContainer = sjl.package('navigation.BaseContainer'),
        Navigation = BaseContainer.extend(function Navigation() {});

    // Set Base Container property as gettable only
    return sjl.package('navigation.BaseContainer', Navigation);
}());