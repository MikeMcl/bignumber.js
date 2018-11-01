if (typeof Test === 'undefined') require('../tester');

Test('minimum and maximum', function () {

    var t = function (value){
        Test.isTrue(value);
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: [-7, 21],
        RANGE: 1e9
    });

    Test.areEqual(BigNumber.maximum, BigNumber.max);
    Test.areEqual(BigNumber.minimum, BigNumber.min);

    t(!BigNumber.min(0, 0, 0).isNaN());
    t(BigNumber.min(NaN, -2, 0, -1).isNaN());
    t(BigNumber.max(NaN, -2, 0, -1).isNaN());
    t(BigNumber.min(-2, 0, -1, new BigNumber(NaN)).isNaN());
    t(BigNumber.max(-2, 0, -1, new BigNumber(NaN)).isNaN());

    t(!BigNumber.min(-2, 0, -1).isNaN());
    t(!BigNumber.max(-2, 0, -1).isNaN());
    t(!BigNumber.min(-2, 0, -1, Infinity).isNaN());
    t(!BigNumber.max(-2, 0, -1, -Infinity).isNaN());
    t(!BigNumber.min(-2, 0, -1, Infinity).isNaN());
    t(!BigNumber.max(-2, 0, -1, Infinity).isNaN());
    t(!BigNumber.min(-2, -Infinity, 0, -1, Infinity).isNaN());

    t(new BigNumber(-Infinity).eq(BigNumber.min(-Infinity, -2, 0, -1, Infinity)));
    t(new BigNumber(-Infinity).eq(BigNumber.min(Infinity, -2, 0, -1, -Infinity)));
    t(new BigNumber(Infinity).eq(BigNumber.max(Infinity, -2, 0, -1, -Infinity)));
    t(new BigNumber(Infinity).eq(BigNumber.max(-Infinity, -2, 0, new BigNumber(Infinity), -1)));

    t(new BigNumber(-2).eq(BigNumber.min(-2, 0, -1)));
    t(new BigNumber(0).eq(BigNumber.max(-2, 0, -1)));
    t(new BigNumber(-2).eq(BigNumber.min(-2, -1, 0)));
    t(new BigNumber(0).eq(BigNumber.max(-2, -1, 0)));
    t(new BigNumber(-2).eq(BigNumber.min(0, -2, -1)));
    t(new BigNumber(0).eq(BigNumber.max(0, -2, -1)));
    t(new BigNumber(-2).eq(BigNumber.min(0, -1, -2)));
    t(new BigNumber(0).eq(BigNumber.max(0, -1, -2)));
    t(new BigNumber(-2).eq(BigNumber.min(-1, -2, 0)));
    t(new BigNumber(0).eq(BigNumber.max(-1, -2, 0)));
    t(new BigNumber(-2).eq(BigNumber.min(-1, 0, -2)));

    t(new BigNumber(-1).eq(BigNumber.min(-1, 0, 1)));
    t(new BigNumber(1).eq(BigNumber.max(-1, 0, 1)));
    t(new BigNumber(-1).eq(BigNumber.min(-1, 1, 0)));
    t(new BigNumber(1).eq(BigNumber.max(-1, 1, 0)));
    t(new BigNumber(-1).eq(BigNumber.min(0, -1, 1)));
    t(new BigNumber(1).eq(BigNumber.max(0, -1, 1)));
    t(new BigNumber(-1).eq(BigNumber.min(0, 1, -1)));
    t(new BigNumber(1).eq(BigNumber.max(0, 1, -1)));
    t(new BigNumber(-1).eq(BigNumber.min(1, -1, 0)));
    t(new BigNumber(1).eq(BigNumber.max(1, -1, 0)));
    t(new BigNumber(-1).eq(BigNumber.min(1, 0, -1)));

    t(new BigNumber(-1).eq(BigNumber.min('-1', 0, new BigNumber(1))));
    t(new BigNumber(1).eq(BigNumber.max('-1', 0, new BigNumber(1))));
    t(new BigNumber(-1).eq(BigNumber.min('-1', new BigNumber(1), 0)));
    t(new BigNumber(1).eq(BigNumber.max('-1', new BigNumber(1), 0)));
    t(new BigNumber(-1).eq(BigNumber.min(0, '-1', new BigNumber(1))));
    t(new BigNumber(1).eq(BigNumber.max(0, '-1', new BigNumber(1))));
    t(new BigNumber(-1).eq(BigNumber.min(0, new BigNumber(1), '-1')));
    t(new BigNumber(1).eq(BigNumber.max(0, new BigNumber(1), '-1')));
    t(new BigNumber(-1).eq(BigNumber.min(new BigNumber(1), '-1', 0)));
    t(new BigNumber(1).eq(BigNumber.max(new BigNumber(1), '-1', 0)));
    t(new BigNumber(-1).eq(BigNumber.min(new BigNumber(1), 0, '-1')));

    t(new BigNumber(0).eq(BigNumber.min(0, 1, 2)));
    t(new BigNumber(2).eq(BigNumber.max(0, 1, 2)));
    t(new BigNumber(0).eq(BigNumber.min(0, 2, 1)));
    t(new BigNumber(2).eq(BigNumber.max(0, 2, 1)));
    t(new BigNumber(0).eq(BigNumber.min(1, 0, 2)));
    t(new BigNumber(2).eq(BigNumber.max(1, 0, 2)));
    t(new BigNumber(0).eq(BigNumber.min(1, 2, 0)));
    t(new BigNumber(2).eq(BigNumber.max(1, 2, 0)));
    t(new BigNumber(0).eq(BigNumber.min(2, 1, 0)));
    t(new BigNumber(2).eq(BigNumber.max(2, 1, 0)));
    t(new BigNumber(0).eq(BigNumber.min(2, 0, 1)));
    t(new BigNumber(2).eq(BigNumber.max(2, 0, 1)));

    t = function (min, max, arr) {
        Test.isTrue(new BigNumber(min).eq(BigNumber.min.apply(null, arr)));
        Test.isTrue(new BigNumber(max).eq(BigNumber.max.apply(null, arr)));
    }

    t(-2, 0, [-2, -1, 0]);
    t(-2, 0, [-2, 0, -1]);
    t(-2, 0, [-1, -2, 0]);
    t(-2, 0, [-1, 0, -2]);
    t(-2, 0, [0, -2, -1]);
    t(-2, 0, [0, -1, -2]);

    t(-1, 1, [-1, 0, 1]);
    t(-1, 1, [-1, 1, 0]);
    t(-1, 1, [0, -1, 1]);
    t(-1, 1, [0, 1, -1]);
    t(-1, 1, [1, -1, 0]);
    t(-1, 1, [1, 0, -1]);

    t(0, 2, [0, 1, 2]);
    t(0, 2, [0, 2, 1]);
    t(0, 2, [1, 0, 2]);
    t(0, 2, [1, 2, 0]);
    t(0, 2, [2, 1, 0]);
    t(0, 2, [2, 0, 1]);

    t(-0.000001, 999.001, [2, -0, '1e-9000000000000000', 324.32423423, -0.000001, '999.001', 10]);
    t('-9.99999e+9000000000000000', Infinity, [10, '-9.99999e+9000000000000000', new BigNumber(Infinity), '9.99999e+9000000000000000', 0]);
    t('-9.999999e+9000000000000000', '1.01e+9000000000000000', ['-9.99998e+9000000000000000', '-9.999999e+9000000000000000', '9e+8999999999999999', '1.01e+9000000000000000', 1e+300]);
    t(1, Infinity, [1, '1e+9000000000000001', 1e200]);
    t(-Infinity, 1, [1, '-1e+9000000000000001', -1e200]);
    t(0, 1, [1, '1e-9000000000000001', 1e-200]);
    t(0, 1, [1, '-1e-9000000000000001', 1e-200]);
    t(-3, 3, [1, '2', 3, '-1', -2, '-3']);
});
