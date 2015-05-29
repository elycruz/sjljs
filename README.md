[![Build Status](https://travis-ci.org/elycruz/sjljs.png)](https://travis-ci.org/elycruz/sjljs) 
[![GitHub version](https://badge.fury.io/gh/elycruz%2Fsjljs.svg)](http://badge.fury.io/gh/elycruz%2Fsjljs) 
[![NPM version](https://badge.fury.io/js/sjljs.svg)](http://badge.fury.io/js/sjljs)
[![Dependencies](https://david-dm.org/elycruz/sjljs.png)](https://david-dm.org/elycruz/sjljs)
sjljs
=====

A Simple Javascript Library.

Not meant to replace popular libraries (Backbone, Underscore, Jquery etc.)
only meant as a supplement to them.

## Components included:
- [Utilities](#utilities)
- [Set Functions](#utilities)
- [OOP Util Functions](#oop-util-functions)
- [Composition Helpers](#composition-helpers)
- [Classes/Constructors](#clases-constructors)
- [Tests](#tests)
- [Requirements](#requirements)
- [Supported Browsers](#supported-browsers)
- [Todos](#todos)
- [Notes](#notes)
- [License](#license)

### Utilities:

##### sjl.argsToArray(Arguments arguments):Array
Converts arguments to an array;  E.g., `sjl.argsToArray(arguments);` -> returns arguments as an array.

##### sjl.camelCase(String str, Boolean ucaseFirst):String
Camel Cases a string;  `sjl.camelCase('hello-world', boolean);` -> returns "helloWorld" if `boolean` is `false`
 else returns "HelloWorld" if `boolean` is `true`

##### sjl.classOf(*):Boolean
Gives you a String representation of the class of value;  e.g., `sjl.classOf("hello") === 'String'`.

##### sjl.classOfIs(*, String classStr):Boolean
Checks whether a value is of class type string;  e.g., `sjl.classOfIs(0, 'Number') === true`.

##### sjl.empty(*):Boolean
Opinionated `empty` check.  Checks if `false`, `0`, `null`, `undefined`, empty array, or empty object is true for one
 or one of many values.

##### sjl.extractBoolFromArrayEnd(Array list):Boolean
Extracts a boolean from the end of an array.  If no boolean is found there returns `false`.

##### sjl.extractBoolFromArrayStart(Array list):Boolean
Extracts a boolean from the beginning of an array.  If no boolean is found at the beginning of the array 
returns `false`.

##### sjl.isset(*):Boolean
Checks to see that a value(s) is not `null` or `undefined` for one or one of many values.

##### sjl.lcaseFirst(String str):String
Lowercases the first character of a string;  E.g., `sjl.lcaseFirst ('Hello')` returns 'hello'.

##### sjl.namespace(String key, Object objToSearch, * valueToSet):*
For getting and setting values on hash objects (allows deep searching by namespace string (`'all.your.base'`
 finds or sets `{all: {your: {base: ...}}}`).

##### sjl.ucaseFirst(String str):String
Uppercases the first character of a string;  E.g., `sjl.ucaseFirst('hello');`  returns 'Hello'.

##### sjl.issetObjKey(Object obj, String key):Boolean
Checks whether an object has own property for a key and that the key isset (has a value other than null or undefined).

##### sjl.isEmptyObjKey(Object obj, String key, String type(optional)):Boolean
Does everything `sjl.issetObjKey` does plus also checks whether `obj[key]`'s value is empty or not.

### Set Functions:

##### extend((Boolean|*)[,obj, obj][,Boolean]) : Object
Similiar to JQuery's `extend` method except with the following method signature:
`extend((Boolean|*)[,obj, obj],[Boolean]) : Object`
    - Where `*` is any type of object with type "Object".
    - `obj` is any type of object of type "Object".
    - and the last `[Boolean]` (optional boolean) is passed in to force
    the extend method to use any composite styled set methods that may be available
    for the key being merged on to the first object;  composite styled = `set{keyName}` | `setKeyName`.

    This last item in the list above allows for interesting objects which inherit a waterfall
    like property on instantiation (if you use the `extend` method to merge passed in options on instantiation).

### OOP Util functions:

##### copyOfProto(Prototype prototype)
Creates a copy of a prototype (backward compatible to older IEs).

##### defineSubClass(superclass, constructor, methods, statics): Constructor
Creates a sub class of a constructor and makes it extendable via the static method `extend`;  E.g., pretty much 
creates `sjl.Extendable`.

##### throwNotOfTypeError() 
This method is used internally but is tentative and may be removed later.

#### Composition helpers:

##### sjl.getValueFromObj
Allows getting value by namespace string (ex: `'some.object.deep'`) also if return value is a function automatically 
calls it and allows you to pass args to use with value if it is a function also allows for fetching the value raw if 
it is a function.

#####  sjl.setValueOnObj
Allows setting a value on an object by namespace string or conjoined setter function (setPropertyName) or sets value 
directly if no setter or namespace string found/used.

### Classes/Constructors

##### sjl.Attributable
A base attributable constructor which has two methods attr and attrs (for setting and getting multiple attributes 
jquery style).

##### sjl.Iterator
A simple iterator constructor which mimicks the es6 iterator and the php `Iterator` class.

##### sjl.Extendable
A base extendable constructor with an `extend`.

##### sjl.Optionable
A simple Optionable class with `set`, `get`, `merge`, and `has` methods.

###### has (String value) :Boolean
Takes a regular string or a namespaced string to find out if value exists on the Optionable's object `options` object.

###### get (String key) :(null|*)
Takes a regular string or a namespaced one and pulls out the value from Optionable's `options` object.
  Returns null `key` doesn't exist.
 
###### set (String key, * value) :Optionable
Takes a key and a value param or an object (sets multiple key value pairs in this case).  
Key value can be a namespaced string.  Also if first value is an object then set uses `sjl.setValueOnObj` 
(see description of this method above) to set values on this Optionable.
    
###### merge ((Object|Boolean) param0-*) :Optionable
Merges all `Object`s passed into it to Optionable's `options` object.  If last param in arguments is a Boolean
    then checks extracts this boolean and passes it on to `sjl.extend` (in an attempt to invoke `extend`'s 
    useLegacyGettersAndSetters` feature if the boolean is true and not invoke the feature to do the merge if the
     boolean is false).

### Tests:
- Tests for all components listed under "Utilities" above.
- Tests to be run on server.
- Tests to be run in browser (requires running `bower install` in root directory).

## Requirements:
- Javascript versions ecmascript 3+

## Supported browsers:
- ie8+, and all other browsers

## Notices/Deprecations/Warnings:
The following convenience files will be removed in the next major release along with their build options:
- 'sjl-functions-only*.js'
- 'sjl-utilities-only*.js'

## Todos:

### MVP Todos:
- [X] - Write tests for:
    - [ ] - `sjl.Optionable`.
    - [ ] - `sjl.Attributable`.
    - [ ] - `sjl.getValueFromObj`
    - [ ] - `sjl.setValueOnObj`
    - [ ] - `sjl.extend` (for new features)
    - [ ] - `sjl.Iterator`

### MVP for 0.5.0:
- [ ] - Write docs for all validator classes.
- [ ] - Write tests for all validator classes:
    - [ ] - `sjl.NumberValidator`.
    - [ ] - `sjl.AlphaNumValidator`.
- [ ] - Write a filter chain class.
- [ ] - Change interface check to check for 'isValid' and 'message'
    properties on a 'AbstractValidator' class passed to a 'ValidatorChain' class.
- [ ] - Review entirety of library and look for places that could be refactored.
- [ ] - Refactor the `input` package
- [ ] - Refactor the `validator` package
- [ ] - Update readme to a more readable format.
- [ ] - Optimize for file size (maybe put context.sjl into a variable so it can be further minified).

### MVP for 0.5.1+
- [ ] - Add changelog.md and inline in main readme.

#### TENTATIVE:
- [ ] - Refactor Optionable to not have the following methods or to have them as private methods:
    - [ ] - `setOption`.  Instead `set` should be used.
    - [ ] - `setOptions`. Instead `set` should be used.
    - [ ] - `getOption`.  Instead `get` should be used.
    - [ ] - `getOptions`.  Instead `get` should be used.

### Clean-up:
- [X] - Remove 'sjl-functions-only*.js' and all of it's build options from the library.
- [X] - Remove 'sjl-utilities-only*.js' and all of it's build options from the library.

## Notes:
There is no changelog as the library hasn't been publicized but there will be a changelog starting version 0.5.0.

## License:
[GPL v2-3+](http://www.gnu.org/licenses/gpl-2.0.html "http://www.gnu.org/licenses/gpl-2.0.html") &
[MIT](http://opensource.org/licenses/MIT "http://opensource.org/licenses/MIT")
