if (typeof Test === 'undefined') require('../tester');

Test('random', function () {
    var dp, i, msg, r;

    BigNumber.config({ CRYPTO: false });

    for ( i = 0; i < 4994; i++ ) {

        if ( i & 1 ) {
            dp = Math.random() * 100 + 1 | 0;
            BigNumber.config({ DECIMAL_PLACES: dp });
            r = BigNumber.random();
        } else {
            dp = Math.random() * 100 | 0;
            r = BigNumber.random(dp);
        }

        //Test.write('\n  dp: ' + dp + '  r: ' + r.toString());

        // Check that the random number r has a maximum of dp decimal places.
        if ( r.dp() > dp ) {
            msg = 'r.dp() > dp';

        // Check 0 <= r < 1
        } else if ( r.lt(0) || r.gte(1) ) {
            msg = 'r.lt(0) || r.gte(1)';

        // Check that the attributes of r are formed correctly.
        } else if ( !r.eq( new BigNumber(r) ) || !r.eq( new BigNumber( r.toString() ) ) ) {
            msg = '!r.eq( new BigNumber(r) ) || !r.eq( new BigNumber( r.toString() ) )';
        }

        Test.isTrue( msg === undefined );

        if ( msg !== undefined ) {
            Test.write('\n  Random number r failed integrity test: ' + msg);
            Test.write('\n  r:    ' + r);
            Test.write('\n  r.c:  ' + r.c);
            Test.write('\n  r.e:  ' + r.e);
            Test.write('\n  r.s:  ' + r.s);
            Test.write('\n  r.dp: ' + r.dp());
            Test.write('\n  dp:   ' + dp);
            msg = undefined;
        }
    }

    BigNumber.random(undefined);
    BigNumber.random(null);
    BigNumber.random(3);
    BigNumber.random(0);

    Test.isException(function () { BigNumber.random(Infinity) }, 'Infinity');
    Test.isException(function () { BigNumber.random('-Infinity') }, "'-Infinity'");
    Test.isException(function () { BigNumber.random(NaN) }, 'NaN');
    Test.isException(function () { BigNumber.random('ugh') }, "'ugh'");
    Test.isException(function () { BigNumber.random(-1) }, "-1");
    Test.isException(function () { BigNumber.random({}) }, "{}");
});
