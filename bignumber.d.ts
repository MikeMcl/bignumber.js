// Type definitions for bignumber.js >=6.0.0
// Project: https://github.com/MikeMcl/bignumber.js
// Definitions by: Michael Mclaughlin <https://github.com/MikeMcl>
// Definitions: https://github.com/MikeMcl/bignumber.js

// Documentation: http://mikemcl.github.io/bignumber.js/
//
// Exports (available globally or when using import):
//
//   class     BigNumber (default export)
//   type      BigNumber.Constructor
//   type      BigNumber.Instance
//   type      BigNumber.ModuloMode
//   type      BigNumber.RoundingMOde
//   type      BigNumber.Value
//   interface BigNumber.Config
//   interface BigNumber.Format
//
// Example (alternative syntax commented-out):
//
//   import {BigNumber} from "bignumber.js"
//   //import BigNumber from "bignumber.js"
//
//   let rm: BigNumber.RoundingMode = BigNumber.ROUND_UP;
//   let f: BigNumber.Format = { decimalSeparator: ',' };
//   let c: BigNumber.Config = { DECIMAL_PLACES: 4, ROUNDING_MODE: rm, FORMAT: f };
//   BigNumber.config(c);
//
//   let v: BigNumber.Value = '12345.6789';
//   let b: BigNumber = new BigNumber(v);
//   //let b: BigNumber.Instance = new BigNumber(v);
//
// The use of compiler option `--strictNullChecks` is recommended.


type BigNumberConstructor = typeof BigNumber;
type BigNumberInstance = BigNumber;
type BigNumberModuloMode = BigNumberRoundingMode | 9;
type BigNumberRoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type BigNumberValue = string | number | BigNumber;

/**
 * See `BigNumber.config` and `BigNumber.clone`.
 */
interface BigNumberConfig {

  /**
   * An integer, 0 to 1e+9. Default value: 20.
   *
   * The maximum number of decimal places of the result of operations involving division, i.e.
   * division, square root and base conversion operations, and exponentiation when the exponent is
   * negative.
   *
   * ```ts
   * BigNumber.config({ DECIMAL_PLACES: 5 })
   * BigNumber.set({ DECIMAL_PLACES: 5 })
   * ```
   */
  DECIMAL_PLACES?: number;

  /**
   * An integer, 0 to 8. Default value: `BigNumber.ROUND_HALF_UP` (4).
   *
   * The rounding mode used in operations that involve division (see `DECIMAL_PLACES`) and the
   * default rounding mode of the `decimalPlaces`, `precision`, `toExponential`, `toFixed`,
   * `toFormat` and `toPrecision` methods.
   *
   * The modes are available as enumerated properties of the BigNumber constructor.
   *
   * ```ts
   * BigNumber.config({ ROUNDING_MODE: 0 })
   * BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_UP })
   * ```
   */
  ROUNDING_MODE?: BigNumberRoundingMode;

  /**
   * An integer, 0 to 1e+9, or an array, [-1e+9 to 0, 0 to 1e+9].
   * Default value: `[-7, 20]`.
   *
   * The exponent value(s) at which `toString` returns exponential notation.
   *
   * If a single number is assigned, the value is the exponent magnitude.
   *
   * If an array of two numbers is assigned then the first number is the negative exponent value at
   * and beneath which exponential notation is used, and the second number is the positive exponent
   * value at and above which exponential notation is used.
   *
   * For example, to emulate JavaScript numbers in terms of the exponent values at which they begin
   * to use exponential notation, use `[-7, 20]`.
   *
   * ```ts
   * BigNumber.config({ EXPONENTIAL_AT: 2 })
   * new BigNumber(12.3)         // '12.3'        e is only 1
   * new BigNumber(123)          // '1.23e+2'
   * new BigNumber(0.123)        // '0.123'       e is only -1
   * new BigNumber(0.0123)       // '1.23e-2'
   *
   * BigNumber.config({ EXPONENTIAL_AT: [-7, 20] })
   * new BigNumber(123456789)    // '123456789'   e is only 8
   * new BigNumber(0.000000123)  // '1.23e-7'
   *
   * // Almost never return exponential notation:
   * BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
   *
   * // Always return exponential notation:
   * BigNumber.config({ EXPONENTIAL_AT: 0 })
   * ```
   *
   * Regardless of the value of `EXPONENTIAL_AT`, the `toFixed` method will always return a value in
   * normal notation and the `toExponential` method will always return a value in exponential form.
   * Calling `toString` with a base argument, e.g. `toString(10)`, will also always return normal
   * notation.
   */
  EXPONENTIAL_AT?: number|[number, number];

  /**
   * An integer, magnitude 1 to 1e+9, or an array, [-1e+9 to -1, 1 to 1e+9].
   * Default value: `[-1e+9, 1e+9]`.
   *
   * The exponent value(s) beyond which overflow to Infinity and underflow to zero occurs.
   *
   * If a single number is assigned, it is the maximum exponent magnitude: values wth a positive
   * exponent of greater magnitude become Infinity and those with a negative exponent of greater
   * magnitude become zero.
   *
   * If an array of two numbers is assigned then the first number is the negative exponent limit and
   * the second number is the positive exponent limit.
   *
   * For example, to emulate JavaScript numbers in terms of the exponent values at which they
   * become zero and Infinity, use [-324, 308].
   *
   * ```ts
   * BigNumber.config({ RANGE: 500 })
   * BigNumber.config().RANGE     // [ -500, 500 ]
   * new BigNumber('9.999e499')   // '9.999e+499'
   * new BigNumber('1e500')       // 'Infinity'
   * new BigNumber('1e-499')      // '1e-499'
   * new BigNumber('1e-500')      // '0'
   *
   * BigNumber.config({ RANGE: [-3, 4] })
   * new BigNumber(99999)         // '99999'      e is only 4
   * new BigNumber(100000)        // 'Infinity'   e is 5
   * new BigNumber(0.001)         // '0.01'       e is only -3
   * new BigNumber(0.0001)        // '0'          e is -4
   * ```
   * The largest possible magnitude of a finite BigNumber is 9.999...e+1000000000.
   * The smallest possible magnitude of a non-zero BigNumber is 1e-1000000000.
   */
  RANGE?: number|[number, number];

  /**
   * A boolean: `true` or `false`. Default value: `false`.
   *
   * The value that determines whether cryptographically-secure pseudo-random number generation is
   * used. If `CRYPTO` is set to true then the random method will generate random digits using
   * `crypto.getRandomValues` in browsers that support it, or `crypto.randomBytes` if using a
   * version of Node.js that supports it.
   *
   * If neither function is supported by the host environment then attempting to set `CRYPTO` to
   * `true` will fail and an exception will be thrown.
   *
   * If `CRYPTO` is `false` then the source of randomness used will be `Math.random` (which is
   * assumed to generate at least 30 bits of randomness).
   *
   * See `BigNumber.random`.
   *
   * ```ts
   * BigNumber.config({ CRYPTO: true })
   * BigNumber.config().CRYPTO       // true
   * BigNumber.random()              // 0.54340758610486147524
   * ```
   */
  CRYPTO?: boolean;

