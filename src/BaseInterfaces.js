/**
 * Created by elyde on 11/24/2016.
 */
(function () {

    'use strict';

    var Extendable = sjl.defineSubClass(Function),
        Functor = function Functor () {},
        Foldable = function Foldable () {},
        Setoid = function Setoid () {},
        SemiGroup = function Semigroup () {},
        Traversable = function Traversable () {},
        Monoid = function Monoid () {};

    Functor = Extendable.extend(Functor, {map: function () {return;}});
    Foldable = Functor.extend(Foldable, {reduce: function () {return;}});
    Setoid = Extendable.extend(Setoid, {equals: function () {return false;}});
    SemiGroup = Extendable.extend(SemiGroup, {concat: function () {return;}});
    Traversable = Foldable.extend(Traversable, {traverse: function () {return;}});
    Monoid = Foldable.extend(Monoid, null, {empty: function () { return new Monoid(); }});

}());
