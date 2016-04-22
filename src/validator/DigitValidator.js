/**
 * Created by Ely on 1/21/2015.
 */

(function () {

    'use strict';

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('./../../src/sjl') : window.sjl || {},
        RegexValidator = sjl.ns.validator.RegexValidator,
        contextName = 'sjl.ns.validator.DigitValidator',
        DigitValidator = function DigitValidator (/**...options {Object}**/) {
            RegexValidator.apply(this, [{
                pattern: /^\d+$/,
                messageTemplates: {
                    DOES_NOT_MATCH_PATTERN: function () {
                        return 'The value passed in contains non digital characters.  ' +
                            'Value received: "' + this.value + '".';
                    }
                }
            }].concat(sjl.argsToArray(arguments)));
        };

    DigitValidator = RegexValidator.extend(DigitValidator);

    if (isNodeEnv) {
        module.exports = DigitValidator;
    }
    else {
        sjl.ns('validator.DigitValidator', DigitValidator);
        if (window.__isAmd) {
            return DigitValidator;
        }
    }

})();
