var count = (function isBigNumber(BigNumber) {
    var start = +new Date(),
        log,
        error,
        u,
        passed = 0,
        total = 0;

    if (typeof window === 'undefined') {
        log = console.log;
        error = console.error;
    } else {
        log = function (str) { document.body.innerHTML += str.replace('\n', '<br>') };
        error = function (str) { document.body.innerHTML += '<div style="color: red">' +
          str.replace('\n', '<br>') + '</div>' };
    }

    if (!BigNumber && typeof require === 'function') BigNumber = require('../bignumber');

    function assert(expected, actual) {
        total++;
        if (expected !== actual) {
           error('\n Test number: ' + total + ' failed');
           error(' Expected: ' + expected);
           error(' Actual:   ' + actual);
           //process.exit();
        } else {
            passed++;
            //log('\n Expected and actual: ' + actual);
        }
    }

    function T(expected, value){
        assert(expected, BigNumber.isBigNumber(value));
    }

    log('\n Testing isBigNumber...');

    T(false, u);
    T(false, void 0);
    T(false, null);
    T(false, '0');
    T(false, 0);
    T(false, 1);
    T(false, NaN);

    T(true, new BigNumber(0));
    T(true, new BigNumber('0'));
    T(true, new BigNumber(1));
    T(true, new BigNumber('1'));

    var AnotherBigNumber = BigNumber.another();
    T(true, new AnotherBigNumber(0));
    T(true, new AnotherBigNumber('0'));
    T(true, new AnotherBigNumber(1));
    T(true, new AnotherBigNumber('1'));

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;
