/**
 * Created by Ely on 7/21/2014.
 * Initial idea copied from the Zend Framework 2's Between Validator
 */

'use strict';

(function () {

    function throwNotIntError (value, paramName, funcName, expectedType) {
        throw Error(funcName + ' expects ' + paramName +
            ' to be of type "' + expectedType + '".  Value received: ' + value);
    }

    var isNodeEnv = typeof window === 'undefined',
        sjl = isNodeEnv ? require('../sjl.js') : window.sjl || {},
        BaseValidator = sjl.package.validator.BaseValidator,
        InRangeValidator = function InRangeValidator (options) {

            // Set defaults and extend with Base validator
            BaseValidator.call(this, {
                min: 0,
                messageTemplates: {
                    NOT_IN_RANGE_EXCLUSIVE: function () {
                        return 'The input value is not exclusively between "' + this.getMin() + '" and "' + this.getMax() + '".';
                    },
                    NOT_IN_RANGE_INCLUSVE: function () {
                        return 'The input value is not inclusively between "' + this.getMin() + '" and "' + this.getMax() + '".';
                    },
                    INVALID_TYPE: function () {
                        return 'The value "' + this.getValue() + '" is expected to be of type "Number".';
                    }
                },
                inclusive: true,
                max: 9999
            });

            // Set options passed, if any
            this.setOptions(options);

        };

    InRangeValidator = BaseValidator.extend(InRangeValidator, {
        isValid: function (value) {
            var self = this,
                retVal = false;

            value = sjl.isset(value) ? value : self.getValue();

            if (!sjl.classOfIs(value, 'Number')) {
                self.addErrorByKey('INVALID_TYPE');
                return retVal;
            }

            if (self.getInclusive()) {
                retVal = value >= this.getMin() && value <= this.getMax();
                if (!retVal) {
                    self.addErrorByKey('NOT_IN_RANGE_INCLUSVE');
                }
            }
            else {
                retVal = value > this.getMin() && value < this.getMax();
                if (!retVal) {
                    self.addErrorByKey('NOT_IN_RANGE_EXCLUSIVE');
                }
            }
            return retVal;
        },

        getMin: function () {
            return this.getOption('min');
        },

        getMax: function () {
            return this.getOption('max');
        },

        getInclusive: function () {
            return this.getOption('inclusive');
        },

        setMin: function (min) {
            if (sjl.classOfIs(min, 'Number')) {
                return this.setOption('min', min);
            }
            throwNotIntError(min, 'min', 'InRangeValidator.setMin', 'Number');
        },

        setMax: function (max) {
            if (sjl.classOfIs(max, 'Number')) {
                return this.setOption('max', max);
            }
            throwNotIntError(max, 'max', 'InRangeValidator.setMax', 'Number');
        },

        setInclusive: function (value) {
            if (sjl.classOfIs(value, 'Boolean')) {
                return this.setOption('inclusive', value);
            }
            throwNotIntError(value, 'parameter 1', 'InRangeValidator.setInclusive', 'Boolean');
        }

    });

    if (isNodeEnv) {
        module.exports = InRangeValidator;
    }
    else {
        sjl.package('validator.InRangeValidator', InRangeValidator);
        if (window.__isAmd) {
            return InRangeValidator;
        }
    }

})();
