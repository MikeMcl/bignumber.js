if (typeof Test === 'undefined') require('../tester');

Test('isBigNumber', function () {

    function t(expected, value){
        Test.areEqual(expected, BigNumber.isBigNumber(value));
    }

    function tx(fn, msg){
        Test.isException(fn, msg);
    }

    t(false, void 0);
    t(false, null);
    t(false, '0');
    t(false, 0);
    t(false, 1);
    t(false, NaN);
    t(false, []);
    t(false, {});

    t(true, new BigNumber(0));
    t(true, new BigNumber('0'));
    t(true, new BigNumber(1));
    t(true, new BigNumber('1'));

    var AnotherBigNumber = BigNumber.clone();
    t(true, new AnotherBigNumber(0));
    t(true, new AnotherBigNumber('0'));
    t(true, new AnotherBigNumber(1));
    t(true, new AnotherBigNumber('1'));

    t(false, {c: null, e: null, s: null});
    t(false, {c: null, e: null, s: 1});
    t(false, {c: null, e: null, s: -1});

    t(true, {c: null, e: null, s: null, _isBigNumber: true});          // NaN
    t(true, {c: null, e: null, s: 1, _isBigNumber: true});             // Infinity
    t(true, {c: null, e: null, s: -1, _isBigNumber: true});            // -Infinity

    tx(function () {BigNumber.isBigNumber({c: undefined, e: null, s: null, _isBigNumber: true})}, "{c: undefined, e: null, s: null, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: undefined, e: null, s: null, _isBigNumber: true})}, "{c: undefined, e: null, s: null, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: null, e: undefined, s: null, _isBigNumber: true})}, "{c: null, e: undefined, s: null, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: null, e: null, s: undefined, _isBigNumber: true})}, "{c: null, e: null, s: undefined, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: null, e: 1, s: 0, _isBigNumber: true})}, "{c: null, e: 1, s: 0, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: null, e: 1, s: null, _isBigNumber: true})}, "{c: null, e: 1, s: null, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: 1, s: null, _isBigNumber: true})}, "{c: [1], e: 1, s: null, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: null, s: null, _isBigNumber: true})}, "{c: [1], e: null, s: null, _isBigNumber: true}");

    tx(function () {BigNumber.isBigNumber({c: [0, 1], e: 0, s: 1, _isBigNumber: true})}, "{c: [0, 1], e: 0, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [0, 0], e: 0, s: 1, _isBigNumber: true})}, "{c: [0, 0], e: 0, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [0, 0, 1], e: 0, s: 1, _isBigNumber: true})}, "{c: [0, 0, 1], e: 0, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1, 0], e: 0, s: 1, _isBigNumber: true})}, "{c: [1, 0], e: 0, s: 1, _isBigNumber: true}");

    t(true, {c: [0], e: 0, s: 1, _isBigNumber: true});                 // 0

    tx(function () {BigNumber.isBigNumber({c: [0], e: 1, s: 1, _isBigNumber: true})}, "{c: [0], e: 1, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [0], e: -1, s: 1, _isBigNumber: true})}, "{c: [0], e: -1, s: 1, _isBigNumber: true}");

    t(true, {c: [1], e: 0, s: 1, _isBigNumber: true});                 // 1
    t(true, {c: [1], e: 0, s: -1, _isBigNumber: true});                // -1

    tx(function () {BigNumber.isBigNumber({c: [1], e: 1, s: 1, _isBigNumber: true})}, "{c: [1], e: 1, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: 1, s: 1, _isBigNumber: true})}, "{c: [1], e: 1, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: ['1'], e: 0, s: 1, _isBigNumber: true})}, "{c: ['1'], e: 0, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: '0', s: 1, _isBigNumber: true})}, "{c: [1], e: '0', s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: 0, s: '0', _isBigNumber: true})}, "{c: [1], e: 0, s: '0', _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: ['1'], e: undefined, s: 1, _isBigNumber: true})}, "{c: ['1'], e: undefined, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1.1], e: 0, s: 1, _isBigNumber: true})}, "{c: [1.1], e: 0, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: 0.1, s: 1, _isBigNumber: true})}, "{c: [1], e: 0.1, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: 0, s: 1.1, _isBigNumber: true})}, "{c: [1], e: 0, s: 1.1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: 0, s: -1.1, _isBigNumber: true})}, "{c: [1], e: 0, s: -1.1, _isBigNumber: true}");

    t(true, {c: [10], e: 1, s: 1, _isBigNumber: true});                // 10

    tx(function () {BigNumber.isBigNumber({c: [10], e: 0, s: 1, _isBigNumber: true})}, "{c: [10], e: 0, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [1], e: 1, s: 1, _isBigNumber: true})}, "{c: [1], e: 1, s: 1, _isBigNumber: true}");

    t(true, {c: [10000000000000], e: 13, s: 1, _isBigNumber: true});   // 1e13

    tx(function () {BigNumber.isBigNumber({c: [1], e: 13, s: 1, _isBigNumber: true})}, "{c: [1], e: 13, s: 1, _isBigNumber: true}");

    t(true, {c: [99999999999999], e: 13, s: 1, _isBigNumber: true});   // 99999999999999

    t(true, {c: [1], e: 14, s: 1, _isBigNumber: true});                // 100000000000000

    tx(function () {BigNumber.isBigNumber({c: [100000000000000], e: 14, s: 1, _isBigNumber: true})}, "{c: [100000000000000], e: 14, s: 1, _isBigNumber: true}");
    tx(function () {BigNumber.isBigNumber({c: [100000000000000], e: 0, s: 1, _isBigNumber: true})}, "{c: [100000000000000], e: 0, s: 1, _isBigNumber: true}");

    t(true, {c: [1e13], e: -1, s: -1, _isBigNumber: true});            // 0.1

    tx(function () {BigNumber.isBigNumber({c: [1], e: -1, s: -1, _isBigNumber: true})}, "{c: [1], e: -1, s: -1, _isBigNumber: true}");

    t(true, {c: [98700000], e: -7, s: -1, _isBigNumber: true});        // -0.000000987

    tx(function () {BigNumber.isBigNumber({c: [987], e: -7, s: -1, _isBigNumber: true})}, "{c: [987], e: -7, s: -1, _isBigNumber: true}");

    t(true, {c: [9, 9, 9], e: 14, s: 1, _isBigNumber: true});          // 900000000000009.00000000000009

    tx(function () {BigNumber.isBigNumber({c: [900000000000009, 9], e: 14, s: 1, _isBigNumber: true})}, "{c: [900000000000009, 9], e: 14, s: 1, _isBigNumber: true}");
});
