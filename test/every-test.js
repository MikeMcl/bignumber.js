var arr,
    passed = 0,
    total = 0,
    start = +new Date();

console.log( '\n STARTING TESTS...\n' );

[
  'abs',
  'base-in',
  'base-out',
  'ceil',
  'cmp',
  'config',
  'div',
  'floor',
  'minus',
  'mod',
  'neg',
  'others',
  'plus',
  'pow',
  'round',
  'sqrt',
  'times',
  'toExponential',
  'toFixed',
  'toFraction',
  'toPrecision',
  'toString'
]
.forEach( function (method) {
    arr = require('./' + method);
    passed += arr[0];
    total += arr[1];
});

console.log( '\n IN TOTAL: ' + passed + ' of ' + total + ' tests passed in ' +
    ( (+new Date() - start) / 1000 ) + ' secs.\n' );