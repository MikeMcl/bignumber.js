if (typeof Test === 'undefined') require('../tester');

Test('fromFormat', function () {

    function t(expected, str, options) {
        var actual = BigNumber.fromFormat(str, options);
        Test.isTrue(new BigNumber(expected).eq(actual) || actual.isNaN() && new BigNumber(expected).isNaN());
    }

    var tx = Test.isException;

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
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


    // No formatting (plain numbers)

    t(0, '0');
    t(1, '1');
    t(-1, '-1');
    t(123, '123');
    t(0.5, '0.5');
    t(-0.5, '-0.5');
    t('123.456', '123.456');

    // Default FORMAT: groupSeparator ',' and decimalSeparator '.'

    t(1234, '1,234');
    t(1234567, '1,234,567');
    t('1234567.89', '1,234,567.89');
    t('1234567890.1234', '1,234,567,890.1234');
    t(-1234567, '-1,234,567');
    t('-1234567.89', '-1,234,567.89');
    t(0, '0.00');


    // European-style via options

    t('1234567.89', '1.234.567,89', {
        decimalSeparator: ',',
        groupSeparator: '.'
    });

    t('-1234567.89', '-1.234.567,89', {
        decimalSeparator: ',',
        groupSeparator: '.'
    });

    t(1234567, '1.234.567', {
        decimalSeparator: ',',
        groupSeparator: '.'
    });


    // Swiss-style: apostrophe grouping

    t('1234567.89', "1'234'567.89", {
        groupSeparator: "'"
    });


    // Indian-style grouping (different group sizes, still comma separator)

    t(12345678, '1,23,45,678');


    // Prefix via options

    t('1234567.89', '$1,234,567.89', { prefix: '$' });
    t('-1234567.89', '$-1,234,567.89', { prefix: '$' });
    t(0, '$0', { prefix: '$' });
    t('1234567.89', 'USD 1,234,567.89', { prefix: 'USD ' });
    t('-1234567.89', 'USD -1,234,567.89', { prefix: 'USD ' });


    // Suffix via options

    t('1234567.89', '1,234,567.89\u20ac', { suffix: '\u20ac' });
    t('-1234567.89', '-1,234,567.89\u20ac', { suffix: '\u20ac' });
    t('1234567.89', '1,234,567.89 SEK', { suffix: ' SEK' });


    // Prefix + suffix

    t('1234.56', '$1,234.56 USD', { prefix: '$', suffix: ' USD' });
    t('-1234.56', '$-1,234.56 USD', { prefix: '$', suffix: ' USD' });


    // negativeSign

    t('-1234.56', '(1,234.56)', { negativeSign: '(', suffix: ')' });
    t('-1234.56', '\u22121,234.56', { negativeSign: '\u2212' });
    t(1234.56, '1,234.56');    // no custom minus detected


    // positiveSign

    t('1234.56', '+1,234.56', { positiveSign: '+' });
    t('-1234.56', '-1,234.56', { positiveSign: '+' });


    // negativeSign + prefix

    t('-1234.56', '$-1,234.56', { prefix: '$' });
    t('-1234.56', '$(1,234.56)', { negativeSign: '(', suffix: ')', prefix: '$' });
    t('1234.56', '$1,234.56', { negativeSign: '(', suffix: ')', prefix: '$' });


    // positiveSign + prefix

    t('1234.56', '$+1,234.56', { positiveSign: '+', prefix: '$' });
    t('-1234.56', '$-1,234.56', { positiveSign: '+', prefix: '$' });


    // Prefix and suffix

    t('1234567.89', '1,234,567.89 USD', { suffix: ' USD' });
    t('1234.56', 'Amount: 1,234.56 EUR', { prefix: 'Amount: ', suffix: ' EUR' });
    t(1234, '(1,234)', { prefix: '(', suffix: ')' });


    // European-style with prefix + suffix

    t('1234.56', 'Amount: 1.234,56 EUR', {
        prefix: 'Amount: ',
        suffix: ' EUR',
        decimalSeparator: ',',
        groupSeparator: '.'
    });


    // fractionGroupSeparator

    t('1234567.12345678', '1,234,567.1234 5678', {
        fractionGroupSeparator: ' '
    });

    t('1234567.12345678', '1,234,567.12_34_56_78', {
        fractionGroupSeparator: '_'
    });


    // Both group and fraction group separators

    t('1234567.12345678', '1.234.567,1234 5678', {
        decimalSeparator: ',',
        groupSeparator: '.',
        fractionGroupSeparator: ' '
    });


    // No grouping (plain numbers with no separators)

    t('1234567.89', '1234567.89', { groupSeparator: '' });
    t('1234567.89', '1234567.89', { groupSeparator: '', fractionGroupSeparator: '' });


    // Full round-trip: toFormat then fromFormat with same options

    var opts = {
        prefix: '',
        negativeSign: '-',
        positiveSign: '',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        decimalSeparator: '.',
        suffix: ''
    };

    var z = new BigNumber('1234567890.1234');
    var formatted = z.toFormat(opts);
    t('1234567890.1234', formatted, opts);


    // Round-trip with prefix

    var csOpts = {
        prefix: '$',
        groupSeparator: ',',
        groupSize: 3,
        decimalSeparator: '.'
    };
    var csVal = new BigNumber('-1234567.89');
    t('-1234567.89', csVal.toFormat(2, null, csOpts), csOpts);
    csVal = new BigNumber('1234567.89');
    t('1234567.89', csVal.toFormat(2, null, csOpts), csOpts);


    // Round-trip with negativeSign/positiveSign

    var signOpts = {
        negativeSign: '(',
        positiveSign: '+',
        suffix: ')',
        prefix: '$',
        groupSeparator: ',',
        groupSize: 3,
        decimalSeparator: '.'
    };
    var negVal = new BigNumber('-1234.56');
    formatted = negVal.toFormat(2, null, signOpts);
    t('-1234.56', formatted, signOpts);
    var posVal = new BigNumber('1234.56');
    formatted = posVal.toFormat(2, null, signOpts);
    t('1234.56', formatted, signOpts);


    // Round-trip with European options

    var eurOpts = {
        prefix: '\u20ac',
        negativeSign: '-',
        positiveSign: '',
        decimalSeparator: ',',
        groupSeparator: '.',
        groupSize: 3,
        suffix: ' EUR'
    };

    var x = new BigNumber('1234567.8912');
    formatted = x.toFormat(4, null, eurOpts);
    t('1234567.8912', formatted, eurOpts);

    var y = new BigNumber('-9876543210.123456');
    formatted = y.toFormat(6, null, eurOpts);
    t('-9876543210.123456', formatted, eurOpts);


    // Error: not a string

    tx(function () { BigNumber.fromFormat(123); });
    tx(function () { BigNumber.fromFormat(null); });
    tx(function () { BigNumber.fromFormat(undefined); });
    tx(function () { BigNumber.fromFormat(true); });
    tx(function () { BigNumber.fromFormat(new BigNumber(1)); });


    // Error: options not an object

    tx(function () { BigNumber.fromFormat('123', 'abc'); });
    tx(function () { BigNumber.fromFormat('123', 123); });
    tx(function () { BigNumber.fromFormat('123', true); });
});
