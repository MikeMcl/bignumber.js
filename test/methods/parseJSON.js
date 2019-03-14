if (typeof Test === 'undefined') require('../tester');

Test('parseJSON', function () {

    function t(expected, value){
        Test.isTrue(expected.eq(value));
    }

    t(new BigNumber(10 ), BigNumber.parseJSON('1e1'));
    t(new BigNumber('7290.9817309441811021231245'), BigNumber.parseJSON('7290.9817309441811021231245') );
    t(new BigNumber('0.492984168922526525206'), BigNumber.parseJSON('{"x":0.492984168922526525206}').x );
    t(new BigNumber('41432809811874693461783'), BigNumber.parseJSON('[10,41432809811874693461783]')[1] );

    var result = BigNumber.parseJSON(JSON.stringify({
      foo: { 
        bar: [50,51,52,[ {x:1e-999} ] ],
      },
      "bar\"": 2e-999,
      "\\": { y: 3e-999 },
      "\\\"\\": [4e-999],
    }));

    t(new BigNumber(1e-999), result.foo.bar[3][0].x);
    t(new BigNumber(2e-999), result['bar"']);
    t(new BigNumber(3e-999), result['\\'].y);
    t(new BigNumber(4e-999), result['\\"\\'][0]);

});
