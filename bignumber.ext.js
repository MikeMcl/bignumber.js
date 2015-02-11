// Derived from documentation at http://mikemcl.github.io/bignumber.js/

// BigNumberBigNumber(value [, base]) ⇒ BigNumber 
var BigNumber = function(x, y) {};

// Rounding modes
BigNumber.ROUND_UP;
BigNumber.ROUND_DOWN;
BigNumber.ROUND_CEIL;
BigNumber.ROUND_FLOOR;
BigNumber.ROUND_HALF_UP;
BigNumber.ROUND_HALF_DOWN;
BigNumber.ROUND_HALF_EVEN;
BigNumber.ROUND_HALF_CEIL;
BigNumber.ROUND_HALF_FLOOR;

// config([settings]) ⇒ object
BigNumber.config = function(settings) {};

// absoluteValue() ⇒ BigNumber
BigNumber.prototype.absoluteValue = function() {};
BigNumber.prototype.abs = function() {};

// ceil() ⇒ BigNumber
BigNumber.prototype.ceil = function() {};

// comparedTo(n [, base]) ⇒ number
BigNumber.prototype.comparedTo = function(n, base) {};
BigNumber.prototype.cmp = function(n, base) {};

// decimalPlaces() ⇒ number
BigNumber.prototype.decimalPlaces = function() {};
BigNumber.prototype.dp = function() {};

// dividedBy(n [, base]) ⇒ BigNumber
BigNumber.prototype.dividedBy = function(n, base) {};
BigNumber.prototype.div = function(n, base) {};

// dividedToIntegerBy(n [, base]) ⇒ BigNumber
BigNumber.prototype.dividedToIntegerBy = function(n, base) {};
BigNumber.prototype.divToInt = function(n, base) {};

// equals(n [, base]) ⇒ boolean 
BigNumber.prototype.equals = function(n, base) {};
BigNumber.prototype.eq = function(n, base) {};

// floor() ⇒ BigNumber
BigNumber.prototype.floor = function() {};

// greaterThan(n [, base]) ⇒ boolean
BigNumber.prototype.greaterThan = function(n, base) {};
BigNumber.prototype.gt = function(n, base) {};

// greaterThanOrEqualTo(n [, base]) ⇒ boolean
BigNumber.prototype.greaterThanOrEqualTo = function(n, base) {};
BigNumber.prototype.gte = function(n, base) {};

// isFinite() ⇒ boolean
BigNumber.prototype.isFinite = function() {};

// isInteger() ⇒ boolean
BigNumber.prototype.isInteger = function() {};
BigNumber.prototype.isInt = function() {};

// isNaN() ⇒ boolean
BigNumber.prototype.isNaN = function() {};

// isNegative() ⇒ boolean
BigNumber.prototype.isNegative = function() {};
BigNumber.prototype.isNeg = function() {};

// isZero() ⇒ boolean
BigNumber.prototype.isZero = function() {};

// lessThan(n [, base]) ⇒ boolean
BigNumber.prototype.lessThan = function(n, base) {};
BigNumber.prototype.lt = function(n, base) {};

// lessThanOrEqualTo(n [, base]) ⇒ boolean
BigNumber.prototype.lessThanOrEqualTo = function(n, base) {};
BigNumber.prototype.lte = function(n, base) {};

// minus(n [, base]) ⇒ BigNumber
BigNumber.prototype.minus = function(n, base) {};

// modulo(n [, base]) ⇒ BigNumber
BigNumber.prototype.modulo = function(n, base) {};
BigNumber.prototype.mod = function(n, base) {};

// negated() ⇒ BigNumber
BigNumber.prototype.negated = function() {};
BigNumber.prototype.neg = function() {};

// plus(n [, base]) ⇒ BigNumber
BigNumber.prototype.plus = function(n, base) {};

// round(dp [, rm]) ⇒ BigNumber
BigNumber.prototype.round = function(dp, rm) {};

// squareRoot() ⇒ BigNumber
BigNumber.prototype.squareRoot = function() {};
BigNumber.prototype.sqrt = function() {};

// times(n [, base]) ⇒ BigNumber
BigNumber.prototype.times = function(n, base) {};

// toExponential(dp) ⇒ string
BigNumber.prototype.toExponential = function(dp) {};

// toFixed(dp) ⇒ string
BigNumber.prototype.toFixed = function(dp) {};

// toFormat(dp) ⇒ string
BigNumber.prototype.toFormat = function(dp) {};

// toFraction(max_denominator) ⇒ [string, string]
BigNumber.prototype.toFraction = function(md) {};

// toJSON() ⇒ string
BigNumber.prototype.toJSON = function() {};

// toNumber() ⇒ number
BigNumber.prototype.toNumber = function() {};

// toPower(n) ⇒ BigNumber
BigNumber.prototype.toPower = function(x) {};
BigNumber.prototype.pow = function(x) {};

// toPrecision(sig_digits) ⇒ string
BigNumber.prototype.toPrecision = function(sd) {};

// toString(base) ⇒ string
BigNumber.prototype.toString = function(base) {};

