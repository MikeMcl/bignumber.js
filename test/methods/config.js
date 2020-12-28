if (typeof Test === 'undefined') require('../tester');

Test('config', function () {
    var MAX = 1e9;

    function t(expected, value){
        Test.areEqual(expected, value);
    }

    function tx(fn, msg){
        Test.isException(fn, msg);
    }

    t(BigNumber.config, BigNumber.set);

    var obj = BigNumber.config({
        DECIMAL_PLACES: 100,
        ROUNDING_MODE: 0,
        EXPONENTIAL_AT: 50,
        RANGE: 500
    });

    Test.isTrue(
        obj.DECIMAL_PLACES === 100 &&
        obj.ROUNDING_MODE === 0 &&
        obj.EXPONENTIAL_AT[0] === -50 &&
        obj.EXPONENTIAL_AT[1] === 50 &&
        obj.RANGE[0] === -500 &&
        obj.RANGE[1] === 500
    );

    obj = BigNumber.config({
        DECIMAL_PLACES: 40,
        ROUNDING_MODE: 4,
        EXPONENTIAL_AT: 1E9,
        RANGE: 1E9
    });

    t('object', typeof obj);
    t(40, obj.DECIMAL_PLACES);
    t(4, obj.ROUNDING_MODE);
    t('object', typeof obj.EXPONENTIAL_AT);
    t(2, obj.EXPONENTIAL_AT.length);
    t(-1e9, obj.EXPONENTIAL_AT[0]);
    t(1e9, obj.EXPONENTIAL_AT[1]);
    t('object', typeof obj.RANGE);
    t(2, obj.RANGE.length);
    t(-1e9, obj.RANGE[0]);
    t(1e9, obj.RANGE[1]);

    obj = BigNumber.config({EXPONENTIAL_AT: [-7, 21], RANGE: [-324, 308]});

    // DECIMAL_PLACES

    t(0, BigNumber.config({DECIMAL_PLACES: 0}).DECIMAL_PLACES);
    t(1, BigNumber.config({DECIMAL_PLACES: 1}).DECIMAL_PLACES);
    t(20, BigNumber.config({DECIMAL_PLACES: 20}).DECIMAL_PLACES);
    t(300000, BigNumber.config({DECIMAL_PLACES: 300000}).DECIMAL_PLACES);
    t(4e+8, BigNumber.config({DECIMAL_PLACES: 4e8}).DECIMAL_PLACES);
    t(123456789, BigNumber.config({DECIMAL_PLACES: 123456789}).DECIMAL_PLACES);
    t(2000, BigNumber.config({DECIMAL_PLACES: 2e+3}).DECIMAL_PLACES);
    t(MAX, BigNumber.config({DECIMAL_PLACES: MAX}).DECIMAL_PLACES);

    tx(function () {BigNumber.config({DECIMAL_PLACES: -1})}, "DECIMAL_PLACES: -1");
    tx(function () {BigNumber.config({DECIMAL_PLACES: 0.1})}, "DECIMAL_PLACES: 0.1");
    tx(function () {BigNumber.config({DECIMAL_PLACES: 1.1})}, "DECIMAL_PLACES: 1.1");
    tx(function () {BigNumber.config({DECIMAL_PLACES: -1.1})}, "DECIMAL_PLACES: -1.1");
    tx(function () {BigNumber.config({DECIMAL_PLACES: 8.1})}, "DECIMAL_PLACES: 8.1");
    tx(function () {BigNumber.config({DECIMAL_PLACES: MAX + 1})}, "DECIMAL_PLACES: MAX + 1");
    tx(function () {BigNumber.config({DECIMAL_PLACES: []})}, "DECIMAL_PLACES: []");
    tx(function () {BigNumber.config({DECIMAL_PLACES: {}})}, "DECIMAL_PLACES: {}");
    tx(function () {BigNumber.config({DECIMAL_PLACES: ''})}, "DECIMAL_PLACES: ''");
    tx(function () {BigNumber.config({DECIMAL_PLACES: ' '})}, "DECIMAL_PLACES: '  '");
    tx(function () {BigNumber.config({DECIMAL_PLACES: 'hi'})}, "DECIMAL_PLACES: 'hi'");
    tx(function () {BigNumber.config({DECIMAL_PLACES: '1e+999'})}, "DECIMAL_PLACES: '1e+999'");
    tx(function () {BigNumber.config({DECIMAL_PLACES: NaN})}, "DECIMAL_PLACES: NaN");
    tx(function () {BigNumber.config({DECIMAL_PLACES: Infinity})}, "DECIMAL_PLACES: Infinity");
    tx(function () {BigNumber.config({DECIMAL_PLACES: null})}, "DECIMAL_PLACES: null");
    tx(function () {BigNumber.config({DECIMAL_PLACES: undefined})}, "DECIMAL_PLACES: undefined");

    BigNumber.config({DECIMAL_PLACES: 40});

    // ROUNDING_MODE

    t(0, BigNumber.config({ROUNDING_MODE: 0}).ROUNDING_MODE);
    t(1, BigNumber.config({ROUNDING_MODE: 1}).ROUNDING_MODE);
    t(2, BigNumber.config({ROUNDING_MODE: 2}).ROUNDING_MODE);
    t(3, BigNumber.config({ROUNDING_MODE: 3}).ROUNDING_MODE);
    t(4, BigNumber.config({ROUNDING_MODE: 4}).ROUNDING_MODE);
    t(5, BigNumber.config({ROUNDING_MODE: 5}).ROUNDING_MODE);
    t(6, BigNumber.config({ROUNDING_MODE: 6}).ROUNDING_MODE);
    t(7, BigNumber.config({ROUNDING_MODE: 7}).ROUNDING_MODE);
    t(8, BigNumber.config({ROUNDING_MODE: 8}).ROUNDING_MODE);

    t(8, BigNumber.config(null).ROUNDING_MODE);
    t(8, BigNumber.config(undefined).ROUNDING_MODE);

    tx(function () {BigNumber.config({ROUNDING_MODE: -1})}, "ROUNDING_MODE: -1");
    tx(function () {BigNumber.config({ROUNDING_MODE: 0.1})}, "ROUNDING_MODE: 0.1");
    tx(function () {BigNumber.config({ROUNDING_MODE: 1.1})}, "ROUNDING_MODE: 1.1");
    tx(function () {BigNumber.config({ROUNDING_MODE: -1.1})}, "ROUNDING_MODE: -1.1");
    tx(function () {BigNumber.config({ROUNDING_MODE: 8.1})}, "ROUNDING_MODE: 8.1");
    tx(function () {BigNumber.config({ROUNDING_MODE: 9})}, "ROUNDING_MODE: 9");
    tx(function () {BigNumber.config({ROUNDING_MODE: 11})}, "ROUNDING_MODE: 11");
    tx(function () {BigNumber.config({ROUNDING_MODE: []})}, "ROUNDING_MODE: []");
    tx(function () {BigNumber.config({ROUNDING_MODE: {}})}, "ROUNDING_MODE: {}");
    tx(function () {BigNumber.config({ROUNDING_MODE: ''})}, "ROUNDING_MODE: ''");
    tx(function () {BigNumber.config({ROUNDING_MODE: ' '})}, "ROUNDING_MODE: '  '");
    tx(function () {BigNumber.config({ROUNDING_MODE: 'hi'})}, "ROUNDING_MODE: 'hi'");
    tx(function () {BigNumber.config({ROUNDING_MODE: NaN})}, "ROUNDING_MODE: NaN");
    tx(function () {BigNumber.config({ROUNDING_MODE: Infinity})}, "ROUNDING_MODE: Infinity");
    tx(function () {BigNumber.config({ROUNDING_MODE: null})}, "ROUNDING_MODE: null");
    tx(function () {BigNumber.config({ROUNDING_MODE: undefined})}, "ROUNDING_MODE: undefined");

    // EXPONENTIAL_AT

    t(-7, obj.EXPONENTIAL_AT[0]);
    t(21, obj.EXPONENTIAL_AT[1]);

    tx(function () {BigNumber.config({EXPONENTIAL_AT: [0.1, 1]})}, "EXPONENTIAL_AT: [0.1, 1]");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: [-1, -0.1]})}, "EXPONENTIAL_AT: [-1, -0.1]");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: [1, 1]})}, "EXPONENTIAL_AT: [1, 1]");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: [-1, -1]})}, "EXPONENTIAL_AT: [-1, -1]");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: MAX + 1})},  "EXPONENTIAL_AT: MAX + 1");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: -MAX - 1})}, "EXPONENTIAL_AT: -MAX - 1");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: [-MAX - 1, MAX]})}, "EXPONENTIAL_AT: [-MAX - 1, MAX]");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: [-MAX, MAX + 1]})}, "EXPONENTIAL_AT: [-MAX, MAX + 1]");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: [MAX + 1, -MAX - 1]})}, "EXPONENTIAL_AT: [MAX + 1, -MAX - 1]");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: [-Infinity, Infinity]})}, "EXPONENTIAL_AT: [Infinity, -Infinity]");
    tx(function () {BigNumber.config({EXPONENTIAL_AT: [Infinity, -Infinity]})}, "EXPONENTIAL_AT: [Infinity, -Infinity]");

    obj = BigNumber.config();

    t(-7, obj.EXPONENTIAL_AT[0]);
    t(21, obj.EXPONENTIAL_AT[1]);

    t(1, BigNumber.config({EXPONENTIAL_AT: 1}).EXPONENTIAL_AT[1]);
    t(-1, BigNumber.config({EXPONENTIAL_AT: 1}).EXPONENTIAL_AT[0]);

    obj = BigNumber.config({EXPONENTIAL_AT: 0});
    Test.isTrue(obj.EXPONENTIAL_AT[0] === 0 && obj.EXPONENTIAL_AT[1] === 0);

    obj = BigNumber.config({EXPONENTIAL_AT: -1});
    Test.isTrue(obj.EXPONENTIAL_AT[0] === -1 && obj.EXPONENTIAL_AT[1] === 1);

    // RANGE

    BigNumber.config({EXPONENTIAL_AT: [-7, 21], RANGE: [-324, 308]});

    t(-324, obj.RANGE[0]);
    t(308, obj.RANGE[1]);

    tx(function () {BigNumber.config({RANGE: [-0.9, 1]})}, "RANGE: [-0.9, 1]");
    tx(function () {BigNumber.config({RANGE: [-1, 0.9]})}, "RANGE: [-1, 0.9]");
    tx(function () {BigNumber.config({RANGE: [0, 1]})}, "RANGE: [0, 1]");
    tx(function () {BigNumber.config({RANGE: [-1, 0]})}, "RANGE: [-1, 0]");
    tx(function () {BigNumber.config({RANGE: 0})}, "RANGE: 0");
    tx(function () {BigNumber.config({RANGE: MAX + 1})},  "RANGE: MAX + 1");
    tx(function () {BigNumber.config({RANGE: -MAX - 1})}, "RANGE: -MAX - 1");
    tx(function () {BigNumber.config({RANGE: [-MAX - 1, MAX + 1]})}, "RANGE: [-MAX - 1, MAX + 1]");
    tx(function () {BigNumber.config({RANGE: [MAX + 1, -MAX - 1]})}, "RANGE: [MAX + 1, -MAX - 1]");
    tx(function () {BigNumber.config({RANGE: Infinity})}, "RANGE: Infinity");
    tx(function () {BigNumber.config({RANGE: "-Infinity"})}, "RANGE: '-Infinity'");
    tx(function () {BigNumber.config({RANGE: [-Infinity, Infinity]})}, "RANGE: [-Infinity, Infinity]");
    tx(function () {BigNumber.config({RANGE: [Infinity, -Infinity]})}, "RANGE: [Infinity, -Infinity]");

    obj = BigNumber.config();

    t(-324, obj.RANGE[0]);
    t(308, obj.RANGE[1]);

    var hundred = new BigNumber(100);
    t('100', hundred.toString());
    t('100', new BigNumber(hundred).toString());

    t(1, BigNumber.config({RANGE: 1}).RANGE[1]);
    t(-1, BigNumber.config({RANGE: 1}).RANGE[0]);

    obj = BigNumber.config({RANGE: 1});
    Test.isTrue(obj.RANGE[0] === -1 && obj.RANGE[1] === 1);

    obj = BigNumber.config({RANGE: -1});
    Test.isTrue(obj.RANGE[0] === -1 && obj.RANGE[1] === 1);

    t('1', new BigNumber(1).toString());
    t('99', new BigNumber(99).toString());
    t('-99', new BigNumber(-99).toString());
    t('Infinity', new BigNumber(100).toString());
    t('-Infinity', new BigNumber(-100).toString());
    t('0.99', new BigNumber(0.99).toString());
    t('0.1', new BigNumber(0.1).toString());
    t('0', new BigNumber(0.09).toString());
    t('-0', new BigNumber(-0.09).valueOf());
    t('100', hundred.toString());
    t('Infinity', new BigNumber(hundred).toString());
    t('-Infinity', hundred.negated().toString());

    // FORMAT

    tx(function () {BigNumber.config({FORMAT: ''})}, "FORMAT: ''");
    tx(function () {BigNumber.config({FORMAT: 1})}, "FORMAT: 1");

    obj = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: '\xA0',
        fractionGroupSize: 0
    };

    t(obj, BigNumber.config({FORMAT: obj}).FORMAT);

    t('.', BigNumber.config().FORMAT.decimalSeparator);
    obj.decimalSeparator = ',';
    t(',', BigNumber.config().FORMAT.decimalSeparator);

    // ALPHABET

    BigNumber.config({ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyz'});

    tx(function () {BigNumber.config({ALPHABET: ''})}, "ALPHABET: ''");
    tx(function () {BigNumber.config({ALPHABET: '1'})}, "ALPHABET: '1'");
    tx(function () {BigNumber.config({ALPHABET: 2})}, "ALPHABET: 2");
    tx(function () {BigNumber.config({ALPHABET: true})}, "ALPHABET: true");
    tx(function () {BigNumber.config({ALPHABET: 'aba'})}, "ALPHABET: 'aba'");
    tx(function () {BigNumber.config({ALPHABET: '0.'})}, "ALPHABET: '0.'");
    tx(function () {BigNumber.config({ALPHABET: '0-'})}, "ALPHABET: '0-'");
    tx(function () {BigNumber.config({ALPHABET: '0+'})}, "ALPHABET: '0+'");
    tx(function () {BigNumber.config({ALPHABET: '0123456789.'})}, "ALPHABET: '0123456789.'");

    BigNumber.config({ALPHABET: '0,'});
    t('0,', BigNumber.config().ALPHABET);

    BigNumber.config({ALPHABET: 'xy'});
    t('xy', BigNumber.config().ALPHABET);

    BigNumber.config({ALPHABET: '0123456789TE'});
    t('0123456789TE', BigNumber.config().ALPHABET);

    BigNumber.config({ALPHABET: '9876543210'});
    t('9876543210', BigNumber.config().ALPHABET);

    BigNumber.config({ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyz'});
});
