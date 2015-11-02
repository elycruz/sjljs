/**
 * Created by Ely on 7/21/2014.
 */

'use strict';

(function (context) {

    context.sjl.EmailValidator = context.sjl.RegexValidator.extend(
        function EmailValidator(options) {

            // Set defaults and extend with abstract validator
            context.sjl.RegexValidator.call(this, {
                /**
                 * Pulled Directly from the php 5.5 source
                 * ------------------------------------------------------------------------
                 * The regex below is based on a regex by Michael Rushton.
                 * However, it is not identical.  I changed it to only consider routeable
                 * addresses as valid.  Michael's regex considers a@b a valid address
                 * which conflicts with section 2.3.5 of RFC 5321 which states that:
                 *
                 *   Only resolvable, fully-qualified domain names (FQDNs) are permitted
                 *   when domain names are used in SMTP.  In other words, names that can
                 *   be resolved to MX RRs or address (i.e., A or AAAA) RRs (as discussed
                 *   in Section 5) are permitted, as are CNAME RRs whose targets can be
                 *   resolved, in turn, to MX or address RRs.  Local nicknames or
                 *   unqualified names MUST NOT be used.
                 *
                 * This regex does not handle comments and folding whitespace.  While
                 * this is technically valid in an email address, these parts aren't
                 * actually part of the address itself.
                 *
                 * Michael's regex carries this copyright:
                 *
                 * Copyright © Michael Rushton 2009-10
                 * http://squiloople.com/
                 * Feel free to use and redistribute this code. But please keep this copyright notice.
                 * -----------------------------------------------------------------------
                 * This regex is the javascript version of the aforementioned pulled from
                 * Michael Ruston's website
                 */
                pattern: /^(?!("?(\\[ -~]|[^"])"?){255,})(?!("?(\\[ -~]|[^"])"?){65,}@)([!#-'*+\/-9=?^-~-]+|"(([\x01-\x08\x0B\x0C\x0E-!#-\[\]-\x7F]|\\[\x00-\xFF]))*")(\.([!#-'*+\/-9=?^-~-]+|"(([\x01-\x08\x0B\x0C\x0E-!#-\[\]-\x7F]|\\[\x00-\xFF]))*"))*@((?![a-z0-9-]{64,})([a-z0-9]([a-z0-9-]*[a-z0-9])?)(\.(?![a-z0-9-]{64,})([a-z0-9]([a-z0-9-]*[a-z0-9])?)){0,126}|\[((IPv6:(([a-f0-9]{1,4})(:[a-f0-9]{1,4}){7}|(?!(.*[a-f0-9][:\]]){8,})([a-f0-9]{1,4}(:[a-f0-9]{1,4}){0,6})?::([a-f0-9]{1,4}(:[a-f0-9]{1,4}){0,6})?))|((IPv6:([a-f0-9]{1,4}(:[a-f0-9]{1,4}){5}:|(?!(.*[a-f0-9]:){6,})([a-f0-9]{1,4}(:[a-f0-9]{1,4}){0,4})?::(([a-f0-9]{1,4}(:[a-f0-9]{1,4}){0,4}):)?))?(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}))\])$/i,
                messageTemplates: {
                    INVALID_EMAIL: function () {
                        return 'The email "' + this.getValue() + '" is not a valid email address.';
                    }
                }
            });

            // Set options passed, if any
            this.setOptions(options);

        }, {

            isValid: function (value) {
                var self = this,
                    retVal = false;

                // Clear any existing messages
                self.clearMessages();

                // Set and get or get value (gets the set value if value is undefined
                value = self.getValue(value);

                // Run the test
                retVal = self.getPattern().test(value);

                // If test failed
                if (retVal === false) {
                    self.addErrorByKey('INVALID_EMAIL');
                }

                return retVal;
            }

        });

})(typeof window === 'undefined' ? global : window);
