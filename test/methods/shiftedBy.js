if (typeof Test === 'undefined') require('../tester');

Test('shiftedBy', function () {

    function t(expected, n, k) {
        Test.areEqual(String(expected), String(new BigNumber(n).shiftedBy(k)));
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: [-7, 21],
        RANGE: 1e9,
        POW_PRECISION: 0
    });

    t(0, 0, 0);
    t(10, 1, 1);
    t(0.1, 1, -1);
    t(200, 2, 2);
    t(2e+31, 2, 31);
    t(0.02, 2, -2);
    t(0.0002, 2, -4);
    t(1e+100, 1, 100);
    t(9999990, 9999.99, 3);

    t(NaN, NaN, 0);
    t(NaN, NaN, -1);
    t(NaN, NaN, 1);
    t(NaN, NaN, 2);
    t(NaN, NaN, -2);

    t(Infinity, Infinity, 0);
    t(-Infinity, -Infinity, -1);
    t(Infinity, Infinity, 1);
    t(-Infinity, -Infinity, 2);
    t(Infinity, Infinity, -2);

    t(0, 0, 1000);
    t(0, 0, 2);
    t(0, 0, -2);
    t(2, 2, 0);

    Test.areEqual('0', new BigNumber(0).shiftedBy(0).valueOf());
    Test.areEqual('-0', new BigNumber(-0).shiftedBy(0).valueOf());
    Test.areEqual('0', new BigNumber(0).shiftedBy(-0).valueOf());
    Test.areEqual('-0', new BigNumber(-0).shiftedBy(-0).valueOf());
    Test.areEqual('0', new BigNumber(0).shiftedBy(1000).valueOf());

    t('1e+1000000', 1, 1e6)
    t(1, '1e-1000000', 1e6)
    t('9.9e+999999999', 0.99, 1e+9);

    Test.isException(function () {new BigNumber('12.345').shiftedBy(true)}, ".shiftedBy(true)");
    Test.isException(function () {new BigNumber('12.345').shiftedBy(false)}, ".shiftedBy(false)");
    Test.isException(function () {new BigNumber('12.345').shiftedBy([])}, ".shiftedBy([])");
    Test.isException(function () {new BigNumber('12.345').shiftedBy({})}, ".shiftedBy({})");
    Test.isException(function () {new BigNumber('12.345').shiftedBy('')}, ".shiftedBy('')");
    Test.isException(function () {new BigNumber('12.345').shiftedBy(' ')}, ".shiftedBy(' ')");
    Test.isException(function () {new BigNumber('12.345').shiftedBy('4e')}, ".shiftedBy('4e')");
    Test.isException(function () {new BigNumber('12.345').shiftedBy('hello')}, ".shiftedBy('hello')");
    Test.isException(function () {new BigNumber('12.345').shiftedBy('\t')}, ".shiftedBy('\t')");
    Test.isException(function () {new BigNumber('12.345').shiftedBy(new Date)}, ".shiftedBy(new Date)");
    Test.isException(function () {new BigNumber('12.345').shiftedBy(new RegExp)}, ".shiftedBy(new RegExp)");
    Test.isException(function () {new BigNumber('12.345').shiftedBy(function (){})}, ".shiftedBy(function (){})");

    t('3.45345e+196', 0.000345345, 200);
    t('3.45345e-14', 0.000345345, -10);
});
