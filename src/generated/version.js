/**
 * Content generated by '{project-root}/node-scripts/VersionNumberReadStream.js'.
 * Generated Sat Nov 19 2016 15:48:03 GMT-0500 (Eastern Standard Time) 
 */
(function () {

    'use strict';

    // Get sjl
    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl || {},
        version = '6.3.0';

    if (isNodeEnv) {
        module.exports = version;
    }
    else {
        // Export version number
        sjl.ns('version', version);

        // Export it higher one level
        sjl.defineEnumProp(sjl, 'version', version);

        // If amd, return the version number
        if (sjl.isAmd) {
            return version;
        }
    }

}());
