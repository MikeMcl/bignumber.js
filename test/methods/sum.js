if (typeof Test === 'undefined') require('../tester');

Test('sum', function () {

    function t() {
        var args = Array.prototype.slice.call(arguments);
        var expected = new BigNumber(args.shift());
        var actual = BigNumber.sum.apply(null, args);
        Test.isTrue(expected.eq(actual) || expected.isNaN() && actual.isNaN());
    }

    var config = BigNumber.config();

    t(0);
    t(0, 0);
    t(0, 0, -0, 0, '-0', 0, new BigNumber(0), 0);
    t(0, -1, 1);
    t(0, 2, 0, '-2');
    t(1, 0, 0, 0, -0, 0, new BigNumber(1));
    t(-1, -2, 0, 0, 0, 0, 1);
    
    t(600, 100, 200, 300);
    t(600, '100', '200', '300');
    t(600, new BigNumber(100), new BigNumber(200), new BigNumber(300));
    t(600, 100, '200', new BigNumber(300));
    t(600, 99.9, 200.05, 300.05);
    t(600, '-666', 670, '-4.99', 0.99, 0.01, new BigNumber('599.99'));
    t('32454566789990000.00034895', 1, 40000, '32454566789950000', -0.001, '0.00034895', new BigNumber(-0.999));
    
    t(Infinity, 1, 2, Infinity, 3);
    t(Infinity, 1, '2', 'Infinity', new BigNumber(3));
    t(Infinity, 1, new BigNumber(Infinity), 2, new BigNumber('Infinity'), 3);
    t(-Infinity, -1, -2, -Infinity, 3);
    t(-Infinity, -1, '-2', '-Infinity', 3);
    t(-Infinity, 1, new BigNumber(-Infinity), -2, new BigNumber('-Infinity'), 3);
    t(NaN, 1, 2, NaN, 3);
    t(NaN, 1, '2', 'NaN', new BigNumber(3));
    t(NaN, new BigNumber(NaN), 2, '3');
    t(NaN, 1, 2, Infinity, new BigNumber(-Infinity), 3);
    t(NaN, 1, new BigNumber(-Infinity), 2, Infinity, 3);

    BigNumber.config({ STRICT: false });
    t(0);
    BigNumber.config({ STRICT: true });
    t(0);

    BigNumber.config(config);
});