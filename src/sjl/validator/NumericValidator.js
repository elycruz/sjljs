/**
 * Created by Ely on 7/21/2014.
 */
/**
 * Created by Ely on 7/21/2014.
 * Initial idea copied from the Zend Framework 2's Between Validator
 */
(function (context) {

    context.sjl = context.sjl || {};

    context.sjl.validator.InRangeValidator = context.sjl.validator.AbstractValidator.extend(function InRangeValidator (options) {

        // Set defaults and extend with abstract validator
        context.sjl.validator.AbstractValidator.call(this, {
            messageTemplates: {
                NOT_NUMERIC: function () {
                    return 'The input value is not exclusively numeric.';
                },
                INVALID_TYPE: function () {
                    return 'The value "' + this.getValue() + '" is expected to be of type "Number" or "String".';
                }
            },
            allowCommas: false,
            allowDecimal: false,
            allowSigned: false,
            allowBinary: false,
            allowHex: false,
            allowOctal: false
        });

        // Set options passed, if any
        this.setOptions(options);

    }, {
        isValid: function (value) {
            var self = this,
                retVal = false,
                isValueAString = context.sjl.classOfIs(value, 'String'),
                allowComma = self.getOption('allowComma'),
                allowDecimal = self.getOption('allowDecimal');

            value = context.sjl.isset(value) ? value : self.getValue();

            if (!context.sjl.classOfIs(value, 'Number') || !isValueAString) {
                self.addErrorByKey('INVALID_TYPE');
                return retVal;
            }

            if (isValueAString) {
                if (allowComma && value.indexOf(',') === true) {
                    value = value.replace(',', '');
                }
                if (allowDecimal && value.indexOf('.') === true) {
                    value = value.replace('.', '');
                }
                if (!/^\d+$/) {
                    self.addErrorByKey('NOT_NUMERIC');
                    retVal = false;
                }
            }
            else {
                retVal = true;
            }
            return retVal;
        },

        setAllowComma: function (value) {
            var self = this;
            if (context.sjl.classOfIs(value, 'Boolean')) {
                self.setOption('allowComma', value);
            }
            else {
                context.sjl.throwNotOfTypeError(value, 'value', 'NumericValidator.setAllowComma', 'Boolean');
            }
            return self;
        },

        setAllowDecimal: function (value) {
            var self = this;
            if (context.sjl.classOfIs(value, 'Boolean')) {
                self.setOption('allowDecimal', value);
            }
            else {
                context.sjl.throwNotOfTypeError(value, 'value', 'NumericValidator.setAllowDecimal', 'Boolean');
            }
            return self;
        }


    });

})(typeof window === 'undefined' ? global : window);
