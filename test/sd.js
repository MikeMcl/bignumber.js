var count = (function sd(BigNumber) {
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

    function T(val, sd, includeZeros) {
        assert(sd, new BigNumber(val).sd(includeZeros));
        assert(sd, new BigNumber(val).precision(includeZeros));
    }

    log('\n Testing sd...');

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        ERRORS: true,
        RANGE: 1E9,
        EXPONENTIAL_AT: [-7, 21]
    });

    T(NaN, null);
    T(Infinity, null, 1);
    T(-Infinity, null);

    T(0, 1);
    T(-0, 1);
    T(0, 1, 1);
    T(-0, 1, 1);
    T(1, 1, 1);
    T(-1, 1, 1);

    T(100, 1);
    T(100, 1, 0);
    T(100, 1, false);
    T(100, 3, 1);
    T(100, 3, true);

    T('0.001234568900', 8);
    T('0.001234568900', 8, 0);
    T('0.001234568900', 8, false);
    T('0.001234568900', 8, 1);
    T('0.001234568900', 8, true);

    T('987654321000000', 9, 0);
    T('987654321000000', 15, 1);
    T('987654321000000.0012345689000001', 31, 0);
    T('987654321000000.0012345689000001', 31, 1);

    T('1e+123', 1);
    T('1e+123', 124, 1);

    T('1e-123', 1);
    T('1e-123', 1);
    T('1e-123', 1, 1);

    T('9.9999e+900000000', 5, false);
    T('9.9999e+900000000', 900000001, true);
    T('-9.9999e+900000000', 5, false);
    T('-9.9999e+900000000', 900000001, true);

    T('1e-900000000', 1, false);
    T('1e-900000000', 1, true);
    T('-1e-900000000', 1, false);
    T('-1e-900000000', 1, true);

    T('0e+0', 1);
    T('0e-4', 1);
    T('   +4352435.435435e-4   ', 13);
    T('   -4352435.435435e+14   ', 21, true);

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;
