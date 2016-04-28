[![Build Status](https://travis-ci.org/elycruz/sjljs.png)](https://travis-ci.org/elycruz/sjljs) 
[![GitHub version](https://badge.fury.io/gh/elycruz%2Fsjljs.svg)](http://badge.fury.io/gh/elycruz%2Fsjljs) 
[![NPM version](https://badge.fury.io/js/sjljs.svg)](http://badge.fury.io/js/sjljs)
[![Dependencies](https://david-dm.org/elycruz/sjljs.png)](https://david-dm.org/elycruz/sjljs)
sjljs
=====

A library for writing strongly typed javascript and solid classical oop.  Also for making your applications, components,
and libraries more concise. 

Not meant to replace popular libraries like Backbone, Underscore, or Jquery etc..  Only meant as a supplement to them 
or as a supplement to applications requiring quick ramp up, some semblance of cohesion, and/or applications requiring 
functional programming.

~~See release notes for release 5.6.0.~~
## Warning:  This is branch is in alhpa.

## Sections in Readme:
- [Getting Started](#getting-started)
- [Packages and Members](#packages-and-members)
- [Tests](#tests)
- [Requirements](#requirements)
- [Supported Platforms](#supported-platforms)
- [Todos](#todos)
- [License](#license)

## Getting Started:
Include either the full library './sjl[.min].js' or the minimal version './sjl-minimal[.min].js' (the minimal version
only includes the core and no classes or constructors from it's other packages).

## Sjl direct Members and Methods:
#### Legend 
- **(m)** - Member prefix.  Denotes item is a member;  E.g., A method or property.

#### Members/Methods:

- [(m) sjl.argsToArray](#m-sjlargstoarray)
- [(m) sjl.camelCase](#m-sjlcamelcase)
- [(m) sjl.classOf](#m-sjlclassof)
- [(m) sjl.classOfIs](#m-sjlclassofis)
- [(m) sjl.classOfIsMulti](#m-sjlclassofismulti)
- [(m) sjl.clone](#m-sjlclone)
- [(m) sjl.constrainPointer](#m-sjlconstrainpointer)
- [(m) sjl.defineSubClass](#m-sjldefinesubclass)
- [(m) sjl.defineEnumProp](#m-sjldefineenumprop)
- [(m) sjl.empty](#m-sjlempty)
- [(m) sjl.emptyMulti](#m-sjlemptymulti)
- [(m) sjl.extend](#m-sjlextend)
- [(m) sjl.extractBoolFromArrayEnd](#m-sjlextractboolfromarrayend)
- [(m) sjl.extractBoolFromArrayStart](#m-sjlextractboolfromarraystart)
- [(m) sjl.extractFromArrayAt](#m-sjlextractfromarrayat)
- [(m) sjl.hasMethod](#m-sjlhasmethod)
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
- [(m) sjl.jsonClone](#m-sjljsonclone)
- [(m) sjl.lcaseFirst](#m-sjllcasefirst)
- [(m) sjl.autoNamespace](#m-sjlautonamespace)
- [(m) sjl.notEmptyAndOfType](#m-sjlnotemptyandoftype)
- [(m) sjl.restArgs](#m-sjlrestargs)
- [(m) sjl.ucaseFirst](#m-sjlucasefirst)
- [(m) sjl.unset](#m-sjlunset)
- [(m) sjl.searchObj](#m-sjlsearchobj)
- [(m) sjl.throwTypeErrorIfNotOfType](#m-sjlthrowtypeerrorifnotoftype)
- [(m) sjl.throwTypeErrorIfEmpty](#m-sjlthrowtypeerrorifempty)
- [(m) sjl.valueOrDefault](#m-sjlvalueordefault)
- [(m) sjl.wrapPointer](#m-sjlwrappointer)
- [(m) sjl.Symbol](#m-sjlsymbol)
- [(m) sjl.ns](#m-sjlns)
- [(m) sjl.package](#m-sjlpackage)
- [(m) sjl.filter](#m-sjlfilter)
- [(m) sjl.input](#m-sjlinput)
- [(m) sjl.nodejs](#m-sjlnodejs)
- [(m) sjl.sjl](#m-sjlsjl)
- [(m) sjl.stdlib](#m-sjlstdlib)
- [(m) sjl.validator](#m-sjlvalidator)


## Packages and members:
#### Legend 
- **(m)** - Member prefix.  Denotes item is a member;  E.g., A constructor, method or a property.
- **(p)** - Package prefix.  Denotes item is a package;  E.g., an object with access to package members directly on it.

#### Packages and Members List:

- [(p) sjl.filter](#p-sjlfilter)
  - [(m) sjl.filter.BooleanFilter](#m-sjlfilterbooleanfilter)
  - [(m) sjl.filter.Filter](#m-sjlfilterfilter)
  - [(m) sjl.filter.FilterChain](#m-sjlfilterfilterchain)
  - [(m) sjl.filter.SlugFilter](#m-sjlfilterslugfilter)
  - [(m) sjl.filter.StringToLowerFilter](#m-sjlfilterstringtolowerfilter)
  - [(m) sjl.filter.StringTrimFilter](#m-sjlfilterstringtrimfilter)
  - [(m) sjl.filter.StripTagsFilter](#m-sjlfilterstriptagsfilter)
- [(p) sjl.input](#p-sjlinput)
  - [(m) sjl.input.Input](#m-sjlinputinput)
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
  - [(m) sjl.stdlib.SjlMap](#m-sjlstdlibsjlmap)
  - [(m) sjl.stdlib.SjlSet](#m-sjlstdlibsjlset)
  - [(m) sjl.stdlib.iterable](#m-sjlstdlibiterable)
- [(p) sjl.validator](#p-sjlvalidator)
  - [(m) sjl.validator.AlnumValidator](#m-sjlvalidatoralnumvalidator)
  - [(m) sjl.validator.DigitValidator](#m-sjlvalidatordigitvalidator)
  - [(m) sjl.validator.NotEmptyValidator](#m-sjlvalidatornotemptyvalidator)
  - [(m) sjl.validator.NumberValidator](#m-sjlvalidatornumbervalidator)
  - [(m) sjl.validator.RegexValidator](#m-sjlvalidatorregexvalidator)
  - [(m) sjl.validator.StringLengthValidator](#m-sjlvalidatorstringlengthvalidator)
  - [(m) sjl.validator.Validator](#m-sjlvalidatorvalidator)
  - [(m) sjl.validator.ValidatorChain](#m-sjlvalidatorvalidatorchain)


### (m) sjl.Symbol
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.argsToArray
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.autoNamespace
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.camelCase
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.classOf
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.classOfIs
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.classOfIsMulti
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.clone
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.constrainPointer
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.defineEnumProp
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.defineSubClass
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.empty
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.emptyMulti
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.extend
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.extractBoolFromArrayEnd
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.extractBoolFromArrayStart
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.extractFromArrayAt
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.filter.BooleanFilter
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.filter.Filter
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.filter.FilterChain
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.filter.SlugFilter
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.filter.StringToLowerFilter
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.filter.StringTrimFilter
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.filter.StripTagsFilter
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.filter
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.hasMethod
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.implode
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.input.Input
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.input
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isArray
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isBoolean
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isEmpty
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isEmptyObj
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isEmptyOrNotOfType
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isFunction
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isNull
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isNumber
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isObject
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isString
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isSymbol
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isUndefined
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.isset
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.issetAndOfType
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.issetMulti
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.jsonClone
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.lcaseFirst
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.nodejs.Namespace
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.nodejs
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.notEmptyAndOfType
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.ns
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.package
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.restArgs
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.searchObj
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.sjl
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.Config
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.Extendable
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.Iterator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.ObjectIterator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.Optionable
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.PriorityList
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.SjlMap
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.SjlSet
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib.iterable
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.stdlib
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.throwTypeErrorIfEmpty
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.throwTypeErrorIfNotOfType
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.ucaseFirst
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.unset
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator.AlnumValidator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator.DigitValidator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator.NotEmptyValidator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator.NumberValidator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator.RegexValidator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator.StringLengthValidator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator.Validator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator.ValidatorChain
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.validator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.valueOrDefault
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (m) sjl.wrapPointer
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (p) sjl.filter
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (p) sjl.input
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (p) sjl.nodejs
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (p) sjl.stdlib
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

### (p) sjl.validator
@todo - Added documentation here.
[Back to package and member list.](#packages-and-members)

## Tests:
1.)  Run `npm install` in project root.
- Tests for all components listed under "Utilities" above.
- Tests to be run on server.  See './tests/for-server'.
- Tests to be run in browser (requires running `bower install` in root directory of this project).
See './tests/for-browser'.

## Requirements:
- Javascript versions ecmascript 5+

## Supported Platforms:

### Browsers
- IE9+, and all other modern day browsers.

### NodeJs
- 5.0.0+

## Todos:
### MVP for 0.6.0
- [ ] - @todo Include all sub items for components included as sub nav in readme.
- [ ] - @todo Cleanup all jsdocs and ensure all library members are listed there and showing their docs properly/clearly.
    - @note jsdoc is currently undergoing a refactor by the jsdoc folks.  It is currently in alpha.
- [ ] - @todo Ensure all existing constructors and library members have a test file for theirselves.

## License:
[GPL v2+](http://www.gnu.org/licenses/gpl-2.0.html "http://www.gnu.org/licenses/gpl-2.0.html") AND
[MIT](http://opensource.org/licenses/MIT "http://opensource.org/licenses/MIT")
