if (typeof Test === 'undefined') require('../tester');

Test('sum', function () {

    function t(expected, value){
        Test.isTrue(expected.eq(value));
    }

    var expectedSum = new BigNumber(600);
    t(expectedSum, BigNumber.sum(100, 200, 300));
    t(expectedSum, BigNumber.sum('100', '200', '300'));
    t(expectedSum, BigNumber.sum(new BigNumber(100), new BigNumber(200), new BigNumber(300)));
    t(expectedSum, BigNumber.sum(100, '200', new BigNumber(300)));
    t(expectedSum, BigNumber.sum(99.9, 200.05, 300.05));
});