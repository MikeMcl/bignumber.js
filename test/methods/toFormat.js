if (typeof Test === 'undefined') require('../tester');

Test('toFormat', function () {

    function t(expected, value) {
        var args = Array.prototype.slice.call(arguments, 2),
            x = new BigNumber(value);

        Test.areEqual(expected, x.toFormat.apply(x, args));
    }

    var tx = Test.isException;

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        RANGE: 1E9,
        EXPONENTIAL_AT: [-7, 21],
        FORMAT: {
            prefix: '',
            negativeSign: '-',
            positiveSign: '',
            groupSeparator: ',',
            groupSize: 3,
            secondaryGroupSize: 0,
            decimalSeparator: '.',
            fractionGroupSeparator: '',
            fractionGroupSize: 0,
            suffix: ''
        }
    });

    // No arguments: default formatting, no rounding.

    t('0', 0);
    t('1', 1);
    t('-1', -1);
    t('123.456', 123.456);
    t('NaN', NaN);
    t('Infinity', 1 / 0);
    t('-Infinity', -1 / 0);

    t('9,876.54321', 9876.54321);
    t('4,018,736,400,000,000,000,000', '4.0187364e+21');

    t('999,999,999,999,999', 999999999999999);
    t('99,999,999,999,999', 99999999999999);
    t('9,999,999,999,999', 9999999999999);
    t('999,999,999,999', 999999999999);
    t('99,999,999,999', 99999999999);
    t('9,999,999,999', 9999999999);
    t('999,999,999', 999999999);
    t('99,999,999', 99999999);
    t('9,999,999', 9999999);
    t('999,999', 999999);
    t('99,999', 99999);
    t('9,999', 9999);
    t('999', 999);
    t('99', 99);
    t('9', 9);

    t('76,852.342091', '7.6852342091e+4');

    // Scalar dp = exact decimal places.

    t('0', 0, 0);
    t('0.0', 0, 1);
    t('1.00', 1, 2);
    t('-1.000', -1, 3);
    t('123.4560', 123.456, 4);
    t('NaN', NaN, 5);
    t('Infinity', 1 / 0, 6);
    t('-Infinity', -1 / 0, 7);

    t('9,876.54', 9876.54321, 2);
    t('76,852.34', '7.6852342091e+4', 2);

    // rm with scalar dp.

    t('1.56', '1.555', 2, 0);
    t('1.55', '1.555', 2, 1);
    t('1.56', '1.555', 2, 4);
    t('1.55', '1.555', 2, 5);

    // groupSeparator override.

    BigNumber.config({ FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ' ',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: '',
        fractionGroupSize: 0
    }});

    t('76 852.34', '7.6852342091e+4', 2);
    t('76 852.342091', '7.6852342091e+4');
    t('76 852.3420910871', '7.6852342091087145832640897e+4', 10);

    // fractionGroupSize.

    BigNumber.config({ FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ' ',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 5
    }});

    t('4 018 736 400 000 000 000 000', '4.0187364e+21');
    t('76 852.34209 10871 45832 64089', '7.685234209108714583264089e+4', 20);
    t('76 852.34209 10871 45832 64089 7', '7.6852342091087145832640897e+4', 21);
    t('76 852.34209 10871 45832 64089 70000', '7.6852342091087145832640897e+4', 25);

    t('999 999 999 999 999', 999999999999999, 0);
    t('99 999 999 999 999.0', 99999999999999, 1);
    t('9 999 999 999 999.00', 9999999999999, 2);
    t('999 999 999 999.000', 999999999999, 3);
    t('99 999 999 999.0000', 99999999999, 4);
    t('9 999 999 999.00000', 9999999999, 5);
    t('999 999 999.00000 0', 999999999, 6);
    t('99 999 999.00000 00', 99999999, 7);
    t('9 999 999.00000 000', 9999999, 8);
    t('999 999.00000 0000', 999999, 9);
    t('99 999.00000 00000', 99999, 10);
    t('9 999.00000 00000 0', 9999, 11);
    t('999.00000 00000 00', 999, 12);
    t('99.00000 00000 000', 99, 13);
    t('9.00000 00000 0000', 9, 14);

    // fractionGroupSize = 0.

    BigNumber.config({ FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ' ',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0
    }});

    t('76 852.34209108714583264089', '7.685234209108714583264089e+4', 20);
    t('76 852.342091087145832640897', '7.6852342091087145832640897e+4', 21);

    // secondaryGroupSize (Indian-style grouping).

    BigNumber.config({ FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 2
    }});

    t('9,876.54321', 9876.54321);
    t('10,00,037.123', '1000037.123456789', 3);
    t('4,01,87,36,40,00,00,00,00,00,000', '4.0187364e+21');

    t('99,99,99,99,99,99,999', 999999999999999);
    t('9,99,99,99,99,99,999', 99999999999999);
    t('99,99,99,99,99,999', 9999999999999);
    t('9,99,99,99,99,999', 999999999999);

    // dp [min, null]: minimum decimal places.

    BigNumber.config({ FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0
    }});

    t('100.00', 100, [2, null]);
    t('12.30', 12.3, [2, null]);
    t('12.345', 12.345, [2, null]);
    t('1,234.00', 1234, [2, null]);
    t('1,234.56789', 1234.56789, [2, null]);
    t('NaN', NaN, [2, null]);
    t('Infinity', 1 / 0, [2, null]);
    t('-Infinity', -1 / 0, [2, null]);

    // dp [null, max]: maximum decimal places.

    t('100', 100, [null, 5]);
    t('12.3', 12.3, [null, 5]);
    t('12.34568', 12.3456789, [null, 5]);
    t('12.346', 12.3456789, [null, 3]);
    t('12', 12.3456789, [null, 0]);
    t('0', 0, [null, 5]);
    t('NaN', NaN, [null, 5]);
    t('Infinity', 1 / 0, [null, 5]);
    t('-Infinity', -1 / 0, [null, 5]);

    // dp [min, max]: clamped range.

    t('100.00', 100, [2, 5]);
    t('12.30', 12.3, [2, 5]);
    t('12.345', 12.345, [2, 5]);
    t('12.34568', 12.3456789, [2, 5]);
    t('0.00', 0, [2, 5]);
    t('NaN', NaN, [2, 5]);
    t('Infinity', 1 / 0, [2, 5]);

    // [min, max] where min == max is equivalent to scalar dp.
    t('12.35', 12.345, [2, 2]);
    t('12.00', 12, [2, 2]);

    // rm with [min, max] (rounding applies when clamping to max).
    t('1.56', '1.555', [null, 2], 0);
    t('1.55', '1.555', [null, 2], 1);
    t('1.56', '1.555', [null, 2], 4);
    t('1.55', '1.555', [null, 2], 5);

    // negativeSign and positiveSign.

    t('(1,234.56)', -1234.56, { negativeSign: '(', suffix: ')' });
    t('1,234.56', 1234.56, { negativeSign: '(' });
    t('\u22121,234', -1234, { negativeSign: '\u2212' });
    t('+1,234', 1234, { positiveSign: '+' });
    t('-1,234', -1234, { positiveSign: '+' });
    t('+0', 0, { positiveSign: '+' });

    // prefix and suffix.

    t('$1,234.56', 1234.56, { prefix: '$' });
    t('$-1,234.56', -1234.56, { prefix: '$' });
    t('1,234.56€', 1234.56, { suffix: '€' });
    t('-1,234.56€', -1234.56, { suffix: '€' });
    t('$1,234.56 USD', 1234.56, { prefix: '$', suffix: ' USD' });

    // prefix with negativeSign: embed symbol in sign for sign-after-prefix behaviour.
    t('(1,234.56)', -1234.56, { negativeSign: '(', suffix: ')' });
    t('\u00a3-1,234.56', -1234.56, { prefix: '\u00a3' });

    // prefix with positiveSign.
    t('$+1,234.56', 1234.56, { positiveSign: '+', prefix: '$' });
    t('$-1,234.56', -1234.56, { positiveSign: '+', prefix: '$' });

    // NaN is affected by prefix and suffix.
    // Infinity is affected by prefix/suffix/negativeSign/positiveSign.

    t('$NaN', NaN, { prefix: '$' });
    t('$Infinity', 1 / 0, { prefix: '$' });
    t('$-Infinity', -1 / 0, { prefix: '$' });
    t('NaN USD', NaN, { suffix: ' USD' });
    t('NaN', NaN, { negativeSign: '(' });

    // prefix and suffix with dp.

    t('Amount: 1,234.50 USD', 1234.5, [2, null], null, {
        prefix: 'Amount: ',
        suffix: ' USD'
    });

    // Full options: European-style (sign embedded in negativeSign for -EUR behaviour).

    t('-€1.234.567,89', -1234567.89, 2, null, {
        negativeSign: '-\u20ac',
        decimalSeparator: ',',
        groupSeparator: '.',
        groupSize: 3
    });

    // Per-call dp with FORMAT defaults.

    BigNumber.config({ FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3
    }});

    t('100.00', 100, [2, 5]);
    t('12.30', 12.3, [2, 5]);
    t('12.34568', 12.3456789, [2, 5]);
    t('12.346', 12.3456789, [null, 3]);
    t('12.3456789', 12.3456789, [0, 10]);
    t('100.000', 100, 3);
    t('12.346', 12.3456789, 3);

    // Null and undefined keep current formatting defaults and do not round.

    BigNumber.config({ FORMAT: {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3
    }});

    t('123,456,789.123456789', '123456789.123456789');
    t('123,456,789.123456789', '123456789.123456789', null);
    t('123,456,789.123456789', '123456789.123456789', undefined);

    //if (typeof window == 'undefined') {
    //    var vm = require('vm');
    //    t('1,234.57', '1234.567', vm.runInNewContext('[2, 2]'));
    //}

    // Error cases.

    tx(function () { new BigNumber('1').toFormat('bad'); }, "toFormat('bad')");
    tx(function () { new BigNumber('1').toFormat(true); }, 'toFormat(true)');
    tx(function () { new BigNumber('1').toFormat([3, 1]); }, 'toFormat([3, 1])');
    tx(function () { new BigNumber('1').toFormat(2, 9); }, 'toFormat(2, 9)');
    tx(function () { new BigNumber('1').toFormat(2, null, 'bad'); }, "toFormat(2, null, 'bad')");
});