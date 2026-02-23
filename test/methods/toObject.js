if (typeof Test === 'undefined') require('../tester');

Test('toObject', function () {

    function t(value, expectedC, expectedE, expectedS) {
        var obj = new BigNumber(value).toObject();
        Test.isTrue(obj.s === expectedS);
        Test.isTrue(obj.e === expectedE);
        if (expectedC === null) {
            Test.isTrue(obj.c === null);
        } else {
            Test.areEqual(String(expectedC), String(obj.c));
        }
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        RANGE: 1E9,
        EXPONENTIAL_AT: [-7, 21]
    });

    // Zero
    t(0, [0], 0, 1);
    t(-0, [0], 0, -1);
    t('0', [0], 0, 1);

    // Integers
    t(1, [1], 0, 1);
    t(-1, [1], 0, -1);
    t(10, [10], 1, 1);
    t(123, [123], 2, 1);

    // Decimals
    t(0.1, [10000000000000], -1, 1);
    t('0.5', [50000000000000], -1, 1);
    t('123.456', [123, 45600000000000], 2, 1);
    t('-123.456', [123, 45600000000000], 2, -1);
    t('777.123', [777, 12300000000000], 2, 1);

    // Exponential notation
    t('1e+21', [10000000], 21, 1);
    t('1.5e+10', [15000000000], 10, 1);
    t('1e-7', [10000000], -7, 1);

    // Infinity
    t(Infinity, null, null, 1);
    t(-Infinity, null, null, -1);

    // NaN
    t(NaN, null, null, null);

    // Large values
    t('5032485723458348569331745.33434346346912144534543',
      [50324857234, 58348569331745, 33434346346912, 14453454300000], 24, 1);

    // Returned object has correct properties
    var x = new BigNumber('777.123');
    var obj = x.toObject();
    Test.isTrue('c' in obj && 'e' in obj && 's' in obj);
    Test.isTrue(!('_isBigNumber' in obj));

    // Coefficient is a copy, not a reference
    obj.c[0] = 999;
    Test.areEqual('777.123', x.toString());

    // Round-trip: toObject -> constructor
    var values = [
        '0', '-0', '1', '-1', '123.456', '-123.456',
        '1e+21', '1e-7', '9.999e+9000000', '1e-9000000',
        '5032485723458348569331745.33434346346912144534543'
    ];

    for (var i = 0; i < values.length; i++) {
        var bn = new BigNumber(values[i]);
        obj = bn.toObject();
        obj._isBigNumber = true;
        var bn2 = new BigNumber(obj);
        Test.areEqual(bn.toString(), bn2.toString());
        Test.areEqual(bn.valueOf(), bn2.valueOf());
    }

    // Round-trip for Infinity and NaN
    var bn = new BigNumber(Infinity);
    obj = bn.toObject();
    obj._isBigNumber = true;
    Test.areEqual('Infinity', new BigNumber(obj).toString());

    bn = new BigNumber(-Infinity);
    obj = bn.toObject();
    obj._isBigNumber = true;
    Test.areEqual('-Infinity', new BigNumber(obj).toString());

    bn = new BigNumber(NaN);
    obj = bn.toObject();
    obj._isBigNumber = true;
    Test.areEqual('NaN', new BigNumber(obj).toString());
});
