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
