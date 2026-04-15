if (typeof Test === 'undefined') require('../tester');

Test('toBigInt', function () {

    if (typeof BigInt == 'undefined') {
        Test.write(' BigInt not supported in this environment\n');
        return;
    }

    function t(expected, value, rm) {
        var actual = new BigNumber(value).toBigInt(rm);
        Test.areEqual(expected, actual);
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        RANGE: 1E9,
        EXPONENTIAL_AT: 1E9
    });

    // Integers
    t(BigInt(0), 0);
    t(BigInt(0), '0');
    t(BigInt(0), -0);
    t(BigInt(0), '-0');
    t(BigInt(1), 1);
    t(BigInt(1), '1');
    t(BigInt(-1), -1);
    t(BigInt(-1), '-1');
    t(BigInt(10), 10);
    t(BigInt(10), '1e1');
    t(BigInt(-10), '-10');
    t(BigInt(100), '100');
    t(BigInt(100), '1e2');
    t(BigInt(12345), 12345);
    t(BigInt(12345), '12345');
    t(BigInt(-12345), -12345);
    t(BigInt(-12345), '-12345');
    t(BigInt('9007199254740991'), '9007199254740991');
    t(BigInt('-9007199254740991'), '-9007199254740991');
    t(BigInt('9007199254740992'), '9007199254740992');
    t(BigInt('123456789012345678901234567890'), '123456789012345678901234567890');
    t(BigInt('-123456789012345678901234567890'), '-123456789012345678901234567890');
    t(BigInt('1' + '0'.repeat(100)), '1e100');
    t(BigInt('-1' + '0'.repeat(100)), '-1e100');

    // Non-finite: return null
    t(null, Infinity);
    t(null, -Infinity);
    t(null, NaN);
    t(null, 'Infinity');
    t(null, '-Infinity');
    t(null, 'NaN');

    // Non-integers: rounded with default ROUNDING_MODE (HALF_UP = 4)
    t(BigInt(1), 0.5);
    t(BigInt(1), 0.7);
    t(BigInt(1), '1.1');
    t(BigInt(1), '1.49999');
    t(BigInt(2), '1.5');
    t(BigInt(0), '0.4');
    t(BigInt(0), '0.49999');
    t(BigInt(-1), '-0.5');
    t(BigInt(-1), '-0.7');
    t(BigInt(-1), '-1.1');
    t(BigInt(-2), '-1.5');
    t(BigInt(0), '-0.4');
    t(BigInt(0), '-0.49999');
    t(BigInt(124), '123.5');
    t(BigInt(-124), '-123.5');

    // Non-integers: explicit rounding mode
    // ROUND_UP = 0
    t(BigInt(1), '0.1', 0);
    t(BigInt(-1), '-0.1', 0);
    t(BigInt(2), '1.1', 0);
    t(BigInt(-2), '-1.1', 0);

    // ROUND_DOWN = 1
    t(BigInt(0), '0.9', 1);
    t(BigInt(0), '-0.9', 1);
    t(BigInt(1), '1.9', 1);
    t(BigInt(-1), '-1.9', 1);

    // ROUND_CEIL = 2
    t(BigInt(1), '0.1', 2);
    t(BigInt(0), '-0.1', 2);
    t(BigInt(2), '1.1', 2);
    t(BigInt(-1), '-1.9', 2);

    // ROUND_FLOOR = 3
    t(BigInt(0), '0.9', 3);
    t(BigInt(-1), '-0.1', 3);
    t(BigInt(1), '1.9', 3);
    t(BigInt(-2), '-1.1', 3);

    // Invalid rounding mode
    Test.isException(function () { new BigNumber(1.5).toBigInt(-1); }, 'toBigInt(-1)');
    Test.isException(function () { new BigNumber(1.5).toBigInt(9); }, 'toBigInt(9)');
    Test.isException(function () { new BigNumber(1.5).toBigInt('a'); }, "toBigInt('a')");
});