  /**
   * An integer, 0 to 9. Default value: `BigNumber.ROUND_DOWN` (1).
   *
   * The modulo mode used when calculating the modulus: `a mod n`.
   * The quotient, `q = a / n`, is calculated according to the `ROUNDING_MODE` that corresponds to
   * the chosen `MODULO_MODE`.
   * The remainder, `r`, is calculated as: `r = a - n * q`.
   *
   * The modes that are most commonly used for the modulus/remainder operation are shown in the
   * following table. Although the other rounding modes can be used, they may not give useful
   * results.
   *
   * Property           | Value | Description
   * :------------------|:------|:------------------------------------------------------------------
   *  `ROUND_UP`        |   0   | The remainder is positive if the dividend is negative.
   *  `ROUND_DOWN`      |   1   | The remainder has the same sign as the dividend.
   *                    |       | Uses 'truncating division' and matches JavaScript's `%` operator .
   *  `ROUND_FLOOR`     |   3   | The remainder has the same sign as the divisor.
   *                    |       | This matches Python's `%` operator.
   *  `ROUND_HALF_EVEN` |   6   | The IEEE 754 remainder function.
   *  `EUCLID`          |   9   | The remainder is always positive.
   *                    |       | Euclidian division: `q = sign(n) * floor(a / abs(n))`
   *
   * The rounding/modulo modes are available as enumerated properties of the BigNumber constructor.
   *
   * See `modulo`.
   *
   * ```ts
   * BigNumber.config({ MODULO_MODE: BigNumber.EUCLID })
   * BigNumber.set({ MODULO_MODE: 9 })          // equivalent
   * ```
   */
  MODULO_MODE?: BigNumberModuloMode;

  /**
   * An integer, 0 to 1e+9. Default value: 0.
   *
   * The maximum precision, i.e. number of significant digits, of the result of the power operation
   * - unless a modulus is specified.
   *
   * If set to 0, the number of significant digits will not be limited.
   *
   * See `exponentiatedBy`.
   *
   * ```ts
   * BigNumber.config({ POW_PRECISION: 100 })
   * ```
   */
  POW_PRECISION?: number;

  /**
   * An object including any number of the properties shown below.
   *
   * The object configures the format of the string returned by the `toFormat` method.
   * The example below shows the properties of the object that are recognised, and
   * their default values.
   *
   * Unlike the other configuration properties, the values of the properties of the `FORMAT` object
   * will not be checked for validity - the existing object will simply be replaced by the object
   * that is passed in.
   *
   * See `toFormat`.
   *
   * ```ts
   * BigNumber.config({
   *   FORMAT: {
   *     // the decimal separator
   *     decimalSeparator: '.',
   *     // the grouping separator of the integer part
   *     groupSeparator: ',',
   *     // the primary grouping size of the integer part
   *     groupSize: 3,
   *     // the secondary grouping size of the integer part
   *     secondaryGroupSize: 0,
   *     // the grouping separator of the fraction part
   *     fractionGroupSeparator: ' ',
   *     // the grouping size of the fraction part
   *     fractionGroupSize: 0
   *   }
   * })
   * ```
   */
  FORMAT?: BigNumberFormat;

  /**
   * A string representing the alphabet used for base conversion.
   * Default value: `'0123456789abcdefghijklmnopqrstuvwxyz'`.
   *
   * The length of the alphabet corresponds to the maximum value of the base argument that can be
   * passed to the BigNumber constructor or `toString`. There is no maximum length, but it must be
   * at least 2 characters long, and it must not contain a repeated character, or `'.'` - the
   * decimal separator for all values whatever their base.
   *
   * ```ts
   * // duodecimal (base 12)
   * BigNumber.config({ ALPHABET: '0123456789TE' })
   * x = new BigNumber('T', 12)
   * x.toString()                // '10'
   * x.toString(12)              // 'T'
   * ```
   */
  ALPHABET?: string;
}


/**
 * See `FORMAT` and `toFormat`.
 */
interface BigNumberFormat {

  /**
   * The decimal separator.
   */
  decimalSeparator?: string;

  /**
   * The grouping separator of the integer part.
   */
  groupSeparator?: string;

  /**
   * The primary grouping size of the integer part.
   */
  groupSize?: number;

  /**
   * The secondary grouping size of the integer part.
   */
  secondaryGroupSize?: number;

  /**
   * The grouping separator of the fraction part.
   */
  fractionGroupSeparator?: string;

  /**
   * The grouping size of the fraction part.
   */
  fractionGroupSize?: number;
}


export declare class BigNumber {

  /**
   * Used internally by the `BigNumber.isBigNumber` method.
   */
  private readonly _isBigNumber: true;

  /**
   * The coefficient of the value of this BigNumber, an array of base 1e14 integer numbers.
   */
  readonly c: number[];

  /**
   * The exponent of the value of this BigNumber, an integer number, -1000000000 to 1000000000.
   */
  readonly e: number;

  /**
   * The sign of the value of this BigNumber, -1 or 1.
   */
  readonly s: number;

  /**
   * Returns a new instance of BigNumber with value `n`.
   *
   * Legitimate values for `n` include ±0, ±`Infinity` and `NaN`.
   *
   * Values of type number with more than 15 significant digits are considered invalid as calling
   * `toString` or `valueOf` on such numbers may not result in the intended value.
   *
   * ```ts
   * console.log( 823456789123456.3 );    // 823456789123456.2
   * ```
   *
   * There is no limit to the number of digits of a value of type string (other than that of
   * JavaScript's maximum array size). Decimal string values may be in exponential, as well as
   * normal (fixed-point) notation. Non-decimal values must be in normal notation.
   *
   * String values in hexadecimal literal form, e.g. '0xff', are valid, as are string values with
   * the octal and binary prefixs '0o' and '0b'. String values in octal literal form without the
   * prefix will be interpreted as decimals, e.g. '011' is interpreted as 11, not 9.
   *
   * Values in any base may have fraction digits.
   *
   * If a base is specified, `n` is rounded according to the current `DECIMAL_PLACES` and
   * `ROUNDING_MODE` settings. If base is omitted, or is `null` or `undefined`, base 10 is assumed.
   *
   * Throws an invalid `value` or `base`.
   *
   * ```ts
   * x = new BigNumber(9)                       // '9'
   * y = new BigNumber(x)                       // '9'
   *
   * // 'new' is optional
   * BigNumber(435.345)                         // '435.345'
   *
   * new BigNumber('5032485723458348569331745.33434346346912144534543')
   * new BigNumber('4.321e+4')                  // '43210'
   * new BigNumber('-735.0918e-430')            // '-7.350918e-428'
   * new BigNumber(Infinity)                    // 'Infinity'
   * new BigNumber(NaN)                         // 'NaN'
   * new BigNumber('.5')                        // '0.5'
   * new BigNumber('+2')                        // '2'
   * new BigNumber(-10110100.1, 2)              // '-180.5'
   * new BigNumber(-0b10110100.1)               // '-180.5'
   * new BigNumber('123412421.234324', 5)       // '607236.557696'
   * new BigNumber('ff.8', 16)                  // '255.5'
   * new BigNumber('0xff.8')                    // '255.5'
   *
   * // The following throws 'Not a base 2 number'.
   * new BigNumber(9, 2)
   *
   * // The following throws 'Number primitive has more than 15 significant digits'.
   * new BigNumber(96517860459076817.4395)
   *
   * // The following throws 'Not a number'.
   * new BigNumber('blurgh')
   *
   * // A value is only rounded by the constructor if a base is specified.
   * BigNumber.config({ DECIMAL_PLACES: 5 })
   * new BigNumber(1.23456789)                  // '1.23456789'
   * new BigNumber(1.23456789, 10)              // '1.23457'
   * ```
   *
   * @param n A numeric value.
   * @param base The base of n, integer, 2 to 36 (or `ALPHABET.length`, see `ALPHABET`).
   */
  constructor(n: BigNumberValue, base?: number);

