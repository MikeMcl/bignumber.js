if (typeof Test === 'undefined') require('../tester');

Test('isBigNumber', function () {

    function t(expected, value){
        Test.areEqual(expected, BigNumber.isBigNumber(value));
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
});
