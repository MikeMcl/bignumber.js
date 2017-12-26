var count = (function shift(BigNumber) {
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

    function assertException(func, message) {
        var actual;
        total++;
        try {
            func();
        } catch (e) {
            actual = e;
        }
        if (actual && /^\[BigNumber Error\]/.test(actual.message)) {
            passed++;
            //log('\n Expected and actual: ' + actual);
        } else {
            error('\n Test number: ' + total + ' failed');
            error('\n Expected: ' + message + ' to raise a BigNumber Error.');
            error(' Actual:   ' + (actual || 'no exception'));
            //process.exit();
        }
    }

    function T(expected, n, k) {
        assert(String(expected), String(new BigNumber(n).shift(k)));
    }

     function isMinusZero(n) {
        return n.toString() === '0' && n.s == -1;
    }

    log('\n Testing shift...');

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: [-7, 21],
        RANGE: 1e9,
        POW_PRECISION: 0
    });

    T(0, 0, 0);
    T(10, 1, 1);
    T(0.1, 1, -1);
    T(200, 2, 2);
    T(2e+31, 2, 31);
    T(0.02, 2, -2);
    T(0.0002, 2, -4);
    T(1e+100, 1, 100);
    T(9999990, 9999.99, 3);

    T(NaN, NaN, 0);
    T(NaN, NaN, -1);
    T(NaN, NaN, 1);
    T(NaN, NaN, 2);
    T(NaN, NaN, -2);

    T(Infinity, Infinity, 0);
    T(-Infinity, -Infinity, -1);
    T(Infinity, Infinity, 1);
    T(-Infinity, -Infinity, 2);
    T(Infinity, Infinity, -2);

    T(0, 0, 1000);
    T(0, 0, 2);
    T(0, 0, -2);
    T(2, 2, 0);

    assert(false, isMinusZero(new BigNumber(0).shift(0)));
    assert(true, isMinusZero(new BigNumber(-0).shift(0)));
    assert(false, isMinusZero(new BigNumber(0).shift(-0)));
    assert(true, isMinusZero(new BigNumber(-0).shift(-0)));
    assert(false, isMinusZero(new BigNumber(0).shift(1000)));

    T('1e+1000000', 1, 1e6)
    T(1, '1e-1000000', 1e6)
    T('9.9e+999999999', 0.99, 1e+9);

    assertException(function () {new BigNumber('12.345').shift(true)}, ".shift(true)");
    assertException(function () {new BigNumber('12.345').shift(false)}, ".shift(false)");
    assertException(function () {new BigNumber('12.345').shift([])}, ".shift([])");
    assertException(function () {new BigNumber('12.345').shift({})}, ".shift({})");
    assertException(function () {new BigNumber('12.345').shift('')}, ".shift('')");
    assertException(function () {new BigNumber('12.345').shift(' ')}, ".shift(' ')");
    assertException(function () {new BigNumber('12.345').shift('4e')}, ".shift('4e')");
    assertException(function () {new BigNumber('12.345').shift('hello')}, ".shift('hello')");
    assertException(function () {new BigNumber('12.345').shift('\t')}, ".shift('\t')");
    assertException(function () {new BigNumber('12.345').shift(new Date)}, ".shift(new Date)");
    assertException(function () {new BigNumber('12.345').shift(new RegExp)}, ".shift(new RegExp)");
    assertException(function () {new BigNumber('12.345').shift(function (){})}, ".shift(function (){})");

    T('3.45345e+196', 0.000345345, 200);
    T('3.45345e-14', 0.000345345, -10);

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;
