if (typeof Test === 'undefined') require('../tester');

Test('toBigInt', function () {

    function t(value, n) {
        Test.areEqual(n, new BigNumber(value).toBigInt());
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        RANGE: 1E9,
        EXPONENTIAL_AT: 1E9
    });

    t(1, 1n);
    t('1', 1n);
    t('1.0', 1n);

    t(-1, -1n);
    t('-1', -1n);
    t('-1.0', -1n);

    t('1234567890000000', 1234567890000000n);
    t('-1234567890000000', -1234567890000000n);

    t('1e18', BigInt(1e18));
    t('-1e18', BigInt(-1e18));
    t('1e50', BigInt(1e50));
    t('-1e50', BigInt(-1e50));
});
