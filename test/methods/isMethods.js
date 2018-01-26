if (typeof Test === 'undefined') require('../tester');

Test('`is` methods', function () {
    var n;

    //  isEqualTo eq
    //  isFinite
    //  isGreaterThan gt
    //  isGreaterThanOrEqualTo gte
    //  isInteger
    //  isLessThan lt
    //  isLessThanOrEqualTo lte
    //  isNaN
    //  isNegative
    //  isPositive
    //  isZero
    //  valueOf

    function t(expected, value) {
        Test.areEqual(expected, value);
    }

    t(BigNumber.prototype.isEqualTo, BigNumber.prototype.eq);
    t(BigNumber.prototype.isGreaterThan, BigNumber.prototype.gt);
    t(BigNumber.prototype.isGreaterThanOrEqualTo, BigNumber.prototype.gte);
    t(BigNumber.prototype.isLessThan,BigNumber.prototype.lt);
    t(BigNumber.prototype.isLessThanOrEqualTo, BigNumber.prototype.lte);

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: 1e+9,
        RANGE: 1e+9
    });

    n = new BigNumber(1);
    t(true, n.isFinite());
    t(true, n.isInteger());
    t(false, n.isNaN());
    t(false, n.isNegative());
    t(true, n.isPositive());
    t(false, n.isZero());
    t(true, n.isEqualTo(n));
    t(true, n.isEqualTo(n, 2));
    t(true, n.isEqualTo(1, 3));
    t(true, n.isEqualTo(n, 4));
    t(true, n.isEqualTo(1, 5));
    t(true, n.isEqualTo(n, 6));
    t(true, n.isEqualTo(1, 7));
    t(true, n.isEqualTo(n, 8));
    t(true, n.isEqualTo(1, 9));
    t(true, n.isEqualTo(n, 10));
    t(true, n.isEqualTo(n, 11));
    t(true, n.isEqualTo(1, 12));
    t(true, n.isEqualTo(n, 13));
    t(true, n.isEqualTo(1, 14));
    t(true, n.isEqualTo(n, 15));
    t(true, n.isEqualTo(1, 16));
    t(true, n.isEqualTo(n, 17));
    t(true, n.isEqualTo(1, 18));
    t(true, n.isEqualTo(n, 19));
    t(true, n.isEqualTo('1.0', 20));
    t(true, n.isEqualTo('1.00', 21));
    t(true, n.isEqualTo('1.000', 22));
    t(true, n.isEqualTo('1.0000', 23));
    t(true, n.isEqualTo('1.00000', 24));
    t(true, n.isEqualTo('1.000000', 25));
    t(true, n.isEqualTo(new BigNumber(1, 10), 26));
    t(true, n.isEqualTo(new BigNumber(1), 27));
    t(true, n.isEqualTo(1, 28));
    t(true, n.isEqualTo(1, 29));
    t(true, n.isEqualTo(1, 30));
    t(true, n.isEqualTo(1, 31));
    t(true, n.isEqualTo(1, 32));
    t(true, n.isEqualTo(1, 33));
    t(true, n.isEqualTo(1, 34));
    t(true, n.isEqualTo(1, 35));
    t(true, n.isEqualTo(1, 36));
    t(true, n.isGreaterThan(0.99999));
    t(false, n.isGreaterThanOrEqualTo(1.1));
    t(true, n.isLessThan(1.001));
    t(true, n.isLessThanOrEqualTo(2));
    t(true, n.toString() === n.valueOf());

     n = new BigNumber('-0.1');
    t(true, n.isFinite());
    t(false, n.isInteger());
    t(false, n.isNaN());
    t(true, n.isNegative());
    t(false, n.isPositive());
    t(false, n.isZero());
    t(false, n.isEqualTo(0.1));
    t(false, n.isGreaterThan(-0.1));
    t(true, n.isGreaterThanOrEqualTo(-1));
    t(true, n.isLessThan(-0.01));
    t(false, n.isLessThanOrEqualTo(-1));
    t(true, n.toString() === n.valueOf());

    n = new BigNumber(Infinity);
    t(false, n.isFinite());
    t(false, n.isInteger());
    t(false, n.isNaN());
    t(false, n.isNegative());
    t(true, n.isPositive());
    t(false, n.isZero());
    t(true, n.eq('Infinity'));
    t(true, n.eq(1/0));
    t(true, n.gt('9e999'));
    t(true, n.gte(Infinity));
    t(false, n.lt(Infinity));
    t(true, n.lte(Infinity));
    t(true, n.toString() === n.valueOf());

    n = new BigNumber('-Infinity');
    t(false, n.isFinite());
    t(false, n.isInteger());
    t(false, n.isNaN());
    t(true, n.isNegative());
    t(false, n.isPositive());
    t(false, n.isZero());
    t(false, n.isEqualTo(Infinity));
    t(true, n.isEqualTo(-1/0));
    t(false, n.isGreaterThan(-Infinity));
    t(true, n.isGreaterThanOrEqualTo('-Infinity', 8));
    t(true, n.isLessThan(0));
    t(true, n.isLessThanOrEqualTo(Infinity));
    t(true, n.toString() === n.valueOf());

    n = new BigNumber('0.0000000');
    t(true, n.isFinite());
    t(true, n.isInteger());
    t(false, n.isNaN());
    t(false, n.isNegative());
    t(true, n.isPositive());
    t(true, n.isZero());
    t(true, n.eq(-0));
    t(true, n.gt(-0.000001));
    t(false, n.gte(0.1));
    t(true, n.lt(0.0001));
    t(true, n.lte(-0));
    t(true, n.toString() === n.valueOf());

    n = new BigNumber(-0);
    t(true, n.isFinite());
    t(true, n.isInteger());
    t(false, n.isNaN());
    t(true, n.isNegative());
    t(false, n.isPositive());
    t(true, n.isZero());
    t(true, n.isEqualTo('0.000'));
    t(true, n.isGreaterThan(-1));
    t(false, n.isGreaterThanOrEqualTo(0.1));
    t(false, n.isLessThan(0));
    t(false, n.isLessThan(0, 36));
    t(true, n.isLessThan(0.1));
    t(true, n.isLessThanOrEqualTo(0));
    t(true, n.valueOf() === '-0');
    t(true, n.toJSON() === '-0');
    t(true, n.toString() === '0');

    n = new BigNumber('NaN');
    t(false, n.isFinite());
    t(false, n.isInteger());
    t(true, n.isNaN());
    t(false, n.isNegative());
    t(false, n.isPositive());
    t(false, n.isZero());
    t(false, n.eq(NaN));
    t(false, n.eq(Infinity));
    t(false, n.gt(0));
    t(false, n.gte(0));
    t(false, n.lt(1));
    t(false, n.lte(-0));
    t(false, n.lte(-1));
    t(true, n.toString() === n.valueOf());

    n = new BigNumber('-1.234e+2');
    t(true, n.isFinite());
    t(false, n.isInteger());
    t(false, n.isNaN());
    t(true, n.isNegative());
    t(false, n.isPositive());
    t(false, n.isZero());
    t(true, n.eq(-123.4, 10));
    t(true, n.gt('-ff', 16));
    t(true, n.gte('-1.234e+3'));
    t(true, n.lt(-123.39999));
    t(true, n.lte('-123.4e+0'));
    t(true, n.toString() === n.valueOf());

    n = new BigNumber('5e-200');
    t(true, n.isFinite());
    t(false, n.isInteger());
    t(false, n.isNaN());
    t(false, n.isNegative());
    t(true, n.isPositive());
    t(false, n.isZero());
    t(true, n.isEqualTo(5e-200));
    t(true, n.isGreaterThan(5e-201));
    t(false, n.isGreaterThanOrEqualTo(1));
    t(true, n.isLessThan(6e-200));
    t(true, n.isLessThanOrEqualTo(5.1e-200));
    t(true, n.toString() === n.valueOf());

    n = new BigNumber('1');
    t(true, n.isEqualTo(n));
    t(true, n.isEqualTo(n.toString()));
    t(true, n.isEqualTo(n.toString()));
    t(true, n.isEqualTo(n.valueOf()));
    t(true, n.isEqualTo(n.toFixed()));
    t(true, n.isEqualTo(1));
    t(true, n.isEqualTo('1e+0'));
    t(false, n.isEqualTo(-1));
    t(false, n.isEqualTo(0.1));

    t(true, new BigNumber(10).isGreaterThan(10, 2));
    t(true, new BigNumber(10).isGreaterThan(10, 3));
    t(true, new BigNumber(10).isGreaterThan(10, 4));
    t(true, new BigNumber(10).isGreaterThan(10, 5));
    t(true, new BigNumber(10).isGreaterThan(10, 6));
    t(true, new BigNumber(10).isGreaterThan(10, 7));
    t(true, new BigNumber(10).isGreaterThan(10, 8));
    t(true, new BigNumber(10).isGreaterThan(10, 9));
    t(false, new BigNumber(10).isGreaterThan(10, 10));
    t(false, new BigNumber(10).isGreaterThan(10, 11));
    t(false, new BigNumber(10).isGreaterThan(10, 12));
    t(false, new BigNumber(10).isGreaterThan(10, 13));
    t(true, new BigNumber(10).isLessThan(10, 11));
    t(true, new BigNumber(10).isLessThan(10, 12));
    t(true, new BigNumber(10).isLessThan(10, 13));
    t(true, new BigNumber(10).isLessThan(10, 14));
    t(true, new BigNumber(10).isLessThan(10, 15));
    t(true, new BigNumber(10).isLessThan(10, 16));
    t(true, new BigNumber(10).isLessThan(10, 17));
    t(true, new BigNumber(10).isLessThan(10, 18));
    t(true, new BigNumber(10).isLessThan(10, 19));
    t(true, new BigNumber(10).isLessThan(10, 20));
    t(true, new BigNumber(10).isLessThan(10, 21));
    t(true, new BigNumber(10).isLessThan(10, 22));
    t(true, new BigNumber(10).isLessThan(10, 34));
    t(true, new BigNumber(10).isLessThan(10, 35));
    t(true, new BigNumber(10).isLessThan(10, 36));
    t(false, new BigNumber(NaN).isLessThan(NaN));
    t(false, new BigNumber(Infinity).isLessThan(-Infinity));
    t(false, new BigNumber(Infinity).isLessThan(Infinity));
    t(true, new BigNumber(Infinity, 10).isLessThanOrEqualTo(Infinity, 2));
    t(false, new BigNumber(NaN).isGreaterThanOrEqualTo(NaN));
    t(true, new BigNumber(Infinity).isGreaterThanOrEqualTo(Infinity));
    t(true, new BigNumber(Infinity).isGreaterThanOrEqualTo(-Infinity));
    t(false, new BigNumber(NaN).isGreaterThanOrEqualTo(-Infinity));
    t(true, new BigNumber(-Infinity).isGreaterThanOrEqualTo(-Infinity));

    t(false, new BigNumber(2, 10).isGreaterThan(10, 2));
    t(false, new BigNumber(10, 2).isLessThan(2, 10));
    t(true, new BigNumber(255).isLessThanOrEqualTo('ff', 16));
    t(true, new BigNumber('a', 16).isGreaterThanOrEqualTo(9, 16));
    t(false, new BigNumber(0).isLessThanOrEqualTo('NaN'));
    t(false, new BigNumber(0).isGreaterThanOrEqualTo(NaN));
    t(false, new BigNumber(NaN, 2).isLessThanOrEqualTo('NaN', 36));
    t(false, new BigNumber(NaN, 36).isGreaterThanOrEqualTo(NaN, 2));
    t(false, new BigNumber(0).isLessThanOrEqualTo(-Infinity));
    t(true, new BigNumber(0).isGreaterThanOrEqualTo(-Infinity));
    t(true, new BigNumber(0).isLessThanOrEqualTo('Infinity', 36));
    t(false, new BigNumber(0).isGreaterThanOrEqualTo('Infinity', 36));
    t(false, new BigNumber(10).isLessThanOrEqualTo(20, 4));
    t(true, new BigNumber(10).isLessThanOrEqualTo(20, 5));
    t(false, new BigNumber(10).isGreaterThanOrEqualTo(20, 6));

    t(false, new BigNumber(1.23001e-2).isLessThan(1.23e-2));
    t(true, new BigNumber(1.23e-2).lt(1.23001e-2));
    t(false, new BigNumber(1e-2).isLessThan(9.999999e-3));
    t(true, new BigNumber(9.999999e-3).lt(1e-2));

    t(false, new BigNumber(1.23001e+2).isLessThan(1.23e+2));
    t(true, new BigNumber(1.23e+2).lt(1.23001e+2));
    t(true, new BigNumber(9.999999e+2).isLessThan(1e+3));
    t(false, new BigNumber(1e+3).lt(9.9999999e+2));

    t(false, new BigNumber(1.23001e-2).isLessThanOrEqualTo(1.23e-2));
    t(true, new BigNumber(1.23e-2).lte(1.23001e-2));
    t(false, new BigNumber(1e-2).isLessThanOrEqualTo(9.999999e-3));
    t(true, new BigNumber(9.999999e-3).lte(1e-2));

    t(false, new BigNumber(1.23001e+2).isLessThanOrEqualTo(1.23e+2));
    t(true, new BigNumber(1.23e+2).lte(1.23001e+2));
    t(true, new BigNumber(9.999999e+2).isLessThanOrEqualTo(1e+3));
    t(false, new BigNumber(1e+3).lte(9.9999999e+2));

    t(true, new BigNumber(1.23001e-2).isGreaterThan(1.23e-2));
    t(false, new BigNumber(1.23e-2).gt(1.23001e-2));
    t(true, new BigNumber(1e-2).isGreaterThan(9.999999e-3));
    t(false, new BigNumber(9.999999e-3).gt(1e-2));

    t(true, new BigNumber(1.23001e+2).isGreaterThan(1.23e+2));
    t(false, new BigNumber(1.23e+2).gt(1.23001e+2));
    t(false, new BigNumber(9.999999e+2).isGreaterThan(1e+3));
    t(true, new BigNumber(1e+3).gt(9.9999999e+2));

    t(true, new BigNumber(1.23001e-2).isGreaterThanOrEqualTo(1.23e-2));
    t(false, new BigNumber(1.23e-2).gte(1.23001e-2));
    t(true, new BigNumber(1e-2).isGreaterThanOrEqualTo(9.999999e-3));
    t(false, new BigNumber(9.999999e-3).gte(1e-2));

    t(true, new BigNumber(1.23001e+2).isGreaterThanOrEqualTo(1.23e+2));
    t(false, new BigNumber(1.23e+2).gte(1.23001e+2));
    t(false, new BigNumber(9.999999e+2).isGreaterThanOrEqualTo(1e+3));
    t(true, new BigNumber(1e+3).gte(9.9999999e+2));

    Test.isException(function () {new BigNumber(1).lt(true, null)}, "new BigNumber(1).lt(true, null)");
    Test.isException(function () {new BigNumber(1).gt('one')}, "new BigNumber(1).gt('one')");
});
