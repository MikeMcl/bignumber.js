// Add `Test` to global scope.
Test = (function () {
  var passed, testNumber, write;

  function Test(name, tests) {
    var time;
    write(' Testing ' + name + '...');
    passed = testNumber = 0;
    time = new Date();
    tests();
    time = new Date() - time;
    Test.result = [passed, testNumber, time];
    if (passed !== testNumber) write('\n');
    write(' ' + passed + ' of ' + testNumber + ' tests passed in ' + time + ' ms\n');
  }

  if (typeof window != 'undefined') {
    write = function (str) {
      document.body.innerHTML += str.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    };
  } else {

    // Add `BigNumber` to global scope.
    BigNumber = require('../bignumber');
    write = process.stdout.write.bind(process.stdout);
  }

  Test.isTrue = function (actual) {
    ++testNumber;
    if (actual === true) {
      ++passed;
      //write('\n Expected and actual: ' + actual);
    } else {
      write(
        '\n  Test number ' + testNumber + ' failed isTrue test' +
        '\n  Expected: true' +
        '\n  Actual:   ' + actual
      );
      //process.exit();
    }
  };

  Test.areEqual = function (expected, actual) {
    ++testNumber;
    // If expected and actual are both NaN, consider them equal.
    if (expected === actual || expected !== expected && actual !== actual) {
      ++passed;
    } else {
      write(
        '\n  Test number ' + testNumber + ' failed areEqual test' +
        '\n  Expected: ' + expected +
        '\n  Actual:   ' + actual
      );
      //process.exit();
    }
  };

  Test.isException = function (func, msg) {
    var actual;
    ++testNumber;
    try {
      func();
    } catch (e) {
      actual = e;
    }
    if (actual instanceof Error && /BigNumber Error/.test(actual.message)) {
      ++passed;
    } else {
      write(
        '\n  Test number ' + testNumber + ' failed isException test' +
        '\n  Expected: ' + msg + ' to raise a BigNumber Error.' +
        '\n  Actual:   ' + (actual || 'no exception')
      );
      //process.exit();
    }
  };

  Test.write = write;

  return Test;
})();

BigNumber.DEBUG = true;