  /**
   * Returns a BigNumber whose value is the absolute value, i.e. the magnitude, of the value of this
   * BigNumber.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * x = new BigNumber(-0.8)
   * x.absoluteValue()           // '0.8'
   * ```
   */
  absoluteValue(): BigNumber;

  /**
   * Returns a BigNumber whose value is the absolute value, i.e. the magnitude, of the value of this
   * BigNumber.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * x = new BigNumber(-0.8)
   * x.abs()           // '0.8'
   * ```
   */
  abs(): BigNumber;

  /**
   *  Returns |                                                               |
   * :-------:|:--------------------------------------------------------------|
   *     1    | If the value of this BigNumber is greater than the value of `n`
   *    -1    | If the value of this BigNumber is less than the value of `n`
   *     0    | If this BigNumber and `n` have the same value
   *  `null`  | If the value of either this BigNumber or `n` is `NaN`
   *
   * ```ts
   *
   * x = new BigNumber(Infinity)
   * y = new BigNumber(5)
   * x.comparedTo(y)                 // 1
   * x.comparedTo(x.minus(1))        // 0
   * y.comparedTo(NaN)               // null
   * y.comparedTo('110', 2)          // -1
   * ```
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  comparedTo(n: BigNumberValue, base?: number): number;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber rounded by rounding mode
   * `roundingMode` to a maximum of `decimalPlaces` decimal places.
   *
   * If `decimalPlaces` is omitted, or is `null` or `undefined`, the return value is the number of
   * decimal places of the value of this BigNumber, or `null` if the value of this BigNumber is
   * ±`Infinity` or `NaN`.
   *
   * If `roundingMode` is omitted, or is `null` or `undefined`, `ROUNDING_MODE` is used.
   *
   * Throws if `decimalPlaces` or `roundingMode` is invalid.
   *
   * ```ts
   * x = new BigNumber(1234.56)
   * x.decimalPlaces()                      // 2
   * x.decimalPlaces(1)                     // '1234.6'
   * x.decimalPlaces(2)                     // '1234.56'
   * x.decimalPlaces(10)                    // '1234.56'
   * x.decimalPlaces(0, 1)                  // '1234'
   * x.decimalPlaces(0, 6)                  // '1235'
   * x.decimalPlaces(1, 1)                  // '1234.5'
   * x.decimalPlaces(1, BigNumber.ROUND_HALF_EVEN)     // '1234.6'
   * x                                      // '1234.56'
   * y = new BigNumber('9.9e-101')
   * y.decimalPlaces()                      // 102
   * ```
   *
   * @param [decimalPlaces] Decimal places, integer, 0 to 1e+9.
   * @param [roundingMode] Rounding mode, integer, 0 to 8.
   */
  decimalPlaces(decimalPlaces?: number, roundingMode?: BigNumberRoundingMode): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber rounded by rounding mode
   * `roundingMode` to a maximum of `decimalPlaces` decimal places.
   *
   * If `decimalPlaces` is omitted, or is `null` or `undefined`, the return value is the number of
   * decimal places of the value of this BigNumber, or `null` if the value of this BigNumber is
   * ±`Infinity` or `NaN`.
   *
   * If `roundingMode` is omitted, or is `null` or `undefined`, `ROUNDING_MODE` is used.
   *
   * Throws if `decimalPlaces` or `roundingMode` is invalid.
   *
   * ```ts
   * x = new BigNumber(1234.56)
   * x.dp()                                 // 2
   * x.dp(1)                                // '1234.6'
   * x.dp(2)                                // '1234.56'
   * x.dp(10)                               // '1234.56'
   * x.dp(0, 1)                             // '1234'
   * x.dp(0, 6)                             // '1235'
   * x.dp(1, 1)                             // '1234.5'
   * x.dp(1, BigNumber.ROUND_HALF_EVEN)     // '1234.6'
   * x                                      // '1234.56'
   * y = new BigNumber('9.9e-101')
   * y.dp()                                 // 102
   * ```
   *
   * @param [decimalPlaces] Decimal places, integer, 0 to 1e+9.
   * @param [roundingMode] Rounding mode, integer, 0 to 8.
   */
  dp(decimalPlaces?: number, roundingMode?: BigNumberRoundingMode): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber divided by `n`, rounded
   * according to the current `DECIMAL_PLACES` and `ROUNDING_MODE` settings.
   *
   * ```ts
   * x = new BigNumber(355)
   * y = new BigNumber(113)
   * x.dividedBy(y)                  // '3.14159292035398230088'
   * x.dividedBy(5)                  // '71'
   * x.dividedBy(47, 16)             // '5'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  dividedBy(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber divided by `n`, rounded
   * according to the current `DECIMAL_PLACES` and `ROUNDING_MODE` settings.
   *
   * ```ts
   * x = new BigNumber(355)
   * y = new BigNumber(113)
   * x.div(y)                    // '3.14159292035398230088'
   * x.div(5)                    // '71'
   * x.div(47, 16)               // '5'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  div(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the integer part of dividing the value of this BigNumber by
   * `n`.
   *
   * ```ts
   * x = new BigNumber(5)
   * y = new BigNumber(3)
   * x.dividedToIntegerBy(y)              // '1'
   * x.dividedToIntegerBy(0.7)            // '7'
   * x.dividedToIntegerBy('0.f', 16)      // '5'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  dividedToIntegerBy(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the integer part of dividing the value of this BigNumber by
   * `n`.
   *
   * ```ts
   * x = new BigNumber(5)
   * y = new BigNumber(3)
   * x.idiv(y)                       // '1'
   * x.idiv(0.7)                     // '7'
   * x.idiv('0.f', 16)               // '5'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  idiv(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber exponentiated by `n`, i.e.
   * raised to the power `n`, and optionally modulo a modulus `m`.
   *
   * If `n` is negative the result is rounded according to the current `DECIMAL_PLACES` and
   * `ROUNDING_MODE` settings.
   *
   * As the number of digits of the result of the power operation can grow so large so quickly,
   * e.g. 123.456**10000 has over 50000 digits, the number of significant digits calculated is
   * limited to the value of the `POW_PRECISION` setting (unless a modulus `m` is specified).
   *
   * By default `POW_PRECISION` is set to 0. This means that an unlimited number of significant
   * digits will be calculated, and that the method's performance will decrease dramatically for
   * larger exponents.
   *
   * If `m` is specified and the value of `m`, `n` and this BigNumber are positive integers, then a
   * fast modular exponentiation algorithm is used, otherwise if any of the values is not a positive
   * integer the operation will simply be performed as `x.exponentiatedBy(n).modulo(m)` with a
   * `POW_PRECISION` of 0.
   *
   * Throws if `n` is not a primitive number, or is not an integer, or is out of range.
   *
   * ```ts
   * Math.pow(0.7, 2)                    // 0.48999999999999994
   * x = new BigNumber(0.7)
   * x.exponentiatedBy(2)                // '0.49'
   * BigNumber(3).exponentiatedBy(-2)    // '0.11111111111111111111'
   * ```
   *
   * @param n The exponent, an integer, -9007199254740991 to 9007199254740991.
   * @param [m] The modulus, a positive integer.
   */
  exponentiatedBy(n: number, m?: BigNumberValue): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber exponentiated by `n`, i.e.
   * raised to the power `n`, and optionally modulo a modulus `m`.
   *
   * If `n` is negative the result is rounded according to the current `DECIMAL_PLACES` and
   * `ROUNDING_MODE` settings.
   *
   * As the number of digits of the result of the power operation can grow so large so quickly,
   * e.g. 123.456**10000 has over 50000 digits, the number of significant digits calculated is
   * limited to the value of the `POW_PRECISION` setting (unless a modulus `m` is specified).
   *
   * By default `POW_PRECISION` is set to 0. This means that an unlimited number of significant
   * digits will be calculated, and that the method's performance will decrease dramatically for
   * larger exponents.
   *
   * If `m` is specified and the value of `m`, `n` and this BigNumber are positive integers, then a
   * fast modular exponentiation algorithm is used, otherwise if any of the values is not a positive
   * integer the operation will simply be performed as `x.exponentiatedBy(n).modulo(m)` with a
   * `POW_PRECISION` of 0.
   *
   * Throws if `n` is not a primitive number or an integer, or is out of range.
   *
   * ```ts
   * Math.pow(0.7, 2)          // 0.48999999999999994
   * x = new BigNumber(0.7)
   * x.pow(2)                  // '0.49'
   * BigNumber(3).pow(-2)      // '0.11111111111111111111'
   * ```
   *
   * @param n The exponent, an integer, -9007199254740991 to 9007199254740991.
   * @param [m] The modulus, a positive integer.
   */
  pow(n: number, m?: BigNumberValue): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber rounded to an integer using
   * rounding mode `rm`.
   *
   * If `rm` is omitted, or is `null` or `undefined`, `ROUNDING_MODE` is used.
   *
   * Throws if `rm` is invalid.
   *
   * ```ts
   * x = new BigNumber(123.456)
   * x.integerValue()                        // '123'
   * x.integerValue(BigNumber.ROUND_CEIL)    // '124'
   * y = new BigNumber(-12.7)
   * y.integerValue()                        // '-13'
   * x.integerValue(BigNumber.ROUND_DOWN)    // '-12'
   * ```
   *
   * @param {BigNumberRoundingMode} [rm] The roundng mode, an integer, 0 to 8.
   */
  integerValue(rm?: BigNumberRoundingMode): BigNumber;

