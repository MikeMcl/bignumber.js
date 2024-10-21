if (typeof Test === 'undefined') require('../tester');

Test('toBigInt', function () {

    function t(value, n) {
        Test.areEqual(n, new BigNumber(value).toBigInt());
    }

    function tx(fn, msg){
        Test.isException(fn, msg);
    }

    t(0, 0n);
    t(-0, 0n);
    t(1, 1n);
    t(1, 1n);
    t(-1, -1n);
    t('-1', -1n);
    t('1.0', 1n);
    t('-1.0', -1n);
    t('11111.0000', 11111n);
    t('-11111.0000', -11111n);

    t('1234567890000000', 1234567890000000n);
    t('1234567890000000', 1234567890000000n);
    t('-1234567890000000', -1234567890000000n);
    t('1e18', BigInt(1e18));
    t('-1e18', BigInt(-1e18));

    // large integers
    t('1e50', BigInt(`1${'0'.repeat(50)}`));
    t('-1e50', BigInt(`-1${'0'.repeat(50)}`));
    t('1e100', BigInt(`1${'0'.repeat(100)}`));

    // non-integers
    tx(() => new BigNumber(null).toBigInt(), '(null)');
    tx(() => new BigNumber(NaN).toBigInt(), '(NaN)');
    tx(() => new BigNumber(Infinity).toBigInt(), '(Infinity)');
    tx(() => new BigNumber(-Infinity).toBigInt(), '(-Infinity)');
    tx(() => new BigNumber('123abcdefg').toBigInt(), '(123abcdefg)');
    tx(() => new BigNumber('abcdefg').toBigInt(), '(abcdefg)');
    tx(() => new BigNumber(1.1).toBigInt(), '(1.1)');
    tx(() => new BigNumber(-1.1).toBigInt(), '(-1.1)');
    tx(() => new BigNumber(123123123.123).toBigInt(), '(123123123.123)');
    tx(() => new BigNumber(321.123).toBigInt(), '(321.123)');
});
