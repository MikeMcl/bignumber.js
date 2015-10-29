var count = (function minMax(BigNumber) {
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

    if (!BigNumber && typeof require === 'function') BigNumber = require('../bignumber.js');

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

    function T(min, max, arr) {
        assert(true, new BigNumber(min).eq(BigNumber.min(arr)));
        assert(true, new BigNumber(max).eq(BigNumber.max(arr)));
    }

    log('\n Testing min and max...');

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: [-7, 21],
        RANGE: 1e9,
        ERRORS: false
    });

    assert(false, BigNumber.min(0, 0, 0).isNaN());
    assert(true, BigNumber.min(u, null, NaN).isNaN());
    assert(true, BigNumber.min(-2, 0, -1, u).isNaN());
    assert(true, BigNumber.max(-2, 0, -1, u).isNaN());
    assert(true, BigNumber.min(null, -2, 0, -1).isNaN());
    assert(true, BigNumber.max(null, -2, 0, -1).isNaN());
    assert(true, BigNumber.min(NaN, -2, 0, -1).isNaN());
    assert(true, BigNumber.max(NaN, -2, 0, -1).isNaN());
    assert(true, BigNumber.min(-2, 0, -1, new BigNumber(NaN)).isNaN());
    assert(true, BigNumber.max(-2, 0, -1, new BigNumber(NaN)).isNaN());

    assert(false, BigNumber.min(-2, 0, -1).isNaN());
    assert(false, BigNumber.max(-2, 0, -1).isNaN());
    assert(false, BigNumber.min(-2, 0, -1, Infinity).isNaN());
    assert(false, BigNumber.max(-2, 0, -1, -Infinity).isNaN());
    assert(false, BigNumber.min(-2, 0, -1, Infinity).isNaN());
    assert(false, BigNumber.max(-2, 0, -1, Infinity).isNaN());
    assert(false, BigNumber.min(-2, -Infinity, 0, -1, Infinity).isNaN());
    assert(true, BigNumber.max(Infinity, -2, 'hi', 0, -1, -Infinity).isNaN());
    assert(true, BigNumber.min(null, Infinity, -2, 0, -1, -Infinity).isNaN());
    assert(true, BigNumber.max(Infinity, -2, NaN, 0, -1, -Infinity, u).isNaN());

    assert(true, new BigNumber(-Infinity).eq(BigNumber.min(-Infinity, -2, 0, -1, Infinity)));
    assert(true, new BigNumber(-Infinity).eq(BigNumber.min(Infinity, -2, 0, -1, -Infinity)));
    assert(true, new BigNumber(Infinity).eq(BigNumber.max(Infinity, -2, 0, -1, -Infinity)));
    assert(true, new BigNumber(Infinity).eq(BigNumber.max(-Infinity, -2, 0, new BigNumber(Infinity), -1)));

    assert(true, new BigNumber(-2).eq(BigNumber.min(-2, 0, -1)));
    assert(true, new BigNumber(0).eq(BigNumber.max(-2, 0, -1)));
    assert(true, new BigNumber(-2).eq(BigNumber.min(-2, -1, 0)));
    assert(true, new BigNumber(0).eq(BigNumber.max(-2, -1, 0)));
    assert(true, new BigNumber(-2).eq(BigNumber.min(0, -2, -1)));
    assert(true, new BigNumber(0).eq(BigNumber.max(0, -2, -1)));
    assert(true, new BigNumber(-2).eq(BigNumber.min(0, -1, -2)));
    assert(true, new BigNumber(0).eq(BigNumber.max(0, -1, -2)));
    assert(true, new BigNumber(-2).eq(BigNumber.min(-1, -2, 0)));
    assert(true, new BigNumber(0).eq(BigNumber.max(-1, -2, 0)));
    assert(true, new BigNumber(-2).eq(BigNumber.min(-1, 0, -2)));

    assert(true, new BigNumber(-1).eq(BigNumber.min(-1, 0, 1)));
    assert(true, new BigNumber(1).eq(BigNumber.max(-1, 0, 1)));
    assert(true, new BigNumber(-1).eq(BigNumber.min(-1, 1, 0)));
    assert(true, new BigNumber(1).eq(BigNumber.max(-1, 1, 0)));
    assert(true, new BigNumber(-1).eq(BigNumber.min(0, -1, 1)));
    assert(true, new BigNumber(1).eq(BigNumber.max(0, -1, 1)));
    assert(true, new BigNumber(-1).eq(BigNumber.min(0, 1, -1)));
    assert(true, new BigNumber(1).eq(BigNumber.max(0, 1, -1)));
    assert(true, new BigNumber(-1).eq(BigNumber.min(1, -1, 0)));
    assert(true, new BigNumber(1).eq(BigNumber.max(1, -1, 0)));
    assert(true, new BigNumber(-1).eq(BigNumber.min(1, 0, -1)));

    assert(true, new BigNumber(-1).eq(BigNumber.min('-1', 0, new BigNumber(1))));
    assert(true, new BigNumber(1).eq(BigNumber.max('-1', 0, new BigNumber(1))));
    assert(true, new BigNumber(-1).eq(BigNumber.min('-1', new BigNumber(1), 0)));
    assert(true, new BigNumber(1).eq(BigNumber.max('-1', new BigNumber(1), 0)));
    assert(true, new BigNumber(-1).eq(BigNumber.min(0, '-1', new BigNumber(1))));
    assert(true, new BigNumber(1).eq(BigNumber.max(0, '-1', new BigNumber(1))));
    assert(true, new BigNumber(-1).eq(BigNumber.min(0, new BigNumber(1), '-1')));
    assert(true, new BigNumber(1).eq(BigNumber.max(0, new BigNumber(1), '-1')));
    assert(true, new BigNumber(-1).eq(BigNumber.min(new BigNumber(1), '-1', 0)));
    assert(true, new BigNumber(1).eq(BigNumber.max(new BigNumber(1), '-1', 0)));
    assert(true, new BigNumber(-1).eq(BigNumber.min(new BigNumber(1), 0, '-1')));

    assert(true, new BigNumber(0).eq(BigNumber.min(0, 1, 2)));
    assert(true, new BigNumber(2).eq(BigNumber.max(0, 1, 2)));
    assert(true, new BigNumber(0).eq(BigNumber.min(0, 2, 1)));
    assert(true, new BigNumber(2).eq(BigNumber.max(0, 2, 1)));
    assert(true, new BigNumber(0).eq(BigNumber.min(1, 0, 2)));
    assert(true, new BigNumber(2).eq(BigNumber.max(1, 0, 2)));
    assert(true, new BigNumber(0).eq(BigNumber.min(1, 2, 0)));
    assert(true, new BigNumber(2).eq(BigNumber.max(1, 2, 0)));
    assert(true, new BigNumber(0).eq(BigNumber.min(2, 1, 0)));
    assert(true, new BigNumber(2).eq(BigNumber.max(2, 1, 0)));
    assert(true, new BigNumber(0).eq(BigNumber.min(2, 0, 1)));
    assert(true, new BigNumber(2).eq(BigNumber.max(2, 0, 1)));

    T(-2, 0, [-2, -1, 0]);
    T(-2, 0, [-2, 0, -1]);
    T(-2, 0, [-1, -2, 0]);
    T(-2, 0, [-1, 0, -2]);
    T(-2, 0, [0, -2, -1]);
    T(-2, 0, [0, -1, -2]);

    T(-1, 1, [-1, 0, 1]);
    T(-1, 1, [-1, 1, 0]);
    T(-1, 1, [0, -1, 1]);
    T(-1, 1, [0, 1, -1]);
    T(-1, 1, [1, -1, 0]);
    T(-1, 1, [1, 0, -1]);

    T(0, 2, [0, 1, 2]);
    T(0, 2, [0, 2, 1]);
    T(0, 2, [1, 0, 2]);
    T(0, 2, [1, 2, 0]);
    T(0, 2, [2, 1, 0]);
    T(0, 2, [2, 0, 1]);

    T(-0.000001, 999.001, [2, -0, '1e-9000000000000000', 324.32423423, -0.000001, '999.001', 10]);
    T('-9.99999e+9000000000000000', Infinity, [10, '-9.99999e+9000000000000000', new BigNumber(Infinity), '9.99999e+9000000000000000', 0]);
    T('-9.999999e+9000000000000000', '1.01e+9000000000000000', ['-9.99998e+9000000000000000', '-9.999999e+9000000000000000', '9e+8999999999999999', '1.01e+9000000000000000', 1e+300]);
    T(1, Infinity, [1, '1e+9000000000000001', 1e200]);
    T(-Infinity, 1, [1, '-1e+9000000000000001', -1e200]);
    T(0, 1, [1, '1e-9000000000000001', 1e-200]);
    T(0, 1, [1, '-1e-9000000000000001', 1e-200]);
    T(-3, 3, [1, '2', 3, '-1', -2, '-3']);

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;
