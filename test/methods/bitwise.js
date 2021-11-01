if (typeof Test === 'undefined') require('../tester');

Test('bitShiftLeft', function () {
    function t(a, b, expected) {
        Test.areEqual(String(expected), String(new BigNumber(a).bitShiftLeft(b)));
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        RANGE: 1E9,
        EXPONENTIAL_AT: [-7, 21]
    });

    t(5, 1, 10);
    t(1, 1, 2);
    t(1, 1, 2);
});

Test('bitShiftRight', function () {
    function t(a, b, expected) {
        Test.areEqual(String(expected), String(new BigNumber(a).bitShiftRight(b)));
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        RANGE: 1E9,
        EXPONENTIAL_AT: [-7, 21]
    });

    t(5, 1, 2);
    t(1, 1, 0);
});

Test('and', function () {
    function t(a, b, expected) {
        Test.areEqual(String(expected), String(new BigNumber(a).and(b)));
    }

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        RANGE: 1E9,
        EXPONENTIAL_AT: [-7, 21]
    });

    t(0, 0, 0);
    t(1, 1, 1);
    t(82, 272, 16);
    t(9, 57, 9);
});