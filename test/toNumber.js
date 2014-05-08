var count = (function toNumber(BigNumber) {
    var start = +new Date(),
        log,
        error,
        undefined,
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
        if (expected === actual || isNaN(expected) && isNaN(actual)) {
            passed++;
            //log('\n Expected and actual: ' + actual);
        } else {
           error('\n Test number: ' + total + ' failed');
           error(' Expected: ' + expected);
           error(' Actual:   ' + actual);
           //process.exit();
        }
    }

    function isMinusZero(n) {
        return 1 / n === -Infinity;
    }

    function T(value, n) {
        assert(n, new BigNumber(value).toNumber());
    }

    log('\n Testing toNumber...');

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        ERRORS: true,
        RANGE: 1E9,
        EXPONENTIAL_AT: 1E9
    });

    assert(false, isMinusZero(new BigNumber('0').toNumber()));
    assert(false, isMinusZero(new BigNumber('0.0').toNumber()));
    assert(false, isMinusZero(new BigNumber('0.000000000000').toNumber()));
    assert(false, isMinusZero(new BigNumber('0e+0').toNumber()));
    assert(false, isMinusZero(new BigNumber('0e-0').toNumber()));
    assert(false, isMinusZero(new BigNumber('1e-1000000000').toNumber()));

    assert(true, isMinusZero(new BigNumber('-0').toNumber()));
    assert(true, isMinusZero(new BigNumber('-0.0').toNumber()));
    assert(true, isMinusZero(new BigNumber('-0.000000000000').toNumber()));
    assert(true, isMinusZero(new BigNumber('-0e+0').toNumber()));
    assert(true, isMinusZero(new BigNumber('-0e-0').toNumber()));
    assert(true, isMinusZero(new BigNumber('-1e-1000000000').toNumber()));

    T(1, 1);
    T('1', 1);
    T('1.0', 1);
    T('1e+0', 1);
    T('1e-0', 1);
    T(12345.6789, 12345.6789);

    T(-1, -1);
    T('-1', -1);
    T('-1.0', -1);
    T('-1e+0', -1);
    T('-1e-0', -1);

    T(Infinity, 1 / 0);
    T('Infinity', 1 / 0);
    T(-Infinity, -1 / 0);
    T('-Infinity', -1 / 0);
    T(NaN, NaN);
    T('NaN', NaN);

    T('9.999999e+1000000000', 1 / 0);
    T('-9.999999e+1000000000', -1 / 0);
    T('1e-1000000000', 0);
    T('-1e-1000000000', -0);

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;
