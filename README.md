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

## Packages and members:
#### Legend 
- **(m)** - Member prefix.  Denotes item is a member;  E.g., A constructor, method or a property.
- **(p)** - Package prefix.  Denotes item is a package.

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
  - [(m) sjl.stdlib.iterable](#m-sjlstdlibiterable)
  - [(m) sjl.stdlib.Iterator](#m-sjlstdlibiterator)
  - [(m) sjl.stdlib.ObjectIterator](#m-sjlstdlibobjectiterator)
  - [(m) sjl.stdlib.Optionable](#m-sjlstdliboptionable)
  - [(m) sjl.stdlib.PriorityList](#m-sjlstdlibprioritylist)
  - [(m) sjl.stdlib.SjlMap](#m-sjlstdlibsjlmap)
  - [(m) sjl.stdlib.SjlSet](#m-sjlstdlibsjlset)
- [(p) sjl.validator](#p-sjlvalidator)
  - [(m) sjl.validator.AlnumValidator](#m-sjlvalidatoralnumvalidator)
  - [(m) sjl.validator.DigitValidator](#m-sjlvalidatordigitvalidator)
  - [(m) sjl.validator.NotEmptyValidator](#m-sjlvalidatornotemptyvalidator)
  - [(m) sjl.validator.NumberValidator](#m-sjlvalidatornumbervalidator)
  - [(m) sjl.validator.RegexValidator](#m-sjlvalidatorregexvalidator)
  - [(m) sjl.validator.StringLengthValidator](#m-sjlvalidatorstringlengthvalidator)
  - [(m) sjl.validator.Validator](#m-sjlvalidatorvalidator)
  - [(m) sjl.validator.ValidatorChain](#m-sjlvalidatorvalidatorchain)


### (m) sjl.filter.BooleanFilter
@todo - Added documentation here.

### (m) sjl.filter.Filter
@todo - Added documentation here.

### (m) sjl.filter.FilterChain
@todo - Added documentation here.

### (m) sjl.filter.SlugFilter
@todo - Added documentation here.

### (m) sjl.filter.StringToLowerFilter
@todo - Added documentation here.

### (m) sjl.filter.StringTrimFilter
@todo - Added documentation here.

### (m) sjl.filter.StripTagsFilter
@todo - Added documentation here.

### (m) sjl.input.Input
@todo - Added documentation here.

### (m) sjl
@todo - Added documentation here.

### (m) sjl.nodejs.Namespace
@todo - Added documentation here.

### (m) sjl.stdlib.Config
@todo - Added documentation here.

### (m) sjl.stdlib.Extendable
@todo - Added documentation here.

### (m) sjl.stdlib.Iterator
@todo - Added documentation here.

### (m) sjl.stdlib.ObjectIterator
@todo - Added documentation here.

### (m) sjl.stdlib.Optionable
@todo - Added documentation here.

### (m) sjl.stdlib.PriorityList
@todo - Added documentation here.

### (m) sjl.stdlib.SjlMap
@todo - Added documentation here.

### (m) sjl.stdlib.SjlSet
@todo - Added documentation here.

### (m) sjl.stdlib.iterable
@todo - Added documentation here.

### (m) sjl.validator.AlnumValidator
@todo - Added documentation here.

### (m) sjl.validator.DigitValidator
@todo - Added documentation here.

### (m) sjl.validator.NotEmptyValidator
@todo - Added documentation here.

### (m) sjl.validator.NumberValidator
@todo - Added documentation here.

### (m) sjl.validator.RegexValidator
@todo - Added documentation here.

### (m) sjl.validator.StringLengthValidator
@todo - Added documentation here.

### (m) sjl.validator.Validator
@todo - Added documentation here.

### (m) sjl.validator.ValidatorChain
@todo - Added documentation here.

### (p) sjl.filter
@todo - Added documentation here.

### (p) sjl.input
@todo - Added documentation here.

### (p) sjl.nodejs
@todo - Added documentation here.

### (p) sjl.stdlib
@todo - Added documentation here.

### (p) sjl.validator
@todo - Added documentation here.

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
