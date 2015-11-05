### Changelog for 11/04/2015 version 0.5.1:

- New function: `createTopLevelPackage` -  Used for new packaging functionality (view readme for more information on it).
- `sjl.empty` and `sjl.isset` no longer operate on more than one value (improves performance).
- All classes that were available on the root level ('./src/sjl') are now available 
at `sjl.package.stdlib` (alias `sjl.ns.stdlib`)).
- All classes that were in the root level that were accessible directly on the `sjl` object (`sjl.{class-name}`)
 now must be accessed via their namespace;  E.g.,
 ```
 // The following
 sjl.Extendable.extend(/*...*/);
 
 // now becomes
 sjl.ns.stdlib.Extendable.extend(/*...*/);
 ```
- `ObjectIterator` was broken out into it's own file (it used to live in './src/sjl/Iterator.js').
- `sjl.iterable` was moved into it's own file (it used to live in './src/sjl/Iterator.js').
- All classes that are defined as part of `sjljs` are now only available via their namespaces
and are no longer available directly on/at `sjljs`;  E.g.,
```
// This..
var BaseValidator = sjl.BaseValidator;

// Now becomes
var BaseValidator = sjl.validator.BaseValidator;

// and 
var InputFilter = sjl.InputFilter;

// Now becomes 
var InputFilter = sjl.input.InputFilter;
```
This allows us to protect (and optionally freeze) our class members.

##### When developing `sjljs`:
- Classes have to be exported for the frontend using either `sjl.package` or `sjl.ns`;  E.g.,
```
function SomeClass () {};
// **Note** Not needed for nodejs
sjl.package('somePackage.SomeClass', SomeClass);
```
- Classes have to be exported for nodejs via it's exporting facilities;  
I.e., `module.exports = SomeClass;`
 