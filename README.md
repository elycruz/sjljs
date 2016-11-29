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

## Sections in Readme:
- [Getting Started](#getting-started)
- [Unit Tests](#unit-tests)
- [Requirements](#requirements)
- [Supported Platforms](#supported-platforms)
- [Todos](#todos)
- [License](#license)

## Getting Started:
Include either the full library './sjl[.min].js' or the minimal version './sjl-minimal[.min].js' (the minimal version
only includes the core and no classes or constructors from it's other packages).

## Other Packages and members:
#### Legend 
- **(m)** - Member prefix.  Denotes item is a member;  E.g., A constructor, method or a property.
- **(p)** - Package prefix.  Denotes item is a package;  E.g., an object with access to package members directly on it.

#### Other Packages and Members List:

- [(m) sjl.Either](#m-sjleither)
- [(m) sjl.Maybe](#m-sjlmaybe)
- [(m) sjl.Monad](#m-sjlmonad)
- [(m) sjl.fn](#m-sjlfn)
- [(p) sjl.generated](#p-sjlgenerated)
  - [(m) sjl.generated.version](#m-sjlgeneratedversion)
- [(m) sjl.math](#m-sjlmath)
- [(p) sjl.nodejs](#p-sjlnodejs)
  - [(m) sjl.nodejs.Namespace](#m-sjlnodejsnamespace)
- [(m) sjl](#m-sjl)
- [(p) sjl.stdlib](#p-sjlstdlib)
  - [(m) sjl.stdlib.Config](#m-sjlstdlibconfig)
  - [(m) sjl.stdlib.Extendable](#m-sjlstdlibextendable)
  - [(m) sjl.stdlib.Iterator](#m-sjlstdlibiterator)
  - [(m) sjl.stdlib.ObjectIterator](#m-sjlstdlibobjectiterator)
  - [(m) sjl.stdlib.Optionable](#m-sjlstdliboptionable)
  - [(m) sjl.stdlib.PriorityList](#m-sjlstdlibprioritylist)
  - [(m) sjl.stdlib.PriorityListItem](#m-sjlstdlibprioritylistitem)
  - [(m) sjl.stdlib.SjlMap](#m-sjlstdlibsjlmap)
  - [(m) sjl.stdlib.SjlSet](#m-sjlstdlibsjlset)
  - [(m) sjl.stdlib.iterable](#m-sjlstdlibiterable)


## Sjl direct Members and Methods:
#### Legend 
- **(m)** - Member prefix.  Denotes item is a member;  E.g., A method or property.

#### Members/Methods:

- [(m) sjl.argsToArray](#m-sjlargstoarray)
- [(m) sjl.arrayLikeToArray](#m-sjlarrayliketoarray)
- [(m) sjl.notArrayLikeToArray](#m-sjlnotarrayliketoarray)
- [(m) sjl.autoNamespace](#m-sjlautonamespace)
- [(m) sjl.camelCase](#m-sjlcamelcase)
- [(m) sjl.classOf](#m-sjlclassof)
- [(m) sjl.classOfIs](#m-sjlclassofis)
- [(m) sjl.classOfIsMulti](#m-sjlclassofismulti)
- [(m) sjl.classicalToStringMethod](#m-sjlclassicaltostringmethod)
- [(m) sjl.clone](#m-sjlclone)
- [(m) sjl.compose](#m-sjlcompose)
- [(m) sjl.concatArrayLikes](#m-sjlconcatarraylikes)
- [(m) sjl.constrainPointer](#m-sjlconstrainpointer)
- [(m) sjl.curry](#m-sjlcurry)
- [(m) sjl.curryN](#m-sjlcurryn)
- [(m) sjl.curry1](#m-sjlcurry1)
- [(m) sjl.curry2](#m-sjlcurry2)
- [(m) sjl.curry3](#m-sjlcurry3)
- [(m) sjl.curry4](#m-sjlcurry4)
- [(m) sjl.curry5](#m-sjlcurry5)
- [(m) sjl.defineSubClass](#m-sjldefinesubclass)
- [(m) sjl.defineSubClassPure](#m-sjldefinesubclasspure)
- [(m) sjl.defineEnumProp](#m-sjldefineenumprop)
- [(m) sjl.empty](#m-sjlempty)
- [(m) sjl.emptyMulti](#m-sjlemptymulti)
- [(m) sjl.extend](#m-sjlextend)
- [(m) sjl.extractBoolFromArrayEnd](#m-sjlextractboolfromarrayend)
- [(m) sjl.extractBoolFromArrayStart](#m-sjlextractboolfromarraystart)
- [(m) sjl.extractFromArrayAt](#m-sjlextractfromarrayat)
- [(m) sjl.forEach](#m-sjlforeach)
- [(m) sjl.forEachInObj](#m-sjlforeachinobj)
- [(m) sjl.getIterator](#m-sjlgetiterator)
- [(m) sjl.getArrayLikes](#m-sjlgetarraylikes)
- [(m) sjl.hasMethod](#m-sjlhasmethod)
- [(m) sjl.hasIterator](#m-sjlhasiterator)
- [(m) sjl.implode](#m-sjlimplode)
- [(m) sjl.isset](#m-sjlisset)
- [(m) sjl.issetMulti](#m-sjlissetmulti)
- [(m) sjl.issetAndOfType](#m-sjlissetandoftype)
- [(m) sjl.isEmpty](#m-sjlisempty)
- [(m) sjl.isEmptyObj](#m-sjlisemptyobj)
- [(m) sjl.isEmptyOrNotOfType](#m-sjlisemptyornotoftype)
- [(m) sjl.isArray](#m-sjlisarray)
- [(m) sjl.isBoolean](#m-sjlisboolean)
- [(m) sjl.isFunction](#m-sjlisfunction)
- [(m) sjl.isNull](#m-sjlisnull)
- [(m) sjl.isNumber](#m-sjlisnumber)
- [(m) sjl.isObject](#m-sjlisobject)
- [(m) sjl.isString](#m-sjlisstring)
- [(m) sjl.isSymbol](#m-sjlissymbol)
- [(m) sjl.isUndefined](#m-sjlisundefined)
- [(m) sjl.iteratorToArray](#m-sjliteratortoarray)
- [(m) sjl.jsonClone](#m-sjljsonclone)
- [(m) sjl.lcaseFirst](#m-sjllcasefirst)
- [(m) sjl.mapToArray](#m-sjlmaptoarray)
- [(m) sjl.mergeOnProps](#m-sjlmergeonprops)
- [(m) sjl.mergeOnPropsMulti](#m-sjlmergeonpropsmulti)
- [(m) sjl.notEmptyAndOfType](#m-sjlnotemptyandoftype)
- [(m) sjl.objToArrayMap](#m-sjlobjtoarraymap)
- [(m) sjl.objToArray](#m-sjlobjtoarray)
- [(m) sjl.restArgs](#m-sjlrestargs)
- [(m) sjl.searchObj](#m-sjlsearchobj)
- [(m) sjl.setToArray](#m-sjlsettoarray)
- [(m) sjl.throwTypeErrorIfNotOfType](#m-sjlthrowtypeerrorifnotoftype)
- [(m) sjl.throwTypeErrorIfEmptyOrNotOfType](#m-sjlthrowtypeerrorifemptyornotoftype)
- [(m) sjl.throwTypeErrorIfEmpty](#m-sjlthrowtypeerrorifempty)
- [(m) sjl.toArray](#m-sjltoarray)
- [(m) sjl.ucaseFirst](#m-sjlucasefirst)
- [(m) sjl.unConfigurableNamespace](#m-sjlunconfigurablenamespace)
- [(m) sjl.unset](#m-sjlunset)
- [(m) sjl.valueOrDefault](#m-sjlvalueordefault)
- [(m) sjl.wrapPointer](#m-sjlwrappointer)
- [(m) sjl.Symbol](#m-sjlsymbol)
- [(m) sjl._](#m-sjl_)
- [(m) sjl.isNodeEnv](#m-sjlisnodeenv)
- [(m) sjl.ns](#m-sjlns)
- [(m) sjl.package](#m-sjlpackage)


### (m) sjl.Either
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.Identity
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.Maybe
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.Monad
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.Symbol
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl._

This is a place holder member.  It is an immutable value that can be used to represent a placeholder other than null;
E.g., used by `sjl.curry` and `sjl.curryN` to allow curry functions and using place holders for values 
you're not ready to passed in;  E.g.,
```
var slice = Array.prototype.slice,
 add = function () {...}, // recursively adds
 multiply = function () {...}; // recursively multiplies

sjl.curry(add, __, __, __)(1, 2, 3, 4, 5) === 15 // `true`
sjl.curry(multiply, __, 2, __)(2, 2) === Math.pow(2, 3) // `true`
sjl.curry(divide, __, 625, __)(3125, 5)

```

[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.argsToArray

Same as Array.prototype.slice but neatly packaged for reuse;  Also essentially used to convert an `arguments` object
to an actual array.

E.g.,
```
function someFunction () {
    // `arguments` gets returned as an actual array here.
    return sjl.argsToArray(arguments).map( arg => someProcess(arg) );
}
```

[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.arrayLikeToArray

Converts array likes (Set, Map, SjlSet, SjlMap, Array, Arguments) to arrays (returns passed in arrays untouched).

[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.autoNamespace

Allows you to set or get a path on an object by namespace string.

[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.camelCase
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.classOf
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.classOfIs
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.classOfIsMulti
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.classicalToStringMethod
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.clone
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.compose
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.concatArrayLikes
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.constrainPointer
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.curry
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.curry1
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.curry2
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.curry3
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.curry4
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.curry5
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.curryN
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.defineEnumProp
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.defineSubClass
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.defineSubClassPure
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.empty
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.emptyMulti
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.extend
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.extractBoolFromArrayEnd
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.extractBoolFromArrayStart
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.extractFromArrayAt
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.filter.BooleanFilter
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.filter.Filter
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.filter.FilterChain
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.filter.SlugFilter
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.filter.StringToLowerFilter
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.filter.StringTrimFilter
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.filter.StripTagsFilter
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.filter
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.fn
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.forEach
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.forEachInObj
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.generated.version
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.getArrayLikes
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.getIterator
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.hasIterator
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.hasMethod
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.implode
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.input.Input
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.input.InputFilter
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.input
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isArray
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isBoolean
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isEmpty
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isEmptyObj
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isEmptyOrNotOfType
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isFunction
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isNodeEnv
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isNull
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isNumber
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isObject
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isString
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isSymbol
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isUndefined
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.isset
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.issetAndOfType
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.issetMulti
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.iteratorToArray
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.jsonClone
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.lcaseFirst
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.mapToArray
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.math
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.mergeOnProps
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.mergeOnPropsMulti
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.nodejs.Namespace
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.nodejs
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.notArrayLikeToArray
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.notEmptyAndOfType
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.ns
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.objToArray
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.objToArrayMap
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.package
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.restArgs
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.searchObj
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.setToArray
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.sjl
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.sjlfn
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.stdlib.Config
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.Extendable
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.Iterator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.ObjectIterator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.Optionable
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.PriorityList
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.PriorityListItem
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.SjlMap
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.SjlSet
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib.iterable
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.stdlib
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.throwTypeErrorIfEmpty
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.throwTypeErrorIfEmptyOrNotOfType
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.throwTypeErrorIfNotOfType
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.toArray
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.ucaseFirst
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.unConfigurableNamespace
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.unset
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.validator.AlnumValidator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.validator.DigitValidator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.validator.NotEmptyValidator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.validator.NumberValidator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.validator.RegexValidator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.validator.StringLengthValidator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.validator.Validator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.validator.ValidatorChain
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (m) sjl.validator
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.valueOrDefault
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (m) sjl.wrapPointer
@todo - Added documentation here.
[Back to sjl direct members and methods list.](#sjl-direct-members-and-methods)

### (p) sjl.filter
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (p) sjl.generated
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (p) sjl.input
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (p) sjl.nodejs
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (p) sjl.stdlib
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

### (p) sjl.validator
@todo - Added documentation here.
[Back to other packages and members list.](#other-packages-and-members)

## Unit Tests:
To run unit tests:

1.)  First do an `npm install` in project root.

2.)  For running tests with node:
Run one of the following from your terminal:
 - `$ gulp tests`, 
 - `$ mocha tests/for-server`, or 
 - `$ npm tests` 
 
3.)  For running tests in the browser:
- Launch './tests/for-browser/index.html'
- **Note** `npm install` has to be run prior to running the aforementioned file.
- **Alternately** You can check the tests for this version of the library here:
[6.4.x] (http://sjljs.elycruz.com/6.4.x/tests/for-browser)
[6.3.x] (http://sjljs.elycruz.com/6.3.x/tests/for-browser)
[6.2.x] (http://sjljs.elycruz.com/6.2.x/tests/for-browser)
[6.1.x] (http://sjljs.elycruz.com/6.1.x/tests/for-browser)
[6.0.x] (http://sjljs.elycruz.com/6.0.x/tests/for-browser)
[5.6.34] (http://sjljs.elycruz.com/5.6.34/tests/for-browser)
[5.6.0] (http://sjljs.elycruz.com/5.6.0/tests/for-browser)
[0.5.18] (http://sjljs.elycruz.com/0.5.18/tests/for-browser)
[0.5.17] (http://sjljs.elycruz.com/0.5.17/tests/for-browser)
[0.5.15] (http://sjljs.elycruz.com/0.5.15/tests/for-browser)

## Requirements:
- Javascript versions ecmascript 5+

## Supported Platforms:

### Browsers
- IE9+, and all other modern day browsers.

### NodeJs
- 4.0.0+

## Todos:
### MVP for 6.1.0
- [X] - ~~@todo Include all sub items for components included as sub nav in readme.~~ All docs will now be included in api docs
instead (generated with jsdocs).
- [X] - @todo Cleanup all jsdocs and ensure all library members are listed there and showing their docs properly/clearly.
- [ ] - @todo Ensure all existing constructors and library members have a test file for theirselves.

## License:
[GPL v2+](http://www.gnu.org/licenses/gpl-2.0.html "http://www.gnu.org/licenses/gpl-2.0.html") AND
[MIT](http://opensource.org/licenses/MIT "http://opensource.org/licenses/MIT")