  /**
   * Returns `true` if the value of this BigNumber is equal to the value of `n`, otherwise returns
   * `false`.
   *
   * As with JavaScript, `NaN` does not equal `NaN`.
   *
   * ```ts
   * 0 === 1e-324                           // true
   * x = new BigNumber(0)
   * x.isEqualTo('1e-324')                  // false
   * BigNumber(-0).isEqualTo(x)             // true  ( -0 === 0 )
   * BigNumber(255).isEqualTo('ff', 16)     // true
   *
   * y = new BigNumber(NaN)
   * y.isEqualTo(NaN)                // false
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  isEqualTo(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is equal to the value of `n`, otherwise returns
   * `false`.
   *
   * As with JavaScript, `NaN` does not equal `NaN`.
   *
   * ```ts
   * 0 === 1e-324                    // true
   * x = new BigNumber(0)
   * x.eq('1e-324')                  // false
   * BigNumber(-0).eq(x)             // true  ( -0 === 0 )
   * BigNumber(255).eq('ff', 16)     // true
   *
   * y = new BigNumber(NaN)
   * y.eq(NaN)                       // false
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  eq(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is a finite number, otherwise returns `false`.
   *
   * The only possible non-finite values of a BigNumber are `NaN`, `Infinity` and `-Infinity`.
   *
   * ```ts
   * x = new BigNumber(1)
   * x.isFinite()                    // true
   * y = new BigNumber(Infinity)
   * y.isFinite()                    // false
   * ```
   */
  isFinite(): boolean;

  /**
   * Returns `true` if the value of this BigNumber is greater than the value of `n`, otherwise
   * returns `false`.
   *
   * ```ts
   * 0.1 > (0.3 - 0.2)                             // true
   * x = new BigNumber(0.1)
   * x.isGreaterThan(BigNumber(0.3).minus(0.2))    // false
   * BigNumber(0).isGreaterThan(x)                 // false
   * BigNumber(11, 3).isGreaterThan(11.1, 2)       // true
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  isGreaterThan(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is greater than the value of `n`, otherwise
   * returns `false`.
   *
   * ```ts
   * 0.1 > (0.3 - 0                     // true
   * x = new BigNumber(0.1)
   * x.gt(BigNumber(0.3).minus(0.2))    // false
   * BigNumber(0).gt(x)                 // false
   * BigNumber(11, 3).gt(11.1, 2)       // true
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  gt(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is greater than or equal to the value of `n`,
   * otherwise returns `false`.
   *
   * ```ts
   * (0.3 - 0.2) >= 0.1                                  // false
   * x = new BigNumber(0.3).minus(0.2)
   * x.isGreaterThanOrEqualTo(0.1)                       // true
   * BigNumber(1).isGreaterThanOrEqualTo(x)              // true
   * BigNumber(10, 18).isGreaterThanOrEqualTo('i', 36)   // true
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  isGreaterThanOrEqualTo(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is greater than or equal to the value of `n`,
   * otherwise returns `false`.
   *
   * ```ts
   * (0.3 - 0.2) >= 0.1                    // false
   * x = new BigNumber(0.3).minus(0.2)
   * x.gte(0.1)                            // true
   * BigNumber(1).gte(x)                   // true
   * BigNumber(10, 18).gte('i', 36)        // true
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  gte(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is an integer, otherwise returns `false`.
   *
   * ```ts
   * x = new BigNumber(1)
   * x.isInteger()                   // true
   * y = new BigNumber(123.456)
   * y.isInteger()                   // false
   * ```
   */
  isInteger(): boolean;

  /**
   * Returns `true` if the value of this BigNumber is less than the value of `n`, otherwise returns
   * `false`.
   *
   * ```ts
   * (0.3 - 0.2) < 0.1                       // true
   * x = new BigNumber(0.3).minus(0.2)
   * x.isLessThan(0.1)                       // false
   * BigNumber(0).isLessThan(x)              // true
   * BigNumber(11.1, 2).isLessThan(11, 3)    // true
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  isLessThan(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is less than the value of `n`, otherwise returns
   * `false`.
   *
   * ```ts
   * (0.3 - 0.2) < 0.1                       // true
   * x = new BigNumber(0.3).minus(0.2)
   * x.lt(0.1)                               // false
   * BigNumber(0).lt(x)                      // true
   * BigNumber(11.1, 2).lt(11, 3)            // true
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  lt(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is less than or equal to the value of `n`,
   * otherwise returns `false`.
   *
   * ```ts
   * 0.1 <= (0.3 - 0.2)                                 // false
   * x = new BigNumber(0.1)
   * x.isLessThanOrEqualTo(BigNumber(0.3).minus(0.2))   // true
   * BigNumber(-1).isLessThanOrEqualTo(x)               // true
   * BigNumber(10, 18).isLessThanOrEqualTo('i', 36)     // true
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  isLessThanOrEqualTo(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is less than or equal to the value of `n`,
   * otherwise returns `false`.
   *
   * ```ts
   * 0.1 <= (0.3 - 0.2)                  // false
   * x = new BigNumber(0.1)
   * x.lte(BigNumber(0.3).minus(0.2))    // true
   * BigNumber(-1).lte(x)                // true
   * BigNumber(10, 18).lte('i', 36)      // true
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  lte(n: BigNumberValue, base?: number): boolean;

  /**
   * Returns `true` if the value of this BigNumber is `NaN`, otherwise returns `false`.
   *
   * ```ts
   * x = new BigNumber(NaN)
   * x.isNaN()                       // true
   * y = new BigNumber('Infinity')
   * y.isNaN()                       // false
   * ```
   */
  isNaN(): boolean;

