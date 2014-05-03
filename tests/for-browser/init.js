require.config({

    deps: ['run'],

    shim: {
        'test-suite': {
            deps: ['sjl', 'mocha', 'chai', 'prepare']
        },
        mocha: {
            init: function () {
                this.mocha.setup('bdd');
                return this.mocha;
            }
        }
    },

    paths: {
        sjl: '../../sjl',
        chai:  '../../bower_components/chai/chai',
        mocha: '../../bower_components/mocha/mocha'
    }

});

