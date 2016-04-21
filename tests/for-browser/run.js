/**
 * Created by Ely on 5/3/2014.
 */
define(['mocha', 'sjl', 'prepare', 'test-suite'], function (mocha) {
    mocha.checkLeaks();
    mocha.globals(['sjl']);
    mocha.run();
});
