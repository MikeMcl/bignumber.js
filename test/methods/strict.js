if (typeof Test === 'undefined') require('../tester');

Test('strict', function () {
    function t(expected, actual) {
        Test.areEqual(expected, actual);
    }

    function tx(fn, msg) {
        Test.isException(fn, msg);
    }

    var config = BigNumber.config();

    t(true, config.STRICT);
    t(false, BigNumber.config({ STRICT: false }).STRICT);

    t('NaN', new BigNumber('blurgh').toString());
    t('NaN', new BigNumber('3', 2).toString());
    t('NaN', new BigNumber(1).plus('nowt').toString());
    t(null, new BigNumber(1).comparedTo('nowt'));
    t('NaN', new BigNumber({}).toString());
    t('NaN', new BigNumber({}, 10).toString());
    t('NaN', new BigNumber(1).plus({}).toString());
    t('NaN', new BigNumber('abc123def').toString());
    t('NaN', new BigNumber('x-4.5y').toString());
    t('NaN', new BigNumber('foo6e2bar').toString());
    t('NaN', new BigNumber(true).toString());
    t('NaN', new BigNumber(false).toString());
    t('NaN', new BigNumber([]).toString());
    t('10', new BigNumber([10]).toString());
    t('NaN', new BigNumber([1, 2]).toString());
    t('8', new BigNumber(Object(8)).toString());
    t('6.2', new BigNumber(Object('6.2')).toString());

    tx(function () { BigNumber.config({ STRICT: null }); }, 'STRICT: null');
    tx(function () { BigNumber.config({ STRICT: 'yes' }); }, "STRICT: 'yes'");

    t(true, BigNumber.config({ STRICT: true }).STRICT);

    tx(function () { new BigNumber('blurgh'); }, "new BigNumber('blurgh')");
    tx(function () { new BigNumber('9', 2); }, "new BigNumber('9', 2)");
    tx(function () { new BigNumber(1).plus('nowt'); }, "new BigNumber(1).plus('nowt')");
    tx(function () { new BigNumber({ toString: function () { return '15px'; } }); }, "new BigNumber({ toString: function () { return '15px'; } })");
    tx(function () { new BigNumber({ toString: function () { return 'nope'; } }); }, "new BigNumber({ toString: function () { return 'nope'; } })");
    tx(function () { new BigNumber(true, 10); }, 'new BigNumber(true, 10)');
    tx(function () { new BigNumber([15], 10); }, 'new BigNumber([15], 10)');
    tx(function () { new BigNumber([1, 5], 10); }, 'new BigNumber([1, 5], 10)');
    tx(function () { new BigNumber(1).plus(false); }, 'new BigNumber(1).plus(false)');
    tx(function () { new BigNumber(1).comparedTo([]); }, 'new BigNumber(1).comparedTo([])');
    tx(function () { new BigNumber(null); }, 'new BigNumber(null)');
    tx(function () { new BigNumber(undefined); }, 'new BigNumber(undefined)');
    tx(function () { new BigNumber(function () {}); }, 'new BigNumber(function () {})');

    // A sign or decimal point alone is not a number in any explicit base.
    var invalid = ['', ' ', '\t\n', '+', '-', '.', '+.', '-.', ' \t+.\n', '\u00a0-\u00a0'],
        malformed = ['0_', '0__0', '0..0', '0+', '0-', '0 .', '0._0', '0_.0'],
        bases = [2, 3, 8, 10, 16, 36],
        valid = [['0', '0'], ['-0', '-0'], ['0.', '0'], ['-0.', '-0'],
            ['.0', '0'], ['-.0', '-0'], ['1.', '1'], ['1.0', '1']],
        i, j, k, BN;

    for (i = 0; i < bases.length; i++) {
        BigNumber.config({ STRICT: false });
        for (j = 0; j < invalid.length; j++) {
            t('NaN', new BigNumber(invalid[j], bases[i]).valueOf());
        }
        for (j = 0; j < malformed.length; j++) {
            t('NaN', new BigNumber(malformed[j], bases[i]).valueOf());
        }
        for (j = 0; j < valid.length; j++) {
            t(valid[j][1], new BigNumber(valid[j][0], bases[i]).valueOf());
        }
        t(String(bases[i]), new BigNumber('1_0', bases[i]).valueOf());

        BigNumber.config({ STRICT: true });
        for (j = 0; j < invalid.length; j++) {
            tx(function () { new BigNumber(invalid[j], bases[i]); },
                'empty numeral in base ' + bases[i]);
        }
        for (j = 0; j < malformed.length; j++) {
            tx(function () { new BigNumber(malformed[j], bases[i]); },
                'malformed numeral in base ' + bases[i]);
        }
        for (j = 0; j < valid.length; j++) {
            t(valid[j][1], new BigNumber(valid[j][0], bases[i]).valueOf());
        }
        t(String(bases[i]), new BigNumber('1_0', bases[i]).valueOf());
    }

    // The zero and one numerals need not be ASCII digits, even for base two.
    for (k = 0; k < 2; k++) {
        BN = BigNumber.clone({ ALPHABET: k ? 'a_' : 'ab', STRICT: false });
        for (j = 0; j < invalid.length; j++) {
            t('NaN', new BN(invalid[j], 2).valueOf());
        }
        t('0', new BN('a', 2).valueOf());
        t('-0', new BN('-a.', 2).valueOf());
        t('1', new BN(k ? '_' : 'b', 2).valueOf());
        BN.config({ STRICT: true });
        for (j = 0; j < invalid.length; j++) {
            tx(function () { new BN(invalid[j], 2); }, 'empty custom-base numeral');
        }
        t('1', new BN(k ? '_.' : 'b.', 2).valueOf());
    }

    BigNumber.config(config);
});
