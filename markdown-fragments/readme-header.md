[![Build Status](https://travis-ci.org/elycruz/sjljs.png)](https://travis-ci.org/elycruz/sjljs) 
[![GitHub version](https://badge.fury.io/gh/elycruz%2Fsjljs.svg)](http://badge.fury.io/gh/elycruz%2Fsjljs) 
[![NPM version](https://badge.fury.io/js/sjljs.svg)](http://badge.fury.io/js/sjljs)
[![Dependencies](https://david-dm.org/elycruz/sjljs.png)](https://david-dm.org/elycruz/sjljs)
sjljs
=====

A library for writing strongly typed javascript and solid classical oop.  Also for making your applications, components,
and libraries more concise. 

Not meant to replace popular libraries like Backbone, Underscore, or Jquery etc..  Only meant as a supplement to them 
or as a supplement to applications requiring quick ramp up.

### Note: 
#### (This change only affects node users)
There was a backward compatability break introduced in version 6.1.x
where `sjl.ns` enforces strict paths on the nodejs side;  E.g.,
```
sjl.stdlib.Extendable; // is no longer allowed

// now you have to strictly access the `ns` namespace
sjl.ns.stdlib.Extendable;

```

So now all pacakges that were available directly on `sjl` now have to be accessed
via `sjl.ns...`, affected packages: all
```
sjl.stdlib // now becomes
sjl.ns.stdlib

// All members in `stdlib` are now only accessible via `sjl.ns.stdlib` (on the node side)
```
Apologies to all who were affected by the change.

Also the reason for the change was that when exporting all the members/packages
available on `sjl.ns` directly onto `sjl` it was noticed that `Namespace`'s getters were being triggered
effectively getting every module that was define to lazily load on the namespaces 
with `sjl.ns`.  As you could imagine most folks would not expect this behavior so 
the functionality was removed.

### Jsdocs
Api for current version:

- [6.4.x] (http://sjljs.elycruz.com/6.4.x/jsdocs)

#### Docs for previous versions:
- [6.3.x] (http://sjljs.elycruz.com/6.3.x/jsdocs)
- [6.2.x] (http://sjljs.elycruz.com/6.2.x/jsdocs)
- [6.1.x] (http://sjljs.elycruz.com/6.1.x/jsdocs)
- [6.0.x (under construction)] (http://sjljs.elycruz.com/6.0.x/jsdocs)
- [5.6.34 (view readme in branch)] (https://github.com/elycruz/sjljs/tree/5.6.0-alpha)
- [5.0.x (view readme in branch)] (https://github.com/elycruz/sjljs/tree/5.0.XX)
- [0.5.x (view readme in branch)] (https://github.com/elycruz/sjljs/tree/0.5.x)
