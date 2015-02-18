var count = (function others(BigNumber) {
    var start = +new Date(),
        log,
        error,
        n,
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
        }
        else {
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

    log('\n Testing others...');

    /*
     * isFinite
     * isInteger
     * isNaN
     * isNegative
     * isZero
     * equals
     * greaterThan
     * greaterThanOrEqualTo
     * lessThan
     * lessThanOrEqualTo
     * valueOf
     */

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: 1e+9,
        RANGE: 1e+9,
        ERRORS: true
    });

    n = new BigNumber(1);
    assert(true, n.isFinite());
    assert(true, n.isInteger());
    assert(false, n.isNaN());
    assert(false, n.isNegative());
    assert(false, n.isZero());
    assert(true, n.equals(n));
    assert(true, n.equals(n, 2));
    assert(true, n.equals(1, 3));
    assert(true, n.equals(n, 4));
    assert(true, n.equals(1, 5));
    assert(true, n.equals(n, 6));
    assert(true, n.equals(1, 7));
    assert(true, n.equals(n, 8));
    assert(true, n.equals(1, 9));
    assert(true, n.equals(n, 10));
    assert(true, n.equals(n, 11));
    assert(true, n.equals(1, 12));
    assert(true, n.equals(n, 13));
    assert(true, n.equals(1, 14));
    assert(true, n.equals(n, 15));
    assert(true, n.equals(1, 16));
    assert(true, n.equals(n, 17));
    assert(true, n.equals(1, 18));
    assert(true, n.equals(n, 19));
    assert(true, n.equals('1.0', 20));
    assert(true, n.equals('1.00', 21));
    assert(true, n.equals('1.000', 22));
    assert(true, n.equals('1.0000', 23));
    assert(true, n.equals('1.00000', 24));
    assert(true, n.equals('1.000000', 25));
    assert(true, n.equals(new BigNumber(1, 10), 26));
    assert(true, n.equals(new BigNumber(1), 27));
    assert(true, n.equals(1, 28));
    assert(true, n.equals(1, 29));
    assert(true, n.equals(1, 30));
    assert(true, n.equals(1, 31));
    assert(true, n.equals(1, 32));
    assert(true, n.equals(1, 33));
    assert(true, n.equals(1, 34));
    assert(true, n.equals(1, 35));
    assert(true, n.equals(1, 36));
    assert(true, n.greaterThan(0.99999));
    assert(false, n.greaterThanOrEqualTo(1.1));
    assert(true, n.lessThan(1.001));
    assert(true, n.lessThanOrEqualTo(2));
    assert(n.toString(), n.valueOf());

     n = new BigNumber('-0.1');
    assert(true, n.isFinite());
    assert(false, n.isInt());
    assert(false, n.isNaN());
    assert(true, n.isNeg());
    assert(false, n.isZero());
    assert(false, n.equals(0.1));
    assert(false, n.greaterThan(-0.1));
    assert(true, n.greaterThanOrEqualTo(-1));
    assert(true, n.lessThan(-0.01));
    assert(false, n.lessThanOrEqualTo(-1));
    assert(n.toString(), n.valueOf());

    n = new BigNumber(Infinity);
    assert(false, n.isFinite());
    assert(false, n.isInteger());
    assert(false, n.isNaN());
    assert(false, n.isNegative());
    assert(false, n.isZero());
    assert(true, n.eq('Infinity'));
    assert(true, n.eq(1/0));
    assert(true, n.gt('9e999'));
    assert(true, n.gte(Infinity));
    assert(false, n.lt(Infinity));
    assert(true, n.lte(Infinity));
    assert(n.toString(), n.valueOf());

    n = new BigNumber('-Infinity');
    assert(false, n.isFinite());
    assert(false, n.isInt());
    assert(false, n.isNaN());
    assert(true, n.isNeg());
    assert(false, n.isZero());
    assert(false, n.equals(Infinity));
    assert(true, n.equals(-1/0));
    assert(false, n.greaterThan(-Infinity));
    assert(true, n.greaterThanOrEqualTo('-Infinity', 8));
    assert(true, n.lessThan(0));
    assert(true, n.lessThanOrEqualTo(Infinity));
    assert(n.toString(), n.valueOf());

    n = new BigNumber('0.0000000');
    assert(true, n.isFinite());
    assert(true, n.isInteger());
    assert(false, n.isNaN());
    assert(false, n.isNegative());
    assert(true, n.isZero());
    assert(true, n.eq(-0));
    assert(true, n.gt(-0.000001));        // 81
    assert(false, n.gte(0.1));
    assert(true, n.lt(0.0001));
    assert(true, n.lte(-0));
    assert(n.toString(), n.valueOf());

    n = new BigNumber(-0);
    assert(true, n.isFinite());
    assert(true, n.isInt());
    assert(false, n.isNaN());
    assert(true, n.isNeg());
    assert(true, n.isZero());
    assert(true, n.equals('0.000'));
    assert(true, n.greaterThan(-1));
    assert(false, n.greaterThanOrEqualTo(0.1));
    assert(false, n.lessThan(0));
    assert(false, n.lessThan(0, 36));
    assert(true, n.lessThan(0.1));
    assert(true, n.lessThanOrEqualTo(0));
    assert(n.toString(), n.valueOf());

    n = new BigNumber('NaN');
    assert(false, n.isFinite());
    assert(false, n.isInteger());
    assert(true, n.isNaN());
    assert(false, n.isNegative());
    assert(false, n.isZero());
    assert(false, n.eq(NaN));
    assert(false, n.eq(Infinity));
    assert(false, n.gt(0));
    assert(false, n.gte(0));              // 103
    assert(false, n.lt(1));
    assert(false, n.lte(-0));
    assert(false, n.lte(-1));
    assert(n.toString(), n.valueOf());

    BigNumber.config({ ERRORS: false });

    n = new BigNumber('hiya');
    assert(false, n.isFinite());
    assert(false, n.isInteger());
    assert(true, n.isNaN());
    assert(false, n.isNegative());
    assert(false, n.isZero());
    assert(false, n.equals(0));
    assert(false, n.greaterThan(0));
    assert(false, n.greaterThanOrEqualTo(-Infinity));
    assert(false, n.lessThan(Infinity));
    assert(false, n.lessThanOrEqualTo(0));
    assert(n.toString(), n.valueOf());

    BigNumber.config({ ERRORS: true });

    n = new BigNumber('-1.234e+2');
    assert(true, n.isFinite());
    assert(false, n.isInt());
    assert(false, n.isNaN());
    assert(true, n.isNeg());
    assert(false, n.isZero());
    assert(true, n.eq(-123.4, 10));
    assert(true, n.gt('-ff', 16));
    assert(true, n.gte('-1.234e+3'));
    assert(true, n.lt(-123.39999));
    assert(true, n.lte('-123.4e+0'));
    assert(n.toString(), n.valueOf());

    n = new BigNumber('5e-200');
    assert(true, n.isFinite());
    assert(false, n.isInteger());
    assert(false, n.isNaN());
    assert(false, n.isNegative());
    assert(false, n.isZero());
    assert(true, n.equals(5e-200));
    assert(true, n.greaterThan(5e-201));
    assert(false, n.greaterThanOrEqualTo(1));
    assert(true, n.lessThan(6e-200));
    assert(true, n.lessThanOrEqualTo(5.1e-200));
    assert(n.toString(), n.valueOf());

    n = new BigNumber('1');
    assert(true, n.equals(n));
    assert(true, n.equals(n.toString()));
    assert(true, n.equals(n.toString()));
    assert(true, n.equals(n.valueOf()));
    assert(true, n.equals(n.toFixed()));
    assert(true, n.equals(1));
    assert(true, n.equals('1e+0'));
    assert(false, n.equals(-1));
    assert(false, n.equals(0.1));

    BigNumber.config({ ERRORS: false });

    assert(false, new BigNumber(NaN).equals(0));
    assert(false, new BigNumber(null).equals(0));
    assert(false, new BigNumber(undefined).equals(0));
    assert(false, new BigNumber(Infinity).equals(0));
    assert(false, new BigNumber([]).equals(0));
    assert(false, new BigNumber([]).equals(0));
    assert(false, new BigNumber({}).equals(0));
    assert(false, new BigNumber('').equals(0));
    assert(false, new BigNumber('   ').equals(0));
    assert(false, new BigNumber('\t').equals(0));
    assert(false, new BigNumber('gerg').equals(0));
    assert(false, new BigNumber(new Date).equals(0));
    assert(false, new BigNumber(new RegExp).equals(0));
    assert(false, new BigNumber(0.1).equals(0));
    assert(false, new BigNumber(1e9 + 1).equals(1e9));
    assert(false, new BigNumber(1e9 - 1).equals(1e9));
    assert(true, new BigNumber(1e9 + 1).equals(1e9 + 1));
    assert(true, new BigNumber(1).equals(1));
    assert(false, new BigNumber(1).equals(-1));
    assert(false, new BigNumber(NaN).equals('efffe'));

    assert(false, new BigNumber('b').greaterThan('a'));
    assert(false, new BigNumber('a').lessThan('b', 10));
    assert(true, new BigNumber('a', 16).lessThanOrEqualTo('ff', 16));
    assert(true, new BigNumber('b', 16).greaterThanOrEqualTo(9, 16));

    BigNumber.config({ ERRORS: true });

    assert(true, new BigNumber(10).greaterThan(10, 2));
    assert(true, new BigNumber(10).greaterThan(10, 3));
    assert(true, new BigNumber(10).greaterThan(10, 4));
    assert(true, new BigNumber(10).greaterThan(10, 5));
    assert(true, new BigNumber(10).greaterThan(10, 6));
    assert(true, new BigNumber(10).greaterThan(10, 7));
    assert(true, new BigNumber(10).greaterThan(10, 8));
    assert(true, new BigNumber(10).greaterThan(10, 9));
    assert(false, new BigNumber(10).greaterThan(10, 10));
    assert(false, new BigNumber(10).greaterThan(10, 11));
    assert(false, new BigNumber(10).greaterThan(10, 12));
    assert(false, new BigNumber(10).greaterThan(10, 13));
    assert(true, new BigNumber(10).lessThan(10, 11));
    assert(true, new BigNumber(10).lessThan(10, 12));
    assert(true, new BigNumber(10).lessThan(10, 13));
    assert(true, new BigNumber(10).lessThan(10, 14));
    assert(true, new BigNumber(10).lessThan(10, 15));
    assert(true, new BigNumber(10).lessThan(10, 16));
    assert(true, new BigNumber(10).lessThan(10, 17));
    assert(true, new BigNumber(10).lessThan(10, 18));
    assert(true, new BigNumber(10).lessThan(10, 19));
    assert(true, new BigNumber(10).lessThan(10, 20));
    assert(true, new BigNumber(10).lessThan(10, 21));
    assert(true, new BigNumber(10).lessThan(10, 22));
    assert(true, new BigNumber(10).lessThan(10, 34));
    assert(true, new BigNumber(10).lessThan(10, 35));
    assert(true, new BigNumber(10).lessThan(10, 36));
    assert(false, new BigNumber(NaN).lessThan(NaN));
    assert(false, new BigNumber(Infinity).lessThan(-Infinity));
    assert(false, new BigNumber(Infinity).lessThan(Infinity));
    assert(true, new BigNumber(Infinity, 10).lessThanOrEqualTo(Infinity, 2));
    assert(false, new BigNumber(NaN).greaterThanOrEqualTo(NaN));
    assert(true, new BigNumber(Infinity).greaterThanOrEqualTo(Infinity));
    assert(true, new BigNumber(Infinity).greaterThanOrEqualTo(-Infinity));
    assert(false, new BigNumber(NaN).greaterThanOrEqualTo(-Infinity));
    assert(true, new BigNumber(-Infinity).greaterThanOrEqualTo(-Infinity));

    assert(false, new BigNumber(2, 10).greaterThan(10, 2));
    assert(false, new BigNumber(10, 2).lessThan(2, 10));
    assert(true, new BigNumber(255).lessThanOrEqualTo('ff', 16));
    assert(true, new BigNumber('a', 16).greaterThanOrEqualTo(9, 16));
    assert(false, new BigNumber(0).lessThanOrEqualTo('NaN'));
    assert(false, new BigNumber(0).greaterThanOrEqualTo(NaN));
    assert(false, new BigNumber(NaN, 2).lessThanOrEqualTo('NaN', 36));
    assert(false, new BigNumber(NaN, 36).greaterThanOrEqualTo(NaN, 2));
    assert(false, new BigNumber(0).lessThanOrEqualTo(-Infinity));
    assert(true, new BigNumber(0).greaterThanOrEqualTo(-Infinity));
    assert(true, new BigNumber(0).lessThanOrEqualTo('Infinity', 36));
    assert(false, new BigNumber(0).greaterThanOrEqualTo('Infinity', 36));
    assert(false, new BigNumber(10).lessThanOrEqualTo(20, 4));
    assert(true, new BigNumber(10).lessThanOrEqualTo(20, 5));
    assert(false, new BigNumber(10).greaterThanOrEqualTo(20, 6));

    assert(false, new BigNumber(1.23001e-2).lessThan(1.23e-2));
    assert(true, new BigNumber(1.23e-2).lt(1.23001e-2));
    assert(false, new BigNumber(1e-2).lessThan(9.999999e-3));
    assert(true, new BigNumber(9.999999e-3).lt(1e-2));

    assert(false, new BigNumber(1.23001e+2).lessThan(1.23e+2));
    assert(true, new BigNumber(1.23e+2).lt(1.23001e+2));
    assert(true, new BigNumber(9.999999e+2).lessThan(1e+3));
    assert(false, new BigNumber(1e+3).lt(9.9999999e+2));

    assert(false, new BigNumber(1.23001e-2).lessThanOrEqualTo(1.23e-2));
    assert(true, new BigNumber(1.23e-2).lte(1.23001e-2));
    assert(false, new BigNumber(1e-2).lessThanOrEqualTo(9.999999e-3));
    assert(true, new BigNumber(9.999999e-3).lte(1e-2));

    assert(false, new BigNumber(1.23001e+2).lessThanOrEqualTo(1.23e+2));
    assert(true, new BigNumber(1.23e+2).lte(1.23001e+2));
    assert(true, new BigNumber(9.999999e+2).lessThanOrEqualTo(1e+3));
    assert(false, new BigNumber(1e+3).lte(9.9999999e+2));

    assert(true, new BigNumber(1.23001e-2).greaterThan(1.23e-2));
    assert(false, new BigNumber(1.23e-2).gt(1.23001e-2));
    assert(true, new BigNumber(1e-2).greaterThan(9.999999e-3));
    assert(false, new BigNumber(9.999999e-3).gt(1e-2));

    assert(true, new BigNumber(1.23001e+2).greaterThan(1.23e+2));
    assert(false, new BigNumber(1.23e+2).gt(1.23001e+2));
    assert(false, new BigNumber(9.999999e+2).greaterThan(1e+3));
    assert(true, new BigNumber(1e+3).gt(9.9999999e+2));

    assert(true, new BigNumber(1.23001e-2).greaterThanOrEqualTo(1.23e-2));
    assert(false, new BigNumber(1.23e-2).gte(1.23001e-2));
    assert(true, new BigNumber(1e-2).greaterThanOrEqualTo(9.999999e-3));
    assert(false, new BigNumber(9.999999e-3).gte(1e-2));

    assert(true, new BigNumber(1.23001e+2).greaterThanOrEqualTo(1.23e+2));
    assert(false, new BigNumber(1.23e+2).gte(1.23001e+2));
    assert(false, new BigNumber(9.999999e+2).greaterThanOrEqualTo(1e+3));
    assert(true, new BigNumber(1e+3).gte(9.9999999e+2));

    assertException(function () {new BigNumber(1).lt(null)}, "new BigNumber(1).lt(null)");
    assertException(function () {new BigNumber(1).gt('one')}, "new BigNumber(1).gt('one')");

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;