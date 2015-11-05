### Changelog for 04/23/2015:
- Updated tests for `sjl.PostCodeValidator`.

### Changelog for 05/29/2015:
- Updated main readme.md format.
- Removed notices from main readme.md.
- Added changelog task to gulpfile.
- Added jsdoc task to gulpfile.
- Updated commenting in ./src/**/*.js to use jsdoc3.
- Generated documentation using jsdoc.

### Changelog for 06/12/2015:
- Finished test for new version of `sjl.classOfIs`.
- Updated bower.json to include mocha (so we don't include node_modules/mocha/mocha.css for browser tests).
- Removed if statements before static function declarations on `sjl`.
- Added some new methods.
    - `sjl.issetAndOfType`
    - `sjl.issetObjKeyAndOfType`
    - `sjl.isEmptyObjKeyOrNotOfType`
    - `sjl.hasMethod`
    - `sjl.hasGetterMethod`
    - `sjl.hasSetterMethod`
- Started using new methods within sjl-util-* and main classes directly within ./src/sjl.
- Updated todos in main readme.
- Rebuilt jsdocs and readme.

### Changelog for 06/15/2015:
- Updated `sjl.getValueFromObj` to use legacy getter and/or overloaded getter methods if they are available (when searching on `obj`).
- Rebuilt jsdocs, changelog, readme.

### Changelog for 07/01/2015:
- Rebuilt jsdocs (they weren't rebuilt in last couple of commits).
- Updated ./README.md with details about recently added methods.
- Rebuilt sjl artifacts.
- Updated gulpfile to have a more robust 'watch' task.
- Added 'changelog' as a separate task in gulpfile.
- Added commenting to gulpfile (since the code there is growing).
- Updated gulpfile tasks dependencies for 'readme' task.

### Changelog for 07/16/2015:
- Updated jsdoc section in sjl-util-functions.js.
- Added filtering for 'for in' loops in sjl-util*.js.
- Simplified complex if checks in sjl-util*.js.
- Updated readme-fragment.md to reflect changes.
- Marked sjl.Iterator and sjl.iterator as deprecated.
- Rebuilt jsdocs.
- Rebuilt README.md.

### Changelog for 07/16/2015:
- Removed deprecation tag for sjl.Iterator.
- Added sjl.SjlSet (a more robust `Set` object for special cases). 
- Rebuilt jsdocs.
- Rebuilt README.md.

### Changelog for 08/16/2015:
- Added `sjl.package` method/function.
- Added `sjl.SjlMap`, `sjl.SjlSet` and their tests (several commits back).
- Added some scaffolding for 'sjl/mvc/router' and added scaffolding for 'sjl/navigation'.
- Rebuilt jsdocs.
- Rebuilt README.md.

### Changelog for 09/10/2015:
- Removed depracation warning for `sjl.getValueFromObj` default `raw` param being set to `true`.

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
 