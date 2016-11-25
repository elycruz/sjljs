/**
 * Created by elyde on 11/24/2016.
 */
(function () {

    // ########################################################
    // # EXPERIMENT
    // ########################################################

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./sjl') : (window.sjl || {}),
        Extendable = sjl.defineSubClass(Function),
        Functor = function Functor (value) {
            Object.defineProperty(this, 'value', {
                value: value,
                writable: true
            });
        },
        Foldable = function Foldable () {},
        Setoid = function Setoid () {},
        SemiGroup = function Semigroup () {},
        Traversable = function Traversable () {},
        Monoid = function Monoid () {};

    Functor = Extendable.extendWith(Functor, {map: function () {return;}});
    Foldable = Functor.extendWith(Foldable, {reduce: function () {return;}});
    Setoid = Extendable.extendWith(Setoid, {equals: function () {return false;}});
    SemiGroup = Extendable.extendWith(SemiGroup, {concat: function () {return;}});
    Traversable = Foldable.extendWith(Traversable, {traverse: function () {return;}});
    Monoid = SemiGroup.extendWith(Monoid, null, {empty: function () { return new Monoid(); }});

}());
