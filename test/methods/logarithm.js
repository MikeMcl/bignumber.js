if (typeof Test === 'undefined') require('../tester');

Test('logarithm', function () {
    var n = 'null',
        N = 'NaN',
        I = 'Infinity';

    function t(number, base, expected) {
        Test.areEqual(String(expected), String(new BigNumber(number).log(base)));
    }

    Test.areEqual(BigNumber.prototype.log, BigNumber.prototype.logBase);

    BigNumber.config({
        DECIMAL_PLACES: 20,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: [-7, 21],
        RANGE: 1E9
    });

		// Edge case tests
		t(I, I, N)
		t(I, '-' + I, N)
		t(0, I, N)
		t(-0, I, N)
		t(I, -0, N)
		t(I, 0, N)
		t(0, 0, N)
		t(1, 0, N)
		t(0, 1, N)
		t(-1, 1, N)
		t(1, -1, N)
		t(I, 1, N)

		// Value Tests
		t(10, 2, '3.3219280948873623479')
		t('10.332323234', '0.434345', '-2.8003741336205112144')
		t(100, 2, '6.6438561897747246957')
		t(1000, 2, '9.9657842846620870436')
		t(10, 4, '1.6609640474436811739')
		t('3.3454545656', '.32764737467657', '-1.0822583142747469393')
		t('9', '3', '2')
		t('4', '2', '2')
		t('95367431640625', '5', '20')
		t(new BigNumber(1).div('95367431640625'), '5', '-20')
		t(new BigNumber(1).div('95367431640625'), '.2', '20')
		t('.47892384765743865096789478675847699', '.83426478236576437584768549685496', '4.0628897799653394675')
		t('47892384765743865096789478675847699', '83426478236576437584768549685496', '1.0864301333053086708')
		t('1', new BigNumber.euler(), '0')
		t(new BigNumber.euler(), new BigNumber.euler(), '1')
});
