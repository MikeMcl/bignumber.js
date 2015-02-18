var count = (function dp(BigNumber) {
    var start = +new Date(),
        log,
        error,
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

    function T(value, dp){
        assert(dp, new BigNumber(value).decimalPlaces());
        assert(dp, new BigNumber(value).dp());
    }

    log('\n Testing dp...');

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        ERRORS: true,
        RANGE: 1E9,
        EXPONENTIAL_AT: [-7, 21]
    });

    T(0, 0);
    T(1, 0);
    T(1.2, 1);
    T(0.1, 1);
    T(0.25, 2);
    T(0.0625, 4);
    T(99, 0);
    T(9900, 0);
    T(1000.001, 3);
    T('1000.001', 3);
    T(-0, 0);
    T(-1, 0);
    T(-1.2, 1);
    T(-0.1, 1);
    T(-0.25, 2);
    T(-0.0625, 4);
    T(-99, 0);
    T(-9900, 0);
    T(-1000.001, 3);
    T('-1000.001', 3);

    T(NaN, null);
    T('NaN', null);
    T(Infinity, null);
    T(-Infinity, null);
    T('Infinity', null);
    T('-Infinity', null);

    T('0.00000000000000000002', 20);
    T('100.0000000000000000000000000000000000032948', 40);
    T('1.3e-11', 12);
    T('-3.52e-7', 9);
    T('6.9525e-12', 16);
    T('2.1e-8', 9);
    T('3.7015e-7', 11);
    T('-50.1839', 4);
    T('0.014836', 6);
    T('-16688', 0);
    T('-506006218906684823229.56892808849303', 14);
    T('10000000000000.00000000000000000000000000000000000001000000000000000000000000000000000000000001', 80);
    T('057643758687043658032465987410000000000000.0000000000000', 0);
    T('999999999999999999999999999999999999999999999999999999999999999999999999999.99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999', 113);

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];;
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;