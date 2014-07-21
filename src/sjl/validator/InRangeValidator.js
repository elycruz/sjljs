/**
 * Created by Ely on 7/21/2014.
 * Initial idea copied from the Zend Framework 2's Between Validator
 */
(function (context) {

    function throwNotIntError (value, paramName, funcName, expectedType) {
        throw Error(funcName + ' expects ' + paramName +
            ' to be of type "' + expectedType + '".  Value received: ' + value);
    }

    context.sjl = context.sjl || {};

    context.sjl.InRangeValidator = context.sjl.AbstractValidator.extend(function InRangeValidator (options) {

        // Set defaults and extend with abstract validator
        context.sjl.AbstractValidator.call(this, {
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

    }, {
        isValid: function (value) {
            var self = this,
                retVal = false;
            value = value || self.getValue();
            if (self.getInclusive()) {
                retVal = value >= this.getMin() && value <= this.getMax();
            }
            else {
                retVal = value > this.getMin() && value < this.getMax();
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
            if (context.sjl.classOfIs(min, 'Number')) {
                return this.setOption('min', min);
            }
            throwNotIntError(min, 'min', 'InRangeValidator.setMin', 'Number');
        },

        setMax: function (max) {
            if (context.sjl.classOfIs(max, 'Number')) {
                return this.setOption('max', max);
            }
            throwNotIntError(max, 'max', 'InRangeValidator.setMax', 'Number');
        },

        setInclusive: function (value) {
            if (context.sjl.classOfIs(value, 'Boolean')) {
                return this.setOption('inclusive', value);
            }
            throwNotIntError(value, 'parameter 1', 'InRangeValidator.setInclusive', 'Boolean');
        }

    });

})(typeof window === 'undefined' ? global : window);
