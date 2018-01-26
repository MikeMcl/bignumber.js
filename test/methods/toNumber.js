if (typeof Test === 'undefined') require('../tester');

Test('toNumber', function () {

    function isMinusZero(n) {
        return n === 0 ? 1 / n === -Infinity : null
    }

    function t(value, n) {
        Test.areEqual(n, new BigNumber(value).toNumber());
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        RANGE: 1E9,
        EXPONENTIAL_AT: 1E9
    });

    Test.areEqual(false, isMinusZero(new BigNumber('0').toNumber()));
    Test.areEqual(false, isMinusZero(new BigNumber('0.0').toNumber()));
    Test.areEqual(false, isMinusZero(new BigNumber('0.000000000000').toNumber()));
    Test.areEqual(false, isMinusZero(new BigNumber('0e+0').toNumber()));
    Test.areEqual(false, isMinusZero(new BigNumber('0e-0').toNumber()));
    Test.areEqual(false, isMinusZero(new BigNumber('1e-1000000000').toNumber()));

    Test.areEqual(true, isMinusZero(new BigNumber('-0').toNumber()));
    Test.areEqual(true, isMinusZero(new BigNumber('-0.0').toNumber()));
    Test.areEqual(true, isMinusZero(new BigNumber('-0.000000000000').toNumber()));
    Test.areEqual(true, isMinusZero(new BigNumber('-0e+0').toNumber()));
    Test.areEqual(true, isMinusZero(new BigNumber('-0e-0').toNumber()));
    Test.areEqual(true, isMinusZero(new BigNumber('-1e-1000000000').toNumber()));

    t(1, 1);
    t('1', 1);
    t('1.0', 1);
    t('1e+0', 1);
    t('1e-0', 1);
    t(12345.6789, 12345.6789);

    t(-1, -1);
    t('-1', -1);
    t('-1.0', -1);
    t('-1e+0', -1);
    t('-1e-0', -1);

    t(Infinity, 1 / 0);
    t('Infinity', 1 / 0);
    t(-Infinity, -1 / 0);
    t('-Infinity', -1 / 0);
    t(NaN, NaN);
    t('NaN', NaN);

    t('9.999999e+1000000000', 1 / 0);
    t('-9.999999e+1000000000', -1 / 0);
    t('1e-1000000000', 0);
    t('-1e-1000000000', -0);
});
