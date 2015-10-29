var count = (function config(BigNumber) {
    var start = +new Date(),
        log,
        error,
        obj,
        undefined,
        passed = 0,
        total = 0,
        MAX = 1e9;

    if (typeof window === 'undefined') {
        log = console.log;
        error = console.error;
    } else {
        log = function (str) { document.body.innerHTML += str.replace('\n', '<br>') };
        error = function (str) { document.body.innerHTML += '<div style="color: red">' +
          str.replace('\n', '<br>') + '</div>' };
    }

    if (!BigNumber && typeof require === 'function') BigNumber = require('../bignumber');

    function assert(expected, actual) {
        total++;
        if (expected !== actual) {
           error('\n Test number: ' + total + ' failed');
           error(' Expected: ' + expected);
           error(' Actual:   ' + actual);
           //process.exit();
        }
        else {
            passed++;
            //log('\n Expected and actual: ' + actual);
        }
    }

    function assertException(func, message) {
        var actual;
        total++;
        try {
            func();
        } catch (e) {
            actual = e;
        }
        if (actual && actual.name == 'BigNumber Error') {
            passed++;
            //log('\n Expected and actual: ' + actual);
        } else {
            error('\n Test number: ' + total + ' failed');
            error('\n Expected: ' + message + ' to raise a BigNumber Error.');
            error(' Actual:   ' + (actual || 'no exception'));
            //process.exit();
        }
    }

    log('\n Testing config...');

    obj = BigNumber.config({
        DECIMAL_PLACES: 100,
        ROUNDING_MODE: 0,
        EXPONENTIAL_AT: 50,
        RANGE: 500,
        ERRORS: false
    });

    assert(true, obj.DECIMAL_PLACES === 100 &&
                 obj.ROUNDING_MODE === 0 &&
                 obj.EXPONENTIAL_AT[0] === -50 &&
                 obj.EXPONENTIAL_AT[1] === 50 &&
                 obj.RANGE[0] === -500 &&
                 obj.RANGE[1] === 500 &&
                 obj.ERRORS === false
    );

    obj = BigNumber.config( 99, 8, 32, 333, 1 );

    assert(true, obj.DECIMAL_PLACES === 99 &&
                 obj.ROUNDING_MODE === 8 &&
                 obj.EXPONENTIAL_AT[0] === -32 &&
                 obj.EXPONENTIAL_AT[1] === 32 &&
                 obj.RANGE[0] === -333 &&
                 obj.RANGE[1] === 333 &&
                 obj.ERRORS === true
    );

    obj = BigNumber.config({
        DECIMAL_PLACES: 40,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: 1E9,
        RANGE: 1E9,
        ERRORS: true
    });

    obj = BigNumber.config( null, null, null, null, null );
    obj = BigNumber.config( undefined, undefined, undefined, undefined, undefined );

    assert(true, typeof obj === 'object');
    assert(true, obj.DECIMAL_PLACES === 40);
    assert(true, obj.ROUNDING_MODE === 4);
    assert(true, typeof obj.EXPONENTIAL_AT === 'object');
    assert(true, obj.EXPONENTIAL_AT.length === 2);
    assert(true, obj.EXPONENTIAL_AT[0] === -1e9);
    assert(true, obj.EXPONENTIAL_AT[1] === 1e9);
    assert(true, typeof obj.RANGE === 'object');
    assert(true, obj.RANGE.length === 2);
    assert(true, obj.RANGE[0] === -1e9);
    assert(true, obj.RANGE[1] === 1e9);
    assert(true, obj.ERRORS === true);

    obj = BigNumber.config({EXPONENTIAL_AT: [-7, 21], RANGE: [-324, 308]});

    // DECIMAL_PLACES

    assert(0, BigNumber.config(0).DECIMAL_PLACES);
    assert(1, BigNumber.config(1).DECIMAL_PLACES);
    assert(20, BigNumber.config(20).DECIMAL_PLACES);
    assert(300000, BigNumber.config(300000).DECIMAL_PLACES);
    assert(4e+8, BigNumber.config(4e8).DECIMAL_PLACES);
    assert(123456789, BigNumber.config('123456789').DECIMAL_PLACES);
    assert(MAX, BigNumber.config(MAX).DECIMAL_PLACES);

    assert(0, BigNumber.config({DECIMAL_PLACES: 0}).DECIMAL_PLACES);
    assert(1, BigNumber.config({DECIMAL_PLACES: 1}).DECIMAL_PLACES);
    assert(20, BigNumber.config({DECIMAL_PLACES: 20}).DECIMAL_PLACES);
    assert(300000, BigNumber.config({DECIMAL_PLACES: 300000}).DECIMAL_PLACES);
    assert(4e+8, BigNumber.config({DECIMAL_PLACES: 4e8}).DECIMAL_PLACES);
    assert(123456789, BigNumber.config({DECIMAL_PLACES: '123456789'}).DECIMAL_PLACES);
    assert(2000, BigNumber.config({DECIMAL_PLACES: '2e+3'}).DECIMAL_PLACES);
    assert(MAX, BigNumber.config({DECIMAL_PLACES: MAX}).DECIMAL_PLACES);

    assert(MAX, BigNumber.config(null).DECIMAL_PLACES);
    assert(MAX, BigNumber.config(undefined).DECIMAL_PLACES);
    assert(MAX, BigNumber.config({DECIMAL_PLACES: null}).DECIMAL_PLACES);
    assert(MAX, BigNumber.config({DECIMAL_PLACES: undefined}).DECIMAL_PLACES);

    assertException(function () {BigNumber.config({DECIMAL_PLACES: -1})}, "DECIMAL_PLACES: -1");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: 0.1})}, "DECIMAL_PLACES: 0.1");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: 1.1})}, "DECIMAL_PLACES: 1.1");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: -1.1})}, "DECIMAL_PLACES: -1.1");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: 8.1})}, "DECIMAL_PLACES: 8.1");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: MAX + 1})}, "DECIMAL_PLACES: MAX + 1");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: []})}, "DECIMAL_PLACES: []");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: {}})}, "DECIMAL_PLACES: {}");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: ''})}, "DECIMAL_PLACES: ''");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: ' '})}, "DECIMAL_PLACES: '  '");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: 'hi'})}, "DECIMAL_PLACES: 'hi'");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: '1e+999'})}, "DECIMAL_PLACES: '1e+999'");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: NaN})}, "DECIMAL_PLACES: NaN");
    assertException(function () {BigNumber.config({DECIMAL_PLACES: Infinity})}, "DECIMAL_PLACES: Infinity");

    BigNumber.config({ ERRORS: false });

    assert(1e9, BigNumber.config(-1).DECIMAL_PLACES);
    assert(0, BigNumber.config(0.1).DECIMAL_PLACES);
    assert(1, BigNumber.config(1.99).DECIMAL_PLACES);
    assert(1, BigNumber.config(-1.1).DECIMAL_PLACES);
    assert(8, BigNumber.config(8.7654321).DECIMAL_PLACES);
    assert(8, BigNumber.config(MAX + 1).DECIMAL_PLACES);
    assert(8, BigNumber.config([]).DECIMAL_PLACES);
    assert(8, BigNumber.config({}).DECIMAL_PLACES);
    assert(8, BigNumber.config('').DECIMAL_PLACES);
    assert(8, BigNumber.config(' ').DECIMAL_PLACES);
    assert(8, BigNumber.config('hi').DECIMAL_PLACES);
    assert(MAX, BigNumber.config(MAX.toExponential()).DECIMAL_PLACES);
    assert(MAX, BigNumber.config(NaN).DECIMAL_PLACES);
    assert(MAX, BigNumber.config(Infinity).DECIMAL_PLACES);
    assert(MAX, BigNumber.config(new Date).DECIMAL_PLACES);
    assert(MAX, BigNumber.config(null).DECIMAL_PLACES);
    assert(MAX, BigNumber.config(undefined).DECIMAL_PLACES);

    BigNumber.config({ ERRORS: 1 });

    // ROUNDING_MODE

    assert(0, BigNumber.config(null, 0).ROUNDING_MODE);
    assert(1, BigNumber.config(null, 1).ROUNDING_MODE);
    assert(2, BigNumber.config(null, 2).ROUNDING_MODE);
    assert(3, BigNumber.config(null, 3).ROUNDING_MODE);
    assert(4, BigNumber.config(null, 4).ROUNDING_MODE);
    assert(5, BigNumber.config(null, 5).ROUNDING_MODE);
    assert(6, BigNumber.config(null, 6).ROUNDING_MODE);
    assert(7, BigNumber.config(null, 7).ROUNDING_MODE);
    assert(8, BigNumber.config(null, 8).ROUNDING_MODE);

    assert(0, BigNumber.config({ROUNDING_MODE: 0}).ROUNDING_MODE);
    assert(1, BigNumber.config({ROUNDING_MODE: 1}).ROUNDING_MODE);
    assert(2, BigNumber.config({ROUNDING_MODE: 2}).ROUNDING_MODE);
    assert(3, BigNumber.config({ROUNDING_MODE: 3}).ROUNDING_MODE);
    assert(4, BigNumber.config({ROUNDING_MODE: 4}).ROUNDING_MODE);
    assert(5, BigNumber.config({ROUNDING_MODE: 5}).ROUNDING_MODE);
    assert(6, BigNumber.config({ROUNDING_MODE: 6}).ROUNDING_MODE);
    assert(7, BigNumber.config({ROUNDING_MODE: 7}).ROUNDING_MODE);
    assert(8, BigNumber.config({ROUNDING_MODE: 8}).ROUNDING_MODE);

    assert(8, BigNumber.config(null, null).ROUNDING_MODE);
    assert(8, BigNumber.config(null, undefined).ROUNDING_MODE);
    assert(8, BigNumber.config({ROUNDING_MODE: null}).ROUNDING_MODE);
    assert(8, BigNumber.config({ROUNDING_MODE: undefined}).ROUNDING_MODE);

    assertException(function () {BigNumber.config({ROUNDING_MODE: -1})}, "ROUNDING_MODE: -1");
    assertException(function () {BigNumber.config({ROUNDING_MODE: 0.1})}, "ROUNDING_MODE: 0.1");
    assertException(function () {BigNumber.config({ROUNDING_MODE: 1.1})}, "ROUNDING_MODE: 1.1");
    assertException(function () {BigNumber.config({ROUNDING_MODE: -1.1})}, "ROUNDING_MODE: -1.1");
    assertException(function () {BigNumber.config({ROUNDING_MODE: 8.1})}, "ROUNDING_MODE: 8.1");
    assertException(function () {BigNumber.config({ROUNDING_MODE: 9})}, "ROUNDING_MODE: 9");
    assertException(function () {BigNumber.config({ROUNDING_MODE: 11})}, "ROUNDING_MODE: 11");
    assertException(function () {BigNumber.config({ROUNDING_MODE: []})}, "ROUNDING_MODE: []");
    assertException(function () {BigNumber.config({ROUNDING_MODE: {}})}, "ROUNDING_MODE: {}");
    assertException(function () {BigNumber.config({ROUNDING_MODE: ''})}, "ROUNDING_MODE: ''");
    assertException(function () {BigNumber.config({ROUNDING_MODE: ' '})}, "ROUNDING_MODE: '  '");
    assertException(function () {BigNumber.config({ROUNDING_MODE: 'hi'})}, "ROUNDING_MODE: 'hi'");
    assertException(function () {BigNumber.config({ROUNDING_MODE: NaN})}, "ROUNDING_MODE: NaN");
    assertException(function () {BigNumber.config({ROUNDING_MODE: Infinity})}, "ROUNDING_MODE: Infinity");

    BigNumber.config({ ERRORS: 0 });

    assert(8, BigNumber.config(0, -1).ROUNDING_MODE);
    assert(0, BigNumber.config(0, 0.1).ROUNDING_MODE);
    assert(1, BigNumber.config(0, 1.99).ROUNDING_MODE);
    assert(1, BigNumber.config(0, -1.1).ROUNDING_MODE);
    assert(8, BigNumber.config(0, 8.01).ROUNDING_MODE);
    assert(7, BigNumber.config(0, 7.99).ROUNDING_MODE);
    assert(7, BigNumber.config(0, MAX + 1).ROUNDING_MODE);
    assert(7, BigNumber.config(0, []).ROUNDING_MODE);
    assert(7, BigNumber.config(0, {}).ROUNDING_MODE);
    assert(7, BigNumber.config(0, '').ROUNDING_MODE);
    assert(7, BigNumber.config(0, ' ').ROUNDING_MODE);
    assert(7, BigNumber.config(0, 'hi').ROUNDING_MODE);
    assert(1, BigNumber.config(0, '1e+0').ROUNDING_MODE);
    assert(1, BigNumber.config(0, NaN).ROUNDING_MODE);
    assert(1, BigNumber.config(0, Infinity).ROUNDING_MODE);
    assert(1, BigNumber.config(0, new Date).ROUNDING_MODE);
    assert(1, BigNumber.config(0, null).ROUNDING_MODE);
    assert(1, BigNumber.config(0, undefined).ROUNDING_MODE);

    BigNumber.config({ ERRORS: true });

    // EXPONENTIAL_AT

    assert(true, obj.EXPONENTIAL_AT[0] === -7);
    assert(true, obj.EXPONENTIAL_AT[1] === 21);

    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [0.1, 1]})}, "EXPONENTIAL_AT: [0.1, 1]");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [-1, -0.1]})}, "EXPONENTIAL_AT: [-1, -0.1]");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [1, 1]})}, "EXPONENTIAL_AT: [1, 1]");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [-1, -1]})}, "EXPONENTIAL_AT: [-1, -1]");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: MAX + 1})},  "EXPONENTIAL_AT: MAX + 1");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: -MAX - 1})}, "EXPONENTIAL_AT: -MAX - 1");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [-MAX - 1, MAX]})}, "EXPONENTIAL_AT: [-MAX - 1, MAX]");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [-MAX, MAX + 1]})}, "EXPONENTIAL_AT: [-MAX, MAX + 1]");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [MAX + 1, -MAX - 1]})}, "EXPONENTIAL_AT: [MAX + 1, -MAX - 1]");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [-Infinity, Infinity]})}, "EXPONENTIAL_AT: [Infinity, -Infinity]");
    assertException(function () {BigNumber.config({EXPONENTIAL_AT: [Infinity, -Infinity]})}, "EXPONENTIAL_AT: [Infinity, -Infinity]");

    obj = BigNumber.config();

    assert(true, obj.EXPONENTIAL_AT[0] === -7);
    assert(true, obj.EXPONENTIAL_AT[1] === 21);

    assert(1, BigNumber.config({EXPONENTIAL_AT: 1}).EXPONENTIAL_AT[1]);
    assert(-1, BigNumber.config({EXPONENTIAL_AT: 1}).EXPONENTIAL_AT[0]);

    obj = BigNumber.config({EXPONENTIAL_AT: 0});
    assert(true, obj.EXPONENTIAL_AT[0] === 0 && obj.EXPONENTIAL_AT[1] === 0);

    obj = BigNumber.config({EXPONENTIAL_AT: -1});
    assert(true, obj.EXPONENTIAL_AT[0] === -1 && obj.EXPONENTIAL_AT[1] === 1);

    BigNumber.config({ ERRORS: false });

    assert(1, BigNumber.config(0, 0, -1).EXPONENTIAL_AT[1]);
    assert(0, BigNumber.config(0, 0, 0.1).EXPONENTIAL_AT[0]);
    assert(1, BigNumber.config(0, 0, 1.99).EXPONENTIAL_AT[1]);
    assert(-2, BigNumber.config(0, 0, -2.1).EXPONENTIAL_AT[0]);
    assert(8, BigNumber.config(0, 0, 8.01).EXPONENTIAL_AT[1]);
    assert(-7, BigNumber.config(0, 0, -7.99).EXPONENTIAL_AT[0]);
    assert(7, BigNumber.config(0, 0, MAX + 1).EXPONENTIAL_AT[1]);
    assert(7, BigNumber.config(0, 0, -MAX - 1).EXPONENTIAL_AT[1]);
    assert(-7, BigNumber.config(0, 0, []).EXPONENTIAL_AT[0]);
    assert(7, BigNumber.config(0, 0, {}).EXPONENTIAL_AT[1]);
    assert(-7, BigNumber.config(0, 0, '').EXPONENTIAL_AT[0]);
    assert(7, BigNumber.config(0, 0, ' ').EXPONENTIAL_AT[1]);
    assert(-7, BigNumber.config(0, 0, 'hi').EXPONENTIAL_AT[0]);
    assert(13000, BigNumber.config(0, 0, '1.3e+4').EXPONENTIAL_AT[1]);
    assert(-13000, BigNumber.config(0, 0, NaN).EXPONENTIAL_AT[0]);
    assert(13000, BigNumber.config(0, 0, Infinity).EXPONENTIAL_AT[1]);
    assert(-13000, BigNumber.config(0, 0, new Date).EXPONENTIAL_AT[0]);
    assert(13000, BigNumber.config(0, 0, null).EXPONENTIAL_AT[1]);
    assert(-13000, BigNumber.config(0, 0, undefined).EXPONENTIAL_AT[0]);
    assert(-98765, BigNumber.config(0, 0, 98765.4321).EXPONENTIAL_AT[0]);
    assert(98765, BigNumber.config(0, 0, -98765.4321).EXPONENTIAL_AT[1]);
    assert(1, BigNumber.config(0, 0, [-98765.4321, 1]).EXPONENTIAL_AT[1]);
    assert(-1, BigNumber.config(0, 0, [-1, 98765.4321]).EXPONENTIAL_AT[0]);
    assert(98765, BigNumber.config(0, 0, [-1, 98765.4321]).EXPONENTIAL_AT[1]);
    assert(98765, BigNumber.config(0, 0, [-1, null]).EXPONENTIAL_AT[1]);
    assert(98765, BigNumber.config(0, 0, [null, 98765.4321]).EXPONENTIAL_AT[1]);
    assert(-1, BigNumber.config(0, 0, [null, 98765.4321]).EXPONENTIAL_AT[0]);

    BigNumber.config({ ERRORS: true });

    // RANGE

    assert(true, obj.RANGE[0] === -324);
    assert(true, obj.RANGE[1] === 308);

    assertException(function () {BigNumber.config({RANGE: [-0.9, 1]})}, "RANGE: [-0.9, 1]");
    assertException(function () {BigNumber.config({RANGE: [-1, 0.9]})}, "RANGE: [-1, 0.9]");
    assertException(function () {BigNumber.config({RANGE: [0, 1]})}, "RANGE: [0, 1]");
    assertException(function () {BigNumber.config({RANGE: [-1, 0]})}, "RANGE: [-1, 0]");
    assertException(function () {BigNumber.config({RANGE: 0})}, "RANGE: 0");
    assertException(function () {BigNumber.config({RANGE: MAX + 1})},  "RANGE: MAX + 1");
    assertException(function () {BigNumber.config({RANGE: -MAX - 1})}, "RANGE: -MAX - 1");
    assertException(function () {BigNumber.config({RANGE: [-MAX - 1, MAX + 1]})}, "RANGE: [-MAX - 1, MAX + 1]");
    assertException(function () {BigNumber.config({RANGE: [MAX + 1, -MAX - 1]})}, "RANGE: [MAX + 1, -MAX - 1]");
    assertException(function () {BigNumber.config({RANGE: Infinity})}, "RANGE: Infinity");
    assertException(function () {BigNumber.config({RANGE: "-Infinity"})}, "RANGE: '-Infinity'");
    assertException(function () {BigNumber.config({RANGE: [-Infinity, Infinity]})}, "RANGE: [-Infinity, Infinity]");
    assertException(function () {BigNumber.config({RANGE: [Infinity, -Infinity]})}, "RANGE: [Infinity, -Infinity]");

    obj = BigNumber.config();

    assert(true, obj.RANGE[0] === -324);
    assert(true, obj.RANGE[1] === 308);

    assert(1, BigNumber.config({RANGE: 1}).RANGE[1]);
    assert(-1, BigNumber.config({RANGE: 1}).RANGE[0]);

    obj = BigNumber.config({RANGE: 1});
    assert(true, obj.RANGE[0] === -1 && obj.RANGE[1] === 1);

    obj = BigNumber.config({RANGE: -1});
    assert(true, obj.RANGE[0] === -1 && obj.RANGE[1] === 1);

    BigNumber.config({ ERRORS: 0 });

    assert(1, BigNumber.config(0, 0, 0, -1).RANGE[1]);
    assert(-1, BigNumber.config(0, 0, 0, 0.1).RANGE[0]);
    assert(1, BigNumber.config(0, 0, 0, 1.99).RANGE[1]);
    assert(-2, BigNumber.config(0, 0, 0, -2.1).RANGE[0]);
    assert(8, BigNumber.config(0, 0, 0, 8.01).RANGE[1]);
    assert(-7, BigNumber.config(0, 0, 0, -7.99).RANGE[0]);
    assert(7, BigNumber.config(0, 0, 0, MAX + 1).RANGE[1]);
    assert(7, BigNumber.config(0, 0, 0, -MAX - 1).RANGE[1]);
    assert(-7, BigNumber.config(0, 0, 0, []).RANGE[0]);
    assert(7, BigNumber.config(0, 0, 0, {}).RANGE[1]);
    assert(-7, BigNumber.config(0, 0, 0, '').RANGE[0]);
    assert(7, BigNumber.config(0, 0, 0, ' ').RANGE[1]);
    assert(-7, BigNumber.config(0, 0, 0, 'hi').RANGE[0]);
    assert(13000, BigNumber.config(0, 0, 0, '1.3e+4').RANGE[1]);
    assert(-13000, BigNumber.config(0, 0, 0, NaN).RANGE[0]);
    assert(13000, BigNumber.config(0, 0, 0, Infinity).RANGE[1]);
    assert(-13000, BigNumber.config(0, 0, 0, new Date).RANGE[0]);
    assert(13000, BigNumber.config(0, 0, 0, null).RANGE[1]);
    assert(-13000, BigNumber.config(0, 0, 0, undefined).RANGE[0]);
    assert(-98765, BigNumber.config(0, 0, 0, 98765.4321).RANGE[0]);
    assert(98765, BigNumber.config(0, 0, 0, -98765.4321).RANGE[1]);
    assert(1, BigNumber.config(0, 0, 0, [-98765.4321, 1]).RANGE[1]);
    assert(-1, BigNumber.config(0, 0, 0, [-1, 98765.4321]).RANGE[0]);
    assert(98765, BigNumber.config(0, 0, 0, [-1, 98765.4321]).RANGE[1]);
    assert(98765, BigNumber.config(0, 0, 0, [-1, null]).RANGE[1]);
    assert(98765, BigNumber.config(0, 0, 0, [null, 98765.4321]).RANGE[1]);
    assert(-1, BigNumber.config(0, 0, 0, [null, 98765.4321]).RANGE[0]);

    BigNumber.config({ ERRORS: true });

    // ERRORS

    assert(false, BigNumber.config(null, null, null, null, 0).ERRORS);
    assert(true,  BigNumber.config(null, null, null, null, 1).ERRORS);
    assert(false, BigNumber.config(null, null, null, null, false).ERRORS);
    assert(true,  BigNumber.config(null, null, null, null, true).ERRORS);

    assert(false, BigNumber.config({ERRORS: 0}).ERRORS);
    assert(true,  BigNumber.config({ERRORS: 1}).ERRORS);
    assert(false, BigNumber.config({ERRORS: false}).ERRORS);
    assert(true,  BigNumber.config({ERRORS: true}).ERRORS);

    assert(true,  BigNumber.config(null, null, null, null, null).ERRORS);
    assert(true,  BigNumber.config(null, null, null, null, undefined).ERRORS);
    assert(true,  BigNumber.config({ERRORS: null}).ERRORS);
    assert(true,  BigNumber.config({ERRORS: undefined}).ERRORS);

    assertException(function () {BigNumber.config({ERRORS: 'hiya'})}, "ERRORS: 'hiya'");
    assertException(function () {BigNumber.config({ERRORS: 'true'})}, "ERRORS: 'true'");
    assertException(function () {BigNumber.config({ERRORS: 'false'})}, "ERRORS: 'false'");
    assertException(function () {BigNumber.config({ERRORS: '0'})}, "ERRORS: '0'");
    assertException(function () {BigNumber.config({ERRORS: '1'})}, "ERRORS: '1'");
    assertException(function () {BigNumber.config({ERRORS: -1})}, "ERRORS: -1");
    assertException(function () {BigNumber.config({ERRORS: 0.1})}, "ERRORS: 0.1");
    assertException(function () {BigNumber.config({ERRORS: 1.1})}, "ERRORS: 1.1");
    assertException(function () {BigNumber.config({ERRORS: []})}, "ERRORS: []");
    assertException(function () {BigNumber.config({ERRORS: {}})}, "ERRORS: {}");
    assertException(function () {BigNumber.config({ERRORS: ''})}, "ERRORS: ''");
    assertException(function () {BigNumber.config({ERRORS: ' '})}, "ERRORS: '  '");
    assertException(function () {BigNumber.config({ERRORS: NaN})}, "ERRORS: NaN");
    assertException(function () {BigNumber.config({ERRORS: Infinity})}, "ERRORS: Infinity");

    assert(true,  BigNumber.config().ERRORS);

    BigNumber.config({ ERRORS: false });

    assert(false, BigNumber.config(null, null, null, null, 0).ERRORS);
    assert(false, BigNumber.config(null, null, null, null, 1.1).ERRORS);
    assert(false, BigNumber.config(null, null, null, null, false).ERRORS);
    assert(true,  BigNumber.config(null, null, null, null, 1).ERRORS);
    assert(false, BigNumber.config(null, null, null, null, 0).ERRORS);
    assert(false, BigNumber.config(null, null, null, null, '1').ERRORS);
    assert(false, BigNumber.config(null, null, null, null, 'true').ERRORS);
    assert(false, BigNumber.config(null, null, null, null, false).ERRORS);
    assert(false, BigNumber.config({ERRORS: null}).ERRORS);
    assert(false, BigNumber.config({ERRORS: undefined}).ERRORS);
    assert(false, BigNumber.config({ERRORS: NaN}).ERRORS);
    assert(false, BigNumber.config({ERRORS: 'd'}).ERRORS);
    assert(false, BigNumber.config({ERRORS: []}).ERRORS);
    assert(false, BigNumber.config({ERRORS: {}}).ERRORS);
    assert(false, BigNumber.config({ERRORS: new Date}).ERRORS);
    assert(true, BigNumber.config({ERRORS: Boolean(1)}).ERRORS);
    assert(true, BigNumber.config({ERRORS: Boolean(true)}).ERRORS);
    assert(false, BigNumber.config({ERRORS: Boolean(0)}).ERRORS);
    assert(false, BigNumber.config({ERRORS: Boolean(false)}).ERRORS);
    assert(true, BigNumber.config({ERRORS: Boolean('false')}).ERRORS);

    // FORMAT

    assertException(function () {BigNumber.config({FORMAT: ''})}, "FORMAT: ''");
    assertException(function () {BigNumber.config({FORMAT: 1})}, "FORMAT: 1");

    obj = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: '\xA0',
        fractionGroupSize: 0
    };

    assert(obj, BigNumber.config({FORMAT: obj}).FORMAT);

    assert('.', BigNumber.config().FORMAT.decimalSeparator);
    obj.decimalSeparator = ',';
    assert(',', BigNumber.config().FORMAT.decimalSeparator);

    assert(obj, BigNumber.config({FORMAT: null}).FORMAT);

    BigNumber.config({ ERRORS: false });
    assert(obj, BigNumber.config({FORMAT: 2}).FORMAT);

    // Test constructor parsing.

    BigNumber.config({
        DECIMAL_PLACES: 40,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: 1E9,
        RANGE: 1E9,
        ERRORS: true
    });

    assert('Infinity', new BigNumber('1e10000000000').toString());
    assert('-Infinity', new BigNumber('-1e10000000000').toString());
    assert('0', new BigNumber('1e-10000000000').toString());
    assert('0', new BigNumber('-1e-10000000000').toString());

    assert('NaN', new BigNumber(NaN).toString());
    assert('NaN', new BigNumber('NaN').toString());
    assert('NaN', new BigNumber(' NaN').toString());
    assert('NaN', new BigNumber('NaN ').toString());
    assert('NaN', new BigNumber(' NaN ').toString());
    assert('NaN', new BigNumber('+NaN').toString());
    assert('NaN', new BigNumber(' +NaN').toString());
    assert('NaN', new BigNumber('+NaN ').toString());
    assert('NaN', new BigNumber(' +NaN ').toString());
    assert('NaN', new BigNumber('-NaN').toString());
    assert('NaN', new BigNumber(' -NaN').toString());
    assert('NaN', new BigNumber('-NaN ').toString());
    assert('NaN', new BigNumber(' -NaN ').toString());

    assertException(function () {new BigNumber('+ NaN')}, "+ NaN");
    assertException(function () {new BigNumber('- NaN')}, "- NaN");
    assertException(function () {new BigNumber(' + NaN')}, " + NaN");
    assertException(function () {new BigNumber(' - NaN')}, " - NaN");
    assertException(function () {new BigNumber('. NaN')}, ". NaN");
    assertException(function () {new BigNumber('.-NaN')}, ".-NaN");
    assertException(function () {new BigNumber('.+NaN')}, ".+NaN");
    assertException(function () {new BigNumber('-.NaN')}, "-.NaN");
    assertException(function () {new BigNumber('+.NaN')}, "+.NaN");

    assert('Infinity', new BigNumber(Infinity).toString());
    assert('Infinity', new BigNumber('Infinity').toString());
    assert('Infinity', new BigNumber(' Infinity').toString());
    assert('Infinity', new BigNumber('Infinity ').toString());
    assert('Infinity', new BigNumber(' Infinity ').toString());
    assert('Infinity', new BigNumber('+Infinity').toString());
    assert('Infinity', new BigNumber(' +Infinity').toString());
    assert('Infinity', new BigNumber('+Infinity ').toString());
    assert('Infinity', new BigNumber(' +Infinity ').toString());
    assert('-Infinity', new BigNumber('-Infinity').toString());
    assert('-Infinity', new BigNumber(' -Infinity').toString());
    assert('-Infinity', new BigNumber('-Infinity ').toString());
    assert('-Infinity', new BigNumber(' -Infinity ').toString());

    assertException(function () {new BigNumber('+ Infinity')}, "+ Infinity");
    assertException(function () {new BigNumber(' + Infinity')}, " + Infinity");
    assertException(function () {new BigNumber('- Infinity')}, "- Infinity");
    assertException(function () {new BigNumber(' - Infinity')}, " - Infinity");
    assertException(function () {new BigNumber('.Infinity')}, ".Infinity");
    assertException(function () {new BigNumber('. Infinity')}, ". Infinity");
    assertException(function () {new BigNumber('.-Infinity')}, ".-Infinity");
    assertException(function () {new BigNumber('.+Infinity')}, ".+Infinity");
    assertException(function () {new BigNumber('-.Infinity')}, "-.Infinity");
    assertException(function () {new BigNumber('+.Infinity')}, "+.Infinity");

    assert('0', new BigNumber(0).toString());
    assert('0', new BigNumber(-0).toString());
    assert('0', new BigNumber('.0').toString());
    assert('0', new BigNumber('0.').toString());
    assert('0', new BigNumber('-0.').toString());
    assert('0', new BigNumber('+0.').toString());
    assert('0', new BigNumber('+0').toString());
    assert('0', new BigNumber('-0').toString());
    assert('0', new BigNumber(' +0').toString());
    assert('0', new BigNumber(' -0').toString());
    assert('0', new BigNumber(' +0 ').toString());
    assert('0', new BigNumber(' -0 ').toString());
    assert('0', new BigNumber('+.0').toString());
    assert('0', new BigNumber('-.0').toString());
    assert('0', new BigNumber(' +.0').toString());
    assert('0', new BigNumber(' -.0').toString());
    assert('0', new BigNumber(' +.0 ').toString());
    assert('0', new BigNumber(' -.0 ').toString());

    assertException(function () {new BigNumber('+-0')}, "+-0");
    assertException(function () {new BigNumber('-+0')}, "-+0");
    assertException(function () {new BigNumber('--0')}, "--0");
    assertException(function () {new BigNumber('++0')}, "++0");
    assertException(function () {new BigNumber('.-0')}, ".-0");
    assertException(function () {new BigNumber('.+0')}, ".+0");
    assertException(function () {new BigNumber('0 .')}, "0 .");
    assertException(function () {new BigNumber('. 0')}, ". 0");
    assertException(function () {new BigNumber('..0')}, "..0");
    assertException(function () {new BigNumber('+.-0')}, "+.-0");
    assertException(function () {new BigNumber('-.+0')}, "-.+0");
    assertException(function () {new BigNumber('+. 0')}, "+. 0");
    assertException(function () {new BigNumber('-. 0')}, "-. 0");

    assert('2', new BigNumber('+2').toString());
    assert('-2', new BigNumber('-2').toString());
    assert('2', new BigNumber(' +2').toString());
    assert('-2', new BigNumber(' -2').toString());
    assert('2', new BigNumber(' +2 ').toString());
    assert('-2', new BigNumber(' -2 ').toString());
    assert('0.2', new BigNumber('.2').toString());
    assert('2', new BigNumber('2.').toString());
    assert('-2', new BigNumber('-2.').toString());
    assert('2', new BigNumber('+2.').toString());
    assert('0.2', new BigNumber('+.2').toString());
    assert('-0.2', new BigNumber('-.2').toString());
    assert('0.2', new BigNumber(' +.2').toString());
    assert('-0.2', new BigNumber(' -.2').toString());
    assert('0.2', new BigNumber(' +.2 ').toString());
    assert('-0.2', new BigNumber(' -.2 ').toString());

    assertException(function () {new BigNumber('+-2')}, "+-2");
    assertException(function () {new BigNumber('-+2')}, "-+2");
    assertException(function () {new BigNumber('--2')}, "--2");
    assertException(function () {new BigNumber('++2')}, "++2");
    assertException(function () {new BigNumber('.-2')}, ".-2");
    assertException(function () {new BigNumber('.+2')}, ".+2");
    assertException(function () {new BigNumber('2 .')}, "2 .");
    assertException(function () {new BigNumber('. 2')}, ". 2");
    assertException(function () {new BigNumber('..2')}, "..2");
    assertException(function () {new BigNumber('+.-2')}, "+.-2");
    assertException(function () {new BigNumber('-.+2')}, "-.+2");
    assertException(function () {new BigNumber('+. 2')}, "+. 2");
    assertException(function () {new BigNumber('-. 2')}, "-. 2");

    assertException(function () {new BigNumber('+2..')}, "+2..");
    assertException(function () {new BigNumber('-2..')}, "-2..");
    assertException(function () {new BigNumber('-.2.')}, "-.2.");
    assertException(function () {new BigNumber('+.2.')}, "+.2.");
    assertException(function () {new BigNumber('.-20.')}, ".-20.");
    assertException(function () {new BigNumber('.+20.')}, ".+20.");
    assertException(function () {new BigNumber('. 20.')}, ". 20.");

    assertException(function () {new BigNumber(undefined)}, "undefined");
    assertException(function () {new BigNumber([])}, "[]");
    assertException(function () {new BigNumber('')}, "''");
    assertException(function () {new BigNumber(null)}, "null");
    assertException(function () {new BigNumber(' ')}, "' '");
    assertException(function () {new BigNumber('nan')}, "nan");
    assertException(function () {new BigNumber('23er')}, "23er");
    assertException(function () {new BigNumber('e4')}, "e4");
    assertException(function () {new BigNumber('0x')}, "0x");
    assertException(function () {new BigNumber('0x.')}, "0x.");
    assertException(function () {new BigNumber('+0x')}, "+0x");
    assertException(function () {new BigNumber('.0x1')}, ".0x1");
    assertException(function () {new BigNumber('.0x1', 16)}, ".0x1, 16");
    assertException(function () {new BigNumber('. 0x1')}, ". 0x1");
    assertException(function () {new BigNumber('0x1', 15)}, "0x1, 15");
    assertException(function () {new BigNumber('0b')}, "0b");
    assertException(function () {new BigNumber('+0b')}, "+0b");
    assertException(function () {new BigNumber('0b.')}, "0b.");
    assertException(function () {new BigNumber('.0b1')}, ".0b1");
    assertException(function () {new BigNumber('. 0b1 ')}, ". 0b1 ");
    assertException(function () {new BigNumber('0b1', 3)}, "0b1, 3");
    assertException(function () {new BigNumber('0o')}, "0o");
    assertException(function () {new BigNumber('0o.')}, "0o.");
    assertException(function () {new BigNumber('.0o1')}, ".0o1");
    assertException(function () {new BigNumber('.0o1')}, ".0o1");
    assertException(function () {new BigNumber('0 o1')}, "0 o1");
    assertException(function () {new BigNumber('0o 1')}, "0o 1");
    assertException(function () {new BigNumber('0-o1')}, "0o-1");
    assertException(function () {new BigNumber('0o1', 16)}, "001, 16");
    assertException(function () {new BigNumber('--45')}, "--45");
    assertException(function () {new BigNumber('+-2')}, "+-2");
    assertException(function () {new BigNumber('0 0')}, "0 0");

    assert('15', new BigNumber('0xf', 16).toString());
    assert('-10', new BigNumber('-0xa').toString());
    assert('255', new BigNumber('0xff').toString());
    assert('-3294', new BigNumber('-0xcde').toString());
    assert('15.5', new BigNumber('0xf.8').toString());

    assert('1', new BigNumber('0b1.', 2).toString());
    assert('0', new BigNumber('0b0').toString());
    assert('-1', new BigNumber('-0b1').toString());
    assert('3', new BigNumber('0b11').toString());
    assert('-11', new BigNumber('-0b1011').toString());
    assert('1.5', new BigNumber('0b1.1').toString());

    assert('-1', new BigNumber('   -0o1  ', 8).toString());
    assert('0', new BigNumber('-0o0').toString());
    assert('1', new BigNumber('0o1').toString());
    assert('63', new BigNumber('0o77').toString());
    assert('-102', new BigNumber('-0o146').toString());
    assert('0.5', new BigNumber('0o0.4').toString());

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];;
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;