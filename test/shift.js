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
        if (actual && actual.name == 'BigNumber Error') {
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
        ERRORS: false,
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

    T(2, 2, NaN);
    T(2435.43543, 2435.43543, NaN);
    T(Infinity, Infinity, NaN);
    T(-Infinity, -Infinity, NaN);
    T(NaN, NaN, NaN);

    T(NaN, NaN, 0);
    T(NaN, NaN, -1);
    T(NaN, NaN, 1);
    T(NaN, NaN, 2.2);
    T(NaN, NaN, -2.2);
    T(NaN, NaN, Infinity);
    T(NaN, NaN, -Infinity);

    T(Infinity, Infinity, 0);
    T(-Infinity, -Infinity, -1);
    T(Infinity, Infinity, 1);
    T(-Infinity, -Infinity, 2.2);
    T(Infinity, Infinity, -2.2);
    T(Infinity, Infinity, Infinity);
    T(-Infinity, -Infinity, -Infinity);
    T(-Infinity, -Infinity, Infinity);
    T(Infinity, Infinity, -Infinity);
    T(Infinity, 1, Infinity);
    T(-Infinity, -1, Infinity);
    T(Infinity, 0.1, Infinity);
    T(-Infinity, -0.1, Infinity);
    T(Infinity, 1.1, Infinity);
    T(-Infinity, -1.1, Infinity);
    T(Infinity, 2, Infinity);
    T(-Infinity, -2, Infinity);
    T(Infinity, 2e-45, Infinity);
    T(-Infinity, -1e+300, Infinity);
    T(Infinity, 0.999, Infinity);

    T(0, 0, 1000);
    T(0, 0, NaN);
    T(-0, -0, NaN);
    T(0, 0, Infinity);
    T(0, 0, -Infinity);
    T(0, 1, -Infinity);
    T(0, 2e-45, -Infinity);
    T(0, 0.1, -Infinity);
    T(0, 2, -Infinity);
    T(0, 0, 2);
    T(0, 0, -2);

    assert(false, isMinusZero(new BigNumber(0).shift(Infinity)));
    assert(false, isMinusZero(new BigNumber(0).shift(-Infinity)));
    assert(true, isMinusZero(new BigNumber(-0).shift(Infinity)));
    assert(true, isMinusZero(new BigNumber(-0).shift(-Infinity)));
    assert(true, isMinusZero(new BigNumber(-0.1).shift(-Infinity)));
    assert(true, isMinusZero(new BigNumber(-1).shift(-Infinity)));
    assert(true, isMinusZero(new BigNumber(-2).shift(-Infinity)));
    assert(true, isMinusZero(new BigNumber(-1e+300).shift(-Infinity)));
    assert(false, isMinusZero(new BigNumber(0).shift(0)));
    assert(true, isMinusZero(new BigNumber(-0).shift(0)));
    assert(false, isMinusZero(new BigNumber(0).shift(-0)));
    assert(true, isMinusZero(new BigNumber(-0).shift(-0)));
    assert(false, isMinusZero(new BigNumber(0).shift(1000)));
    assert(false, isMinusZero(new BigNumber(0).shift(NaN)));
    assert(true, isMinusZero(new BigNumber(-0).shift(NaN)));
    assert(false, isMinusZero(new BigNumber(2e-45).shift(-Infinity)));
    assert(true, isMinusZero(new BigNumber(-2e-45).shift(-Infinity)));

    T(2, 2, 0);
    T(2, 2, null);
    T(2, 2, undefined);
    T(2, 2, NaN);
    T(2, 2, 'erger');
    T(2, 2, {});
    T(2, 2, []);

    T('1e+1000000', 1, 1e6)
    T(1, '1e-1000000', 1e6)
    T('9.82736534568327e+21', '9827365.34568327', '   1.5e+1 ');
    T('0.0898086057643523405623480756380247658237465999999', '0.000000000898086057643523405623480756380247658237465999999', '   87365e-4 ');
    T('2.34543534545e-2394335', '2.34543534545e-2394323', '   -12 ');
    T(Infinity, 0.000345345, 1e200);
    T(0, 0.000345345, -1e200);
    T(0.000345345, 0.000345345, -1e-2);
    T(0.99, 0.99, 1e-9);
    T('9.9e+999999999', 0.99, 1e+9);

    BigNumber.config({ ERRORS: true });

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
    T('3.45345e-14', 0.000345345, '   -1e1');

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;
