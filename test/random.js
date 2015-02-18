var count = (function random(BigNumber) {
    var start = +new Date(),
        dp, error, i, log, m, r,
        passed = 0,
        total = 0;

    if (typeof window === 'undefined') {
        log = console.log;
        error = console.error;
    } else {
        log = function (str) { document.body.innerHTML += str.replace('\n', '<br>') };
        error = function (str) { document.body.innerHTML += '<div style="color: red">' +
          str.replace('\n', '<br>') + '</div>' };
    }

    if (!BigNumber && typeof require === 'function') BigNumber = require('../bignumber');

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

    log('\n Testing random...');

    BigNumber.config({ ERRORS: true, CRYPTO: false });

    for ( i = 0; i < 4994; i++ ) {

        if ( i & 1 ) {
            dp = Math.random() * 100 + 1 | 0;
            BigNumber.config(dp);
            r = BigNumber.random();
        } else {
            dp = Math.random() * 100 | 0;
            r = BigNumber.random(dp);
        }

        //log(dp + '\t' + r.toString());

        // Check that the random number r has a maximum of dp decimal places.
        if ( r.dp() > dp ) {
            m = ' r.dp() > dp';

        // Check 0 <= r < 1
        } else if ( r.lt(0) || r.gte(1) ) {
            m = ' r.lt(0) || r.gte(1)';

        // Check that the attributes of r are formed correctly.
        } else if ( !r.eq( new BigNumber(r) ) || !r.eq( new BigNumber( r.toString() ) ) ) {
            m = ' !r.eq( new BigNumber(r) ) || !r.eq( new BigNumber( r.toString() ) )';
        }

        total++;

        if (m) {
            error('\n Test number: ' + total + ' failed');
            error(m);
            error(' r:    ' + r);
            error(' r.c:  ' + r.c);
            error(' r.e:  ' + r.e);
            error(' r.s:  ' + r.s);
            error(' r.dp: ' + r.dp());
            error(' dp:   ' + dp);
            m = null;
        } else {
            passed++;
        }
    }

    BigNumber.random(undefined);
    BigNumber.random(null);
    BigNumber.random( new BigNumber(3) );
    BigNumber.random( '    -0e+0   ' );

    assertException(function () { BigNumber.random(Infinity) }, 'Infinity');
    assertException(function () { BigNumber.random('-Infinity') }, "'-Infinity'");
    assertException(function () { BigNumber.random(NaN) }, 'NaN');
    assertException(function () { BigNumber.random('ugh') }, "'ugh'");
    assertException(function () { BigNumber.random(-1) }, "-1");
    assertException(function () { BigNumber.random({}) }, "{}");

    BigNumber.config({ ERRORS: false });

    BigNumber.random(Infinity);
    BigNumber.random('-Infinity');
    BigNumber.random(NaN);
    BigNumber.random('ugh');
    BigNumber.random(-1);

    log('\n ' + passed + ' of ' + total + ' tests passed in ' + (+new Date() - start) + ' ms \n');
    return [passed, total];
})(this.BigNumber);
if (typeof module !== 'undefined' && module.exports) module.exports = count;