  /**
   * Returns `true` if the value of this BigNumber is negative, otherwise returns `false`.
   *
   * ```ts
   * x = new BigNumber(-0)
   * x.isNegative()                  // true
   * y = new BigNumber(2)
   * y.isNegative()                  // false
   * ```
   */
  isNegative(): boolean;

  /**
   * Returns `true` if the value of this BigNumber is positive, otherwise returns `false`.
   *
   * ```ts
   * x = new BigNumber(-0)
   * x.isPositive()                  // false
   * y = new BigNumber(2)
   * y.isPositive()                  // true
   * ```
   */
  isPositive(): boolean;

  /**
   * Returns `true` if the value of this BigNumber is zero or minus zero, otherwise returns `false`.
   *
   * ```ts
   * x = new BigNumber(-0)
   * x.isZero()                 // true
   * ```
   */
  isZero(): boolean;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber minus `n`.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * 0.3 - 0.1                       // 0.19999999999999998
   * x = new BigNumber(0.3)
   * x.minus(0.1)                    // '0.2'
   * x.minus(0.6, 20)                // '0'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  minus(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber modulo `n`, i.e. the integer
   * remainder of dividing this BigNumber by `n`.
   *
   * The value returned, and in particular its sign, is dependent on the value of the `MODULO_MODE`
   * setting of this BigNumber constructor. If it is 1 (default value), the result will have the
   * same sign as this BigNumber, and it will match that of Javascript's `%` operator (within the
   * limits of double precision) and BigDecimal's `remainder` method.
   *
   * The return value is always exact and unrounded.
   *
   * See `MODULO_MODE` for a description of the other modulo modes.
   *
   * ```ts
   * 1 % 0.9                         // 0.09999999999999998
   * x = new BigNumber(1)
   * x.modulo(0.9)                   // '0.1'
   * y = new BigNumber(33)
   * y.modulo('a', 33)               // '3'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  modulo(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber modulo `n`, i.e. the integer
   * remainder of dividing this BigNumber by `n`.
   *
   * The value returned, and in particular its sign, is dependent on the value of the `MODULO_MODE`
   * setting of this BigNumber constructor. If it is 1 (default value), the result will have the
   * same sign as this BigNumber, and it will match that of Javascript's `%` operator (within the
   * limits of double precision) and BigDecimal's `remainder` method.
   *
   * The return value is always exact and unrounded.
   *
   * See `MODULO_MODE` for a description of the other modulo modes.
   *
   * ```ts
   * 1 % 0.9                      // 0.09999999999999998
   * x = new BigNumber(1)
   * x.mod(0.9)                   // '0.1'
   * y = new BigNumber(33)
   * y.mod('a', 33)               // '3'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  mod(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber multiplied by `n`.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * 0.6 * 3                                // 1.7999999999999998
   * x = new BigNumber(0.6)
   * y = x.multipliedBy(3)                  // '1.8'
   * BigNumber('7e+500').multipliedBy(y)    // '1.26e+501'
   * x.multipliedBy('-a', 16)               // '-6'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  multipliedBy(n: BigNumberValue, base?: number) : BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber multiplied by `n`.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * 0.6 * 3                         // 1.7999999999999998
   * x = new BigNumber(0.6)
   * y = x.times(3)                  // '1.8'
   * BigNumber('7e+500').times(y)    // '1.26e+501'
   * x.times('-a', 16)               // '-6'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  times(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber negated, i.e. multiplied by -1.
   *
   * ```ts
   * x = new BigNumber(1.8)
   * x.negated()                     // '-1.8'
   * y = new BigNumber(-1.3)
   * y.negated()                     // '1.3'
   * ```
   */
  negated(): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber plus `n`.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * 0.1 + 0.2                       // 0.30000000000000004
   * x = new BigNumber(0.1)
   * y = x.plus(0.2)                 // '0.3'
   * BigNumber(0.7).plus(x).plus(y)  // '1'
   * x.plus('0.1', 8)                // '0.225'
   * ```
   *
   * @param n A numeric value.
   * @param [base] The base of n.
   */
  plus(n: BigNumberValue, base?: number): BigNumber;

  /**
   * Returns the number of significant digits of the value of this BigNumber, or `null` if the value
   * of this BigNumber is ±`Infinity` or `NaN`.
   *
   * If `includeZeros` is true then any trailing zeros of the integer part of the value of this
   * BigNumber are counted as significant digits, otherwise they are not.
   *
   * Throws if `includeZeros` is invalid.
   *
   * ```ts
   * x = new BigNumber(9876.54321)
   * x.precision()                         // 9
   * y = new BigNumber(987000)
   * y.precision(false)                    // 3
   * y.precision(true)                     // 6
   * ```
   *
   * @param [includeZeros] Whether to include integer trailing zeros in the significant digit count.
   */
  precision(includeZeros?: boolean): number;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber rounded to a precision of
   * `significantDigits` significant digits using rounding mode `roundingMode`.
   *
   * If `roundingMode` is omitted or is `null` or `undefined`, `ROUNDING_MODE` will be used.
   *
   * Throws if `significantDigits` or `roundingMode` is invalid.
   *
   * ```ts
   * x = new BigNumber(9876.54321)
   * x.precision(6)                         // '9876.54'
   * x.precision(6, BigNumber.ROUND_UP)     // '9876.55'
   * x.precision(2)                         // '9900'
   * x.precision(2, 1)                      // '9800'
   * x                                      // '9876.54321'
   * ```
   *
   * @param significantDigits Significant digits, integer, 1 to 1e+9.
   * @param [roundingMode] Rounding mode, integer, 0 to 8.
   */
  precision(significantDigits: number, roundingMode?: BigNumberRoundingMode): BigNumber;

  /**
   * Returns the number of significant digits of the value of this BigNumber,
   * or `null` if the value of this BigNumber is ±`Infinity` or `NaN`.
   *
   * If `includeZeros` is true then any trailing zeros of the integer part of
   * the value of this BigNumber are counted as significant digits, otherwise
   * they are not.
   *
   * Throws if `includeZeros` is invalid.
   *
   * ```ts
   * x = new BigNumber(9876.54321)
   * x.sd()                         // 9
   * y = new BigNumber(987000)
   * y.sd(false)                    // 3
   * y.sd(true)                     // 6
   * ```
   *
   * @param [includeZeros] Whether to include integer trailing zeros in the significant digit count.
   */
  sd(includeZeros?: boolean): number;

  /*
   * Returns a BigNumber whose value is the value of this BigNumber rounded to a precision of
   * `significantDigits` significant digits using rounding mode `roundingMode`.
   *
   * If `roundingMode` is omitted or is `null` or `undefined`, `ROUNDING_MODE` will be used.
   *
   * Throws if `significantDigits` or `roundingMode` is invalid.
   *
   * ```ts
   * x = new BigNumber(9876.54321)
   * x.sd(6)                           // '9876.54'
   * x.sd(6, BigNumber.ROUND_UP)       // '9876.55'
   * x.sd(2)                           // '9900'
   * x.sd(2, 1)                        // '9800'
   * x                                 // '9876.54321'
   * ```
   *
   * @param significantDigits Significant digits, integer, 1 to 1e+9.
   * @param [roundingMode] Rounding mode, integer, 0 to 8.
   */
  sd(significantDigits: number, roundingMode?: BigNumberRoundingMode): BigNumber;

  /**
   * Returns a BigNumber whose value is the value of this BigNumber shifted by `n` places.
   *
   * The shift is of the decimal point, i.e. of powers of ten, and is to the left if `n` is negative
   * or to the right if `n` is positive.
   *
   * The return value is always exact and unrounded.
   *
   * Throws if `n` is invalid.
   *
   * ```ts
   * x = new BigNumber(1.23)
   * x.shiftedBy(3)                      // '1230'
   * x.shiftedBy(-3)                     // '0.00123'
   * ```
   *
   * @param n The shift value, integer, -9007199254740991 to 9007199254740991.
   */
  shiftedBy(n: number): BigNumber;

  /**
   * Returns a BigNumber whose value is the square root of the value of this BigNumber, rounded
   * according to the current `DECIMAL_PLACES` and `ROUNDING_MODE` settings.
   *
   * The return value will be correctly rounded, i.e. rounded as if the result was first calculated
   * to an infinite number of correct digits before rounding.
   *
   * ```ts
   * x = new BigNumber(16)
   * x.squareRoot()                  // '4'
   * y = new BigNumber(3)
   * y.squareRoot()                  // '1.73205080756887729353'
   * ```
   */
  squareRoot(): BigNumber;

  /**
   * Returns a BigNumber whose value is the square root of the value of this BigNumber, rounded
   * according to the current `DECIMAL_PLACES` and `ROUNDING_MODE` settings.
   *
   * The return value will be correctly rounded, i.e. rounded as if the result was first calculated
   * to an infinite number of correct digits before rounding.
   *
   * ```ts
   * x = new BigNumber(16)
   * x.sqrt()                  // '4'
   * y = new BigNumber(3)
   * y.sqrt()                  // '1.73205080756887729353'
   * ```
   */
  sqrt(): BigNumber;

  /**
   * Returns a string representing the value of this BigNumber in exponential notation rounded using
   * rounding mode `roundingMode` to `decimalPlaces` decimal places, i.e with one digit before the
   * decimal point and `decimalPlaces` digits after it.
   *
   * If the value of this BigNumber in exponential notation has fewer than `decimalPlaces` fraction
   * digits, the return value will be appended with zeros accordingly.
   *
   * If `decimalPlaces` is omitted, or is `null` or `undefined`, the number of digits after the
   * decimal point defaults to the minimum number of digits necessary to represent the value
   * exactly.
   *
   * If `roundingMode` is omitted or is `null` or `undefined`, `ROUNDING_MODE` is used.
   *
   * Throws if `decimalPlaces` or `roundingMode` is invalid.
   *
   * ```ts
   * x = 45.6
   * y = new BigNumber(x)
   * x.toExponential()               // '4.56e+1'
   * y.toExponential()               // '4.56e+1'
   * x.toExponential(0)              // '5e+1'
   * y.toExponential(0)              // '5e+1'
   * x.toExponential(1)              // '4.6e+1'
   * y.toExponential(1)              // '4.6e+1'
   * y.toExponential(1, 1)           // '4.5e+1'  (ROUND_DOWN)
   * x.toExponential(3)              // '4.560e+1'
   * y.toExponential(3)              // '4.560e+1'
   * ```
   *
   * @param [decimalPlaces] Decimal places, integer, 0 to 1e+9.
   * @param [roundingMode] Rounding mode, integer, 0 to 8.
   */
  toExponential(decimalPlaces?: number, roundingMode?: BigNumberRoundingMode): string;

  /**
   * Returns a string representing the value of this BigNumber in normal (fixed-point) notation
   * rounded to `decimalPlaces` decimal places using rounding mode `roundingMode`.
   *
   * If the value of this BigNumber in normal notation has fewer than `decimalPlaces` fraction
   * digits, the return value will be appended with zeros accordingly.
   *
   * Unlike `Number.prototype.toFixed`, which returns exponential notation if a number is greater or
   * equal to 10**21, this method will always return normal notation.
   *
   * If `decimalPlaces` is omitted or is `null` or `undefined`, the return value will be unrounded
   * and in normal notation. This is also unlike `Number.prototype.toFixed`, which returns the value
   * to zero decimal places. It is useful when normal notation is required and the current
   * `EXPONENTIAL_AT` setting causes `toString` to return exponential notation.
   *
   * If `roundingMode` is omitted or is `null` or `undefined`, `ROUNDING_MODE` is used.
   *
   * Throws if `decimalPlaces` or `roundingMode` is invalid.
   *
   * ```ts
   * x = 3.456
   * y = new BigNumber(x)
   * x.toFixed()                     // '3'
   * y.toFixed()                     // '3.456'
   * y.toFixed(0)                    // '3'
   * x.toFixed(2)                    // '3.46'
   * y.toFixed(2)                    // '3.46'
   * y.toFixed(2, 1)                 // '3.45'  (ROUND_DOWN)
   * x.toFixed(5)                    // '3.45600'
   * y.toFixed(5)                    // '3.45600'
   * ```
   *
   * @param [decimalPlaces] Decimal places, integer, 0 to 1e+9.
   * @param [roundingMode] Rounding mode, integer, 0 to 8.
   */
  toFixed(decimalPlaces?: number, roundingMode?: BigNumberRoundingMode): string;

  /**
   * Returns a string representing the value of this BigNumber in normal (fixed-point) notation
   * rounded to `decimalPlaces` decimal places using rounding mode `roundingMode`, and formatted
   * according to the properties of the `FORMAT` object.
   *
   * The properties of the `FORMAT` object are shown in the examples below.
   *
   * If `decimalPlaces` is omitted or is `null` or `undefined`, then the return value is not
   * rounded to a fixed number of decimal places.
   *
   * If `roundingMode` is omitted or is `null` or `undefined`, `ROUNDING_MODE` is used.
   *
   * Throws if `decimalPlaces` or `roundingMode` is invalid.
   *
   * ```ts
   * format = {
   *     decimalSeparator: '.',
   *     groupSeparator: ',',
   *     groupSize: 3,
   *     secondaryGroupSize: 0,
   *     fractionGroupSeparator: ' ',
   *     fractionGroupSize: 0
   * }
   * BigNumber.config({ FORMAT: format })
   *
   * x = new BigNumber('123456789.123456789')
   * x.toFormat()                    // '123,456,789.123456789'
   * x.toFormat(1)                   // '123,456,789.1'
   *
   * format.groupSeparator = ' '
   * format.fractionGroupSize = 5
   * x.toFormat()                    // '123 456 789.12345 6789'
   *
   * BigNumber.config({
   *     FORMAT: {
   *         decimalSeparator: ',',
   *         groupSeparator: '.',
   *         groupSize: 3,
   *         secondaryGroupSize: 2
   *     }
   * })
   *
   * x.toFormat(6)                   // '12.34.56.789,123'
   * ```
   *
   * @param [decimalPlaces] Decimal places, integer, 0 to 1e+9.
   * @param [roundingMode] Rounding mode, integer, 0 to 8.
   */
  toFormat(decimalPlaces?: number, roundingMode?: BigNumberRoundingMode): string;

  /**
   * Returns a string array representing the value of this BigNumber as a simple fraction with an
   * integer numerator and an integer denominator. The denominator will be a positive non-zero value
   * less than or equal to `max_denominator`.
   *
   * If a maximum denominator, `max_denominator`, is not specified, or is `null` or `undefined`, the
   * denominator will be the lowest value necessary to represent the number exactly.
   *
   * Throws if `max_denominator` is invalid.
   *
   * ```ts
   * x = new BigNumber(1.75)
   * x.toFraction()                  // '7, 4'
   *
   * pi = new BigNumber('3.14159265358')
   * pi.toFraction()                 // '157079632679,50000000000'
   * pi.toFraction(100000)           // '312689, 99532'
   * pi.toFraction(10000)            // '355, 113'
   * pi.toFraction(100)              // '311, 99'
   * pi.toFraction(10)               // '22, 7'
   * pi.toFraction(1)                // '3, 1'
   * ```
   *
   * @param [max_denominator] The maximum denominator, integer, >= 1 and < Infinity.
   */
  toFraction(max_denominator?: BigNumberValue): BigNumber[];

  /**
   * As `valueOf`.
   */
  toJSON(): string;

  /**
   * Returns the value of this BigNumber as a JavaScript primitive number.
   *
   * Using the unary plus operator gives the same result.
   *
   * ```ts
   * x = new BigNumber(456.789)
   * x.toNumber()                    // 456.789
   * +x                              // 456.789
   *
   * y = new BigNumber('45987349857634085409857349856430985')
   * y.toNumber()                    // 4.598734985763409e+34
   *
   * z = new BigNumber(-0)
   * 1 / z.toNumber()                // -Infinity
   * 1 / +z                          // -Infinity
   * ```
   */
  toNumber(): number;

  /**
   * Returns a string representing the value of this BigNumber rounded to `significantDigits`
   * significant digits using rounding mode `roundingMode`.
   *
   * If `significantDigits` is less than the number of digits necessary to represent the integer
   * part of the value in normal (fixed-point) notation, then exponential notation is used.
   *
   * If `significantDigits` is omitted, or is `null` or `undefined`, then the return value is the
   * same as `n.toString()`.
   *
   * If `roundingMode` is omitted or is `null` or `undefined`, `ROUNDING_MODE` is used.
   *
   * Throws if `significantDigits` or `roundingMode` is invalid.
   *
   * ```ts
   * x = 45.6
   * y = new BigNumber(x)
   * x.toPrecision()                 // '45.6'
   * y.toPrecision()                 // '45.6'
   * x.toPrecision(1)                // '5e+1'
   * y.toPrecision(1)                // '5e+1'
   * y.toPrecision(2, 0)             // '4.6e+1'  (ROUND_UP)
   * y.toPrecision(2, 1)             // '4.5e+1'  (ROUND_DOWN)
   * x.toPrecision(5)                // '45.600'
   * y.toPrecision(5)                // '45.600'
   * ```
   *
   * @param [significantDigits] Significant digits, integer, 1 to 1e+9.
   * @param [roundingMode] Rounding mode, integer 0 to 8.
   */
  toPrecision(significantDigits?: number, roundingMode?: BigNumberRoundingMode): string;

  /**
   * Returns a string representing the value of this BigNumber in base `base`, or base 10 if `base`
   * is omitted or is `null` or `undefined`.
   *
   * For bases above 10, and using the default base conversion alphabet (see `ALPHABET`), values
   * from 10 to 35 are represented by a-z (the same as `Number.prototype.toString`).
   *
   * If a base is specified the value is rounded according to the current `DECIMAL_PLACES` and
   * `ROUNDING_MODE` settings, otherwise it is not.
   *
   * If a base is not specified, and this BigNumber has a positive exponent that is equal to or
   * greater than the positive component of the current `EXPONENTIAL_AT` setting, or a negative
   * exponent equal to or less than the negative component of the setting, then exponential notation
   * is returned.
   *
   * If `base` is `null` or `undefined` it is ignored.
   *
   * Throws if `base` is invalid.
   *
   * ```ts
   * x = new BigNumber(750000)
   * x.toString()                    // '750000'
   * BigNumber.config({ EXPONENTIAL_AT: 5 })
   * x.toString()                    // '7.5e+5'
   *
   * y = new BigNumber(362.875)
   * y.toString(2)                   // '101101010.111'
   * y.toString(9)                   // '442.77777777777777777778'
   * y.toString(32)                  // 'ba.s'
   *
   * BigNumber.config({ DECIMAL_PLACES: 4 });
   * z = new BigNumber('1.23456789')
   * z.toString()                    // '1.23456789'
   * z.toString(10)                  // '1.2346'
   * ```
   *
   * @param [base] The base, integer, 2 to 36 (or `ALPHABET.length`, see `ALPHABET`).
   */
  toString(base?: number): string;

  /**
   * As `toString`, but does not accept a base argument and includes the minus sign for negative
   * zero.
   *
   * ``ts
   * x = new BigNumber('-0')
   * x.toString()                    // '0'
   * x.valueOf()                     // '-0'
   * y = new BigNumber('1.777e+457')
   * y.valueOf()                     // '1.777e+457'
   * ```
   */
  valueOf(): string;

  /**
   * Returns a new independent BigNumber constructor with configuration as described by `object`, or
   * with the default configuration if object is `null` or `undefined`.
   *
   * Throws if `object` is not an object.
   *
   * ```ts
   * BigNumber.config({ DECIMAL_PLACES: 5 })
   * BN = BigNumber.clone({ DECIMAL_PLACES: 9 })
   *
   * x = new BigNumber(1)
   * y = new BN(1)
   *
   * x.div(3)                        // 0.33333
   * y.div(3)                        // 0.333333333
   *
   * // BN = BigNumber.clone({ DECIMAL_PLACES: 9 }) is equivalent to:
   * BN = BigNumber.clone()
   * BN.config({ DECIMAL_PLACES: 9 })
   * ```
   *
   * @param [object] The configuration object.
   */
  static clone(object?: BigNumberConfig): BigNumberConstructor;

  /**
   * Configures the settings that apply to this BigNumber constructor.
   *
   * The configuration object, `object`, contains any number of the properties shown in the example
   * below.
   *
   * Returns an object with the above properties and their current values.
   *
   * Throws if `object` is not an object, or if an invalid value is assigned to one or more of the
   * properties.
   *
   * ```ts
   * BigNumber.config({
   *     DECIMAL_PLACES: 40,
   *     ROUNDING_MODE: BigNumber.ROUND_HALF_CEIL,
   *     EXPONENTIAL_AT: [-10, 20],
   *     RANGE: [-500, 500],
   *     CRYPTO: true,
   *     MODULO_MODE: BigNumber.ROUND_FLOOR,
   *     POW_PRECISION: 80,
   *     FORMAT: {
   *         groupSize: 3,
   *         groupSeparator: ' ',
   *         decimalSeparator: ','
   *     },
   *     ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
   * });
   *
   * BigNumber.config().DECIMAL_PLACES        // 40
   * ```
   *
   * @param object The configuration object.
   */
  static config(object: BigNumberConfig): BigNumberConfig;

  /**
   * Returns `true` if `value` is a BigNumber instance, otherwise returns `false`.
   *
   * ```ts
   * x = 42
   * y = new BigNumber(x)
   *
   * BigNumber.isBigNumber(x)             // false
   * y instanceof BigNumber               // true
   * BigNumber.isBigNumber(y)             // true
   *
   * BN = BigNumber.clone();
   * z = new BN(x)
   * z instanceof BigNumber               // false
   * BigNumber.isBigNumber(z)             // true
   * ```
   *
   * @param value The value to test.
   */
  static isBigNumber(value: any): boolean;

  /**
   *
   * Returns a BigNumber whose value is the maximum of the arguments.
   *
   * Accepts either an argument list or an array of values.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * x = new BigNumber('3257869345.0378653')
   * BigNumber.maximum(4e9, x, '123456789.9')      // '4000000000'
   *
   * arr = [12, '13', new BigNumber(14)]
   * BigNumber.maximum(arr)                        // '14'
   * ```
   *
   * @param n A numeric value.
   */
  static maximum(...n: BigNumberValue[]): BigNumber;

  /**
   * Returns a BigNumber whose value is the maximum of the arguments.
   *
   * Accepts either an argument list or an array of values.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * x = new BigNumber('3257869345.0378653')
   * BigNumber.max(4e9, x, '123456789.9')      // '4000000000'
   *
   * arr = [12, '13', new BigNumber(14)]
   * BigNumber.max(arr)                        // '14'
   * ```
   *
   * @param n A numeric value.
   */
  static max(...n: BigNumberValue[]): BigNumber;

  /**
   * Returns a BigNumber whose value is the minimum of the arguments.
   *
   * Accepts either an argument list or an array of values.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * x = new BigNumber('3257869345.0378653')
   * BigNumber.minimum(4e9, x, '123456789.9')          // '123456789.9'
   *
   * arr = [2, new BigNumber(-14), '-15.9999', -12]
   * BigNumber.minimum(arr)                            // '-15.9999'
   * ```
   *
   * @param n A numeric value.
   */
  static minimum(...n: BigNumberValue[]): BigNumber;

  /**
   * Returns a BigNumber whose value is the minimum of the arguments.
   *
   * Accepts either an argument list or an array of values.
   *
   * The return value is always exact and unrounded.
   *
   * ```ts
   * x = new BigNumber('3257869345.0378653')
   * BigNumber.min(4e9, x, '123456789.9')             // '123456789.9'
   *
   * arr = [2, new BigNumber(-14), '-15.9999', -12]
   * BigNumber.min(arr)                               // '-15.9999'
   * ```
   *
   * @param n A numeric value.
   */
  static min(...n: BigNumberValue[]): BigNumber;

  /**
   * Returns a new BigNumber with a pseudo-random value equal to or greater than 0 and less than 1.
   *
   * The return value will have `decimalPlaces` decimal places, or less if trailing zeros are
   * produced. If `decimalPlaces` is omitted, the current `DECIMAL_PLACES` setting will be used.
   *
   * Depending on the value of this BigNumber constructor's `CRYPTO` setting and the support for the
   * `crypto` object in the host environment, the random digits of the return value are generated by
   * either `Math.random` (fastest), `crypto.getRandomValues` (Web Cryptography API in recent
   * browsers) or `crypto.randomBytes` (Node.js).
   *
   * If `CRYPTO` is true, i.e. one of the `crypto` methods is to be used, the value of a returned
   * BigNumber should be cryptographically secure and statistically indistinguishable from a random
   * value.
   *
   * Throws if `decimalPlaces` is invalid.
   *
   * ```ts
   * BigNumber.config({ DECIMAL_PLACES: 10 })
   * BigNumber.random()              // '0.4117936847'
   * BigNumber.random(20)            // '0.78193327636914089009'
   * ```
   *
   * @param [decimalPlaces] Decimal places, integer, 0 to 1e+9.
   */
  static random(decimalPlaces?: number): BigNumber;

  /**
   * Configures the settings that apply to this BigNumber constructor.
   *
   * The configuration object, `object`, contains any number of the properties shown in the example
   * below.
   *
   * Returns an object with the above properties and their current values.
   *
   * Throws if `object` is not an object, or if an invalid value is assigned to one or more of the
   * properties.
   *
   * ```ts
   * BigNumber.set({
   *     DECIMAL_PLACES: 40,
   *     ROUNDING_MODE: BigNumber.ROUND_HALF_CEIL,
   *     EXPONENTIAL_AT: [-10, 20],
   *     RANGE: [-500, 500],
   *     CRYPTO: true,
   *     MODULO_MODE: BigNumber.ROUND_FLOOR,
   *     POW_PRECISION: 80,
   *     FORMAT: {
   *         groupSize: 3,
   *         groupSeparator: ' ',
   *         decimalSeparator: ','
   *     },
   *     ALPHABET: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
   * });
   *
   * BigNumber.set().DECIMAL_PLACES        // 40
   * ```
   *
   * @param object The configuration object.
   */
  static set(object: BigNumberConfig): BigNumberConfig;

  /**
   * Helps ES6 import.
   */
  private static readonly default?: BigNumberConstructor;

  /**
   * Helps ES6 import.
   */
  private static readonly BigNumber?: BigNumberConstructor;

  /**
   * Rounds away from zero.
   */
  static readonly ROUND_UP: 0;

  /**
   * Rounds towards zero.
   */
  static readonly ROUND_DOWN: 1;

  /**
   * Rounds towards Infinity.
   */
  static readonly ROUND_CEIL: 2;

  /**
   * Rounds towards -Infinity.
   */
  static readonly ROUND_FLOOR: 3;

  /**
   * Rounds towards nearest neighbour. If equidistant, rounds away from zero .
   */
  static readonly ROUND_HALF_UP: 4;

  /**
   * Rounds towards nearest neighbour. If equidistant, rounds towards zero.
   */
  static readonly ROUND_HALF_DOWN: 5;

  /**
   * Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour.
   */
  static readonly ROUND_HALF_EVEN: 6;

  /**
   * Rounds towards nearest neighbour. If equidistant, rounds towards Infinity.
   */
  static readonly ROUND_HALF_CEIL: 7;

  /**
   * Rounds towards nearest neighbour. If equidistant, rounds towards -Infinity.
   */
  static readonly ROUND_HALF_FLOOR: 8;

  /**
   * See `MODULO_MODE`.
   */
  static readonly EUCLID: 9;

  /**
   * The number 0 (zero).
   */
  static readonly ZERO: BigNumber;

  /**
   * The number 1 (one).
   */
  static readonly ONE: BigNumber;
}


export default BigNumber;

export namespace BigNumber {
  export type Config = BigNumberConfig;
  export type Constructor = BigNumberConstructor;
  export type Format = BigNumberFormat;
  export type Instance = BigNumberInstance;
  export type ModuloMode = BigNumberModuloMode;
  export type RoundingMode = BigNumberRoundingMode;
  export type Value = BigNumberValue;
}

/**
 * Browsers.
 */
declare global {
  const BigNumber: BigNumberConstructor;
  type BigNumber = BigNumberInstance;

  namespace BigNumber {
    type Config = BigNumberConfig;
    type Constructor = BigNumberConstructor;
    type Format = BigNumberFormat;
    type Instance = BigNumberInstance;
    type ModuloMode = BigNumberModuloMode;
    type RoundingMode = BigNumberRoundingMode;
    type Value = BigNumberValue;
  }
}
