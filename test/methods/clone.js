if (typeof Test === 'undefined') require('../tester');

Test('clone', function () {

    function t(value) {
        Test.isTrue(value);
    }

    var Big = BigNumber.clone();

    var x = new Big(0);
    var y = new Big('1');

    t(x instanceof Big);
    t(y instanceof Big);
    t(!(x instanceof BigNumber));
    t(!(y instanceof BigNumber));

    t(BigNumber.isBigNumber(x));
    t(BigNumber.isBigNumber(y));

    t(Big.isBigNumber(x));
    t(Big.isBigNumber(y));

    var z = new BigNumber(x);

    t(z instanceof BigNumber);
    t(!(z instanceof Big));

    t(BigNumber.isBigNumber(z));
    t(Big.isBigNumber(z));

    t(x.eq(z));
    t(!x.eq(y));
    t(!z.eq(y));

    AnotherBig = Big.clone();

    xx = new AnotherBig(0);
    yy = new AnotherBig('1');

    t(xx instanceof AnotherBig);
    t(!(xx instanceof BigNumber));
    t(!(yy instanceof BigNumber));
    t(!(xx instanceof Big));
    t(!(yy instanceof Big));

    t(Big.isBigNumber(xx));
    t(Big.isBigNumber(yy));

    t(AnotherBig.isBigNumber(xx));
    t(AnotherBig.isBigNumber(yy));

    zz = new Big(z);

    t(zz instanceof Big);
    t(!(zz instanceof AnotherBig));
    t(!(zz instanceof BigNumber));

    t(zz.eq(x));
    t(zz.eq(xx));
    t(zz.eq(z));
    t(!zz.eq(y));
    t(!zz.eq(yy));
});
