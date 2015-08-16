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
