/**
 * Created by elyde on 11/19/2016.
 */
/**
 * Created by elydelacruz on 4/28/16.
 */

'use strict';

let util = require('util'),
    stream = require('stream'),
    Readable = stream.Readable,
    packageJson = require('../package');

function VersionNumberReadStream (options) {
    Readable.call(this, Object.assign({
        encoding: 'utf8',
        objectMode: false,
    }, options));
}

util.inherits(VersionNumberReadStream, Readable);

VersionNumberReadStream.prototype._read = function () {
`/**
 * Content generated by '{project-root}/node-scripts/VersionNumberReadStream.js'.
 * Generated ${new Date()} 
 */
(function () {

    'use strict';

    // Get sjl
    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../sjl.js') : window.sjl || {},
        version = '${packageJson.version}';

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

}());`
    .split('').forEach(this.push, this);
    this.push('\n');
    this.push(null);
};

module.exports = VersionNumberReadStream;
