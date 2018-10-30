var time = process.hrtime(),
  passed = 0,
  total = 0;

console.log('\n Testing bignumber.js\n');

[
  'absoluteValue',
  'BigNumber',
  'comparedTo',
  'clone',
  'config',
  'dividedBy',
  'dividedToIntegerBy',
  'decimalPlaces',
  'exponentiatedBy',
  'integerValue',
  'isBigNumber',
  'minmax',
  'minus',
  'modulo',
  'multipliedBy',
  'negated',
  'isMethods',
  'plus',
  'precision',
  'random',
  'shiftedBy',
  'squareRoot',
  'sum',
  'toExponential',
  'toFixed',
  'toFormat',
  'toFraction',
  'toNumber',
  'toPrecision',
  'toString'
]
.forEach(function (method) {
  require('./methods/' + method);
  passed += Test.result[0];
  total += Test.result[1];

  // Reset BigNumber for each method tested?
  //delete require.cache[require.resolve('../bignumber.js')];
  //BigNumber = require('../bignumber');
  //BigNumber.DEBUG = true;
});

time = process.hrtime(time);
time = time[0] * 1e3 + (time[1] / 1e6 | 0);

console.log('\n In total, ' + passed + ' of ' + total + ' tests passed in ' + time + ' ms \n');
