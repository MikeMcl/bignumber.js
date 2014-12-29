/*! bignumber.js v2.0.0 https://github.com/MikeMcl/bignumber.js/LICENCE */

;(function (global) {
    'use strict';

    /*
      bignumber.js v2.0.0
      A JavaScript library for arbitrary-precision arithmetic.
      https://github.com/MikeMcl/bignumber.js
      Copyright (c) 2014 Michael Mclaughlin <M8ch88l@gmail.com>
      MIT Expat Licence
    */

    /*********************************** DEFAULTS ************************************/

    /*
     * The default values below must be integers within the inclusive ranges stated.
     * Most of these values can be changed at run-time using the BigNumber.config method.
     */

    /*
     * The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP,
     * MAX_EXP, and the argument to toExponential, toFixed, toFormat, and toPrecision,
     * beyond which an exception is thrown (if ERRORS is true).
     */
    var MAX = 1E9,                                   // 0 to 1e+9

        // Limit of magnitude of exponent argument to toPower.
        MAX_POWER = 1E6,                             // 1 to 1e+6

        // The maximum number of decimal places for operations involving division.
        DECIMAL_PLACES = 20,                         // 0 to MAX

        /*
         * The rounding mode used when rounding to the above decimal places, and when using
         * toExponential, toFixed, toFormat and toPrecision, and round (default value).
         * UP         0 Away from zero.
         * DOWN       1 Towards zero.
         * CEIL       2 Towards +Infinity.
         * FLOOR      3 Towards -Infinity.
         * HALF_UP    4 Towards nearest neighbour. If equidistant, up.
         * HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
         * HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
         * HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
         * HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
         */
        ROUNDING_MODE = 4,                           // 0 to 8

        // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

        // The exponent value at and beneath which toString returns exponential notation.
        // Number type: -7
        TO_EXP_NEG = -7,                             // 0 to -MAX

        // The exponent value at and above which toString returns exponential notation.
        // Number type: 21
        TO_EXP_POS = 21,                             // 0 to MAX

        // RANGE : [MIN_EXP, MAX_EXP]

        // The minimum exponent value, beneath which underflow to zero occurs.
        // Number type: -324  (5e-324)
        MIN_EXP = -MAX,                              // -1 to -MAX

        // The maximum exponent value, above which overflow to Infinity occurs.
        // Number type:  308  (1.7976931348623157e+308)
        MAX_EXP = MAX,                               // 1 to MAX

        // Whether BigNumber Errors are ever thrown.
        // CHANGE parseInt to parseFloat if changing ERRORS to false.
        ERRORS = true,                               // true or false
        parse = parseInt,                            // parseInt or parseFloat

        // Format specification for the BigNumber.prototype.toFormat method.
        FORMAT = {
            decimalSeparator: '.',
            groupSeparator: ',',
            groupSize: 3,
            secondaryGroupSize: 0,
            fractionGroupSeparator: '\xA0',              // non-breaking space
            fractionGroupSize: 0
        },

    /***********************************************************************************/

        P = BigNumber.prototype,
        DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',
        outOfRange,
        id = 0,
        mathfloor = Math.floor,
        isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        trim = String.prototype.trim || function () {return this.replace(/^\s+|\s+$/g, '')},
        BASE = 1e14,
        LOG_BASE = 14,
        SQRT_BASE = 1e7,
        POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
        ONE = new BigNumber(1);


    // CONSTRUCTOR


    /*
     * The exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * v {number|string|BigNumber} A numeric value.
     * [b] {number} The base of v. Integer, 2 to 64 inclusive.
     */
    function BigNumber( n, b ) {
        var d, e, i, isNum, str, valid,
            x = this;

        // Enable constructor usage without new.
        if ( !( x instanceof BigNumber ) ) return new BigNumber( n, b );

        // Duplicate.
        if ( n instanceof BigNumber ) {

            if ( b == null ) {
                id = 0;
                x['s'] = n['s'];
                x['e'] = n['e'];
                x['c'] = ( n = n['c'] ) ? n.slice() : n;
                return;
            }
            n += '';
        } else if ( isNum = ( str = typeof n ) == 'number' ) {

            // Fast path for integers.
            if ( b == null && n === ~~n ) {
                x['s'] = 1 / n < 0 ? ( n = -n, -1 ) : 1;
                for ( e = id = 0, i = n; i >= 10; i /= 10, e++ );
                x['e'] = e;
                x['c'] = [n];
                return;
            }

            // Minus zero?
            n = n === 0 && 1 / n < 0 ? '-0' : n + '';
        } else if ( str != 'string' ) {
            n += '';
        }
        str = n;

        if ( b == null && isValid.test(str) ) {

            // Determine sign.
            x['s'] = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;

        // Either str is not a valid BigNumber or a base has been specified.
        } else {

            // Enable exponential notation to be used with base 10 argument.
            // Ensure return value is rounded to DECIMAL_PLACES as with other bases.
            if ( b == 10 ) {
                x = new BigNumber(str);
                return rnd( x, DECIMAL_PLACES + x['e'] + 1, ROUNDING_MODE );
            }
            str = trim.call(str).replace( /^\+(?!-)/, '' );
            x['s'] = str.charCodeAt(0) === 45 ? ( str = str.replace( /^-(?!-)/, '' ), -1 ) : 1;

            if ( b != null ) {

                if ( ( b == ~~b || !ERRORS ) && !( outOfRange = !( b >= 2 && b < 65 ) ) ) {
                    d = '[' + DIGITS.slice( 0, b = b | 0 ) + ']+';

                    // Before non-decimal number validity test and base conversion
                    // remove the `.` from e.g. '1.', and replace e.g. '.1' with '0.1'.
                    str = str.replace( /\.$/, '' ).replace( /^\./, '0.' );

                    // Any number in exponential form will fail due to the e+/-.
                    if ( valid = new RegExp( '^' + d + '(?:\\.' + d + ')?$',
                      b < 37 ? 'i' : '' ).test(str) ) {

                        if (isNum) {

                            if ( str.replace( /^0\.0*|\./, '' ).length > 15 ) {

                        // 'new BigNumber() number type has more than 15 significant digits: {n}'
                                ifExceptionsThrow( n, 0 );
                            }

                            // Prevent later check for length on converted number.
                            isNum = !isNum;
                        }
                        str = convertBase( str, 10, b, x['s'] );
                    } else if ( str != 'Infinity' && str != 'NaN' ) {

                        // 'new BigNumber() not a base {b} number: {str}'
                        ifExceptionsThrow( n, 1, b );
                        n = 'NaN';
                    }
                } else {

                    // 'new BigNumber() base not an integer: {b}'
                    // 'new BigNumber() base out of range: {b}'
                    ifExceptionsThrow( b, 2 );

                    // Ignore base.
                    valid = isValid.test(str);
                }
            } else {
                valid = isValid.test(str);
            }

            if ( !valid ) {

                // Infinity/NaN
                x['c'] = x['e'] = null;

                // NaN
                if ( str != 'Infinity' ) {

                    // No exception on NaN.
                    // 'new BigNumber() not a number: {n}'
                    if ( str != 'NaN' ) ifExceptionsThrow( n, 3 );
                    x['s'] = null;
                }
                id = 0;

                return;
            }
        }

        // Decimal point?
        if ( ( e = str.indexOf('.') ) > -1 ) str = str.replace( '.', '' );

        // Exponential form?
        if ( ( i = str.search( /e/i ) ) > 0 ) {

            // Determine exponent.
            if ( e < 0 ) e = i;
            e += +str.slice( i + 1 );
            str = str.substring( 0, i );
        } else if ( e < 0 ) {

            // Integer.
            e = str.length;
        }

        // Determine leading zeros.
        for ( i = 0; str.charCodeAt(i) === 48; i++ );

        // Determine trailing zeros.
        for ( b = str.length; str.charCodeAt(--b) === 48; );
        str = str.slice( i, b + 1 );

        if (str) {
            b = str.length;

            // Disallow numbers with over 15 significant digits if number type.
            // 'new BigNumber() number type has more than 15 significant digits: {n}'
            if ( isNum && b > 15 ) ifExceptionsThrow( n, 0 );
            e = e - i - 1;

             // Overflow?
            if ( e > MAX_EXP ) {

                // Infinity.
                x['c'] = x['e'] = null;

            // Underflow?
            } else if ( e < MIN_EXP ) {

                // Zero.
                x['c'] = [ x['e'] = 0 ];
            } else {
                x['e'] = e;
                x['c'] = [];

                // Transform base

                // e is the base 10 exponent.
                // i is where to slice str to get the first element of the coefficient array.
                i = ( e + 1 ) % LOG_BASE;
                if ( e < 0 ) i += LOG_BASE;

                // b is str.length.
                if ( i < b ) {
                    if (i) x['c'].push( +str.slice( 0, i ) );
                    for ( b -= LOG_BASE; i < b; x['c'].push( +str.slice( i, i += LOG_BASE ) ) );
                    str = str.slice(i);
                    i = LOG_BASE - str.length;
                } else {
                    i -= b;
                }

                for ( ; i--; str += '0' );
                x['c'].push( +str );
            }
        } else {

            // Zero.
            x['c'] = [ x['e'] = 0 ];
        }
        id = 0;
    }


    // CONSTRUCTOR PROPERTIES/METHODS


    BigNumber['ROUND_UP'] = 0;
    BigNumber['ROUND_DOWN'] = 1;
    BigNumber['ROUND_CEIL'] = 2;
    BigNumber['ROUND_FLOOR'] = 3;
    BigNumber['ROUND_HALF_UP'] = 4;
    BigNumber['ROUND_HALF_DOWN'] = 5;
    BigNumber['ROUND_HALF_EVEN'] = 6;
    BigNumber['ROUND_HALF_CEIL'] = 7;
    BigNumber['ROUND_HALF_FLOOR'] = 8;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object or an argument list, with one or many of the following properties or
     * parameters respectively:
     * [ DECIMAL_PLACES [, ROUNDING_MODE [, EXPONENTIAL_AT [, RANGE [, ERRORS [, FORMAT ]]]]]]
     *
     *   DECIMAL_PLACES  {number}  Integer, 0 to MAX inclusive.
     *   ROUNDING_MODE   {number}  Integer, 0 to 8 inclusive.
     *   EXPONENTIAL_AT  {number|number[]}  Integer, -MAX to MAX inclusive or
     *                                      [ integer -MAX to 0 incl., 0 to MAX incl. ].
     *   RANGE           {number|number[]}  Non-zero integer, -MAX to MAX inclusive or
     *                                      [ integer -MAX to -1 incl., integer 1 to MAX incl. ].
     *   ERRORS          {boolean|number}   true, false, 1 or 0.
     *   FORMAT          {object}           See BigNumber.prototype.toFormat.
     *      decimalSeparator       {string}
     *      groupSeparator         {string}
     *      groupSize              {number}
     *      secondaryGroupSize     {number}
     *      fractionGroupSeparator {string}
     *      fractionGroupSize      {number}
     *
     * The validity of the values assigned to the above FORMAT object properties is not checked.
     *
     * E.g.
     * BigNumber.config(20, 4) is equivalent to
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined.
     * Return an object with the properties current values.
     */
    BigNumber['config'] = function () {
        var v, p,
            i = 0,
            r = {},
            a = arguments,
            o = a[0],
            c = 'config',
            inRange = function ( n, lo, hi ) {
              return !( ( outOfRange = n < lo || n > hi ) || parse(n) != n && n !== 0 );
            },
            has = o && typeof o == 'object'
              ? function () {if ( o.hasOwnProperty(p) ) return ( v = o[p] ) != null}
              : function () {if ( a.length > i ) return ( v = a[i++] ) != null};

        // [DECIMAL_PLACES] {number} Integer, 0 to MAX inclusive.
        if ( has( p = 'DECIMAL_PLACES' ) ) {

            if ( inRange( v, 0, MAX ) ) {
                DECIMAL_PLACES = v | 0;
            } else {

                // 'config() DECIMAL_PLACES not an integer: {v}'
                // 'config() DECIMAL_PLACES out of range: {v}'
                ifExceptionsThrow( v, p, c );
            }
        }
        r[p] = DECIMAL_PLACES;

        // [ROUNDING_MODE] {number} Integer, 0 to 8 inclusive.
        if ( has( p = 'ROUNDING_MODE' ) ) {

            if ( inRange( v, 0, 8 ) ) {
                ROUNDING_MODE = v | 0;
            } else {

                // 'config() ROUNDING_MODE not an integer: {v}'
                // 'config() ROUNDING_MODE out of range: {v}'
                ifExceptionsThrow( v, p, c );
            }
        }
        r[p] = ROUNDING_MODE;

        // [EXPONENTIAL_AT] {number|number[]}
        // Integer, -MAX to MAX inclusive or [ integer -MAX to 0 inclusive, 0 to MAX inclusive ].
        if ( has( p = 'EXPONENTIAL_AT' ) ) {

            if ( inRange( v, -MAX, MAX ) ) {
                TO_EXP_NEG = -( TO_EXP_POS = ~~( v < 0 ? -v : +v ) );
            } else if ( !outOfRange && v && inRange( v[0], -MAX, 0 ) && inRange( v[1], 0, MAX ) ) {
                TO_EXP_NEG = ~~v[0];
                TO_EXP_POS = ~~v[1];
            } else {

                // 'config() EXPONENTIAL_AT not an integer or not [integer, integer]: {v}'
                // 'config() EXPONENTIAL_AT out of range or not [negative, positive: {v}'
                ifExceptionsThrow( v, p, c, 1 );
            }
        }
        r[p] = [ TO_EXP_NEG, TO_EXP_POS ];

        // [RANGE][ {number|number[]} Non-zero integer, -MAX to MAX inclusive or
        // [ integer -MAX to -1 inclusive, integer 1 to MAX inclusive ].
        if ( has( p = 'RANGE' ) ) {

            if ( inRange( v, -MAX, MAX ) && ~~v ) {
                MIN_EXP = -( MAX_EXP = ~~( v < 0 ? -v : +v ) );
            } else if ( !outOfRange && v && inRange( v[0], -MAX, -1 ) && inRange( v[1], 1, MAX ) ) {
                MIN_EXP = ~~v[0];
                MAX_EXP = ~~v[1];
            } else {

                // 'config() RANGE not a non-zero integer or not [integer, integer]: {v}'
                // 'config() RANGE out of range or not [negative, positive: {v}'
                ifExceptionsThrow( v, p, c, 1, 1 );
            }
        }
        r[p] = [ MIN_EXP, MAX_EXP ];

        // [ERRORS] {boolean|number} true, false, 1 or 0.
        if ( has( p = 'ERRORS' ) ) {

            if ( v === !!v || v === 1 || v === 0 ) {
                outOfRange = id = 0;
                parse = ( ERRORS = !!v ) ? parseInt : parseFloat;
            } else {

                // 'config() ERRORS not a boolean or binary digit: {v}'
                ifExceptionsThrow( v, p, c, 0, 0, 1 );
            }
        }
        r[p] = ERRORS;

        // [FORMAT] {object}
        if ( has( p = 'FORMAT' ) ) {

            if ( typeof v == 'object' ) {
                FORMAT = v;
            } else if (ERRORS) {

                // 'config() FORMAT not an object: {v}'
                r = new Error( c + '() ' + p + ' not an object: ' + v );
                r['name'] = 'BigNumber Error';
                throw r;
            }
        }
        r[p] = FORMAT;

        return r;
    };


    // PRIVATE FUNCTIONS


    /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */
    function normalise( bn, c, e ) {
        var i = 1,
            j = c.length;

         // Remove trailing zeros.
        for ( ; !c[--j]; c.pop() );

        // Calculate the base 10 exponent. First get the number of digits of c[0].
        for ( j = c[0]; j >= 10; j /= 10, i++ );

        // Overflow?
        if ( ( e = i + e * LOG_BASE - 1 ) > MAX_EXP ) {

            // Infinity.
            bn['c'] = bn['e'] = null;

        // Underflow?
        } else if ( e < MIN_EXP ) {

            // Zero.
            bn['c'] = [ bn['e'] = 0 ];
        } else {
            bn['e'] = e;
            bn['c'] = c;
        }

        return bn;
    }


    /*
     * Returns the coefficient array as a string of base 10 digits.
     */
    function coefficientToString(a) {
        var s, z,
            i = 1,
            j = a.length,
            r = a[0] + '';

        for ( ; i < j; ) {
            s = a[i++] + '';
            z = LOG_BASE - s.length;
            for ( ; z--; s = '0' + s );
            r += s;
        }

        // '0'
        for ( j = r.length; r.charCodeAt(--j) === 48; );

        return r.slice( 0, j + 1 || 1 );
    }


    /*
     * Convert string of baseIn to an array of numbers of baseOut.
     * Eg. convertBase('255', 10, 16) returns [15, 15].
     * Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
     */
    function toBaseOut( str, baseIn, baseOut ) {
        var j,
            arr = [0],
            arrL,
            i = 0,
            strL = str.length;

        for ( ; i < strL; ) {
            for ( arrL = arr.length; arrL--; arr[arrL] *= baseIn );
            arr[ j = 0 ] += DIGITS.indexOf( str.charAt( i++ ) );

            for ( ; j < arr.length; j++ ) {

                if ( arr[j] > baseOut - 1 ) {
                    if ( arr[j + 1] == null ) arr[j + 1] = 0;
                    arr[j + 1] += arr[j] / baseOut | 0;
                    arr[j] %= baseOut;
                }
            }
        }

        return arr.reverse();
    }

    /*
     * Convert a numeric string of baseIn to a numeric string of baseOut.
     */
    function convertBase( str, baseOut, baseIn, sign ) {
        var d, e, j, r, x, xc, y,
            i = str.indexOf( '.' ),
            rm = ROUNDING_MODE;

        if ( baseIn < 37 ) str = str.toLowerCase();

        // Non-integer.
        if ( i >= 0 ) {
            str = str.replace( '.', '' );
            y = new BigNumber(baseIn);
            x = y['pow']( str.length - i );

            // Convert str as if an integer, then restore the fraction part by dividing the result
            // by its base raised to a power. Use toFixed to avoid possible exponential notation.
            y['c'] = toBaseOut( x.toFixed(), 10, baseOut );
            y['e'] = y['c'].length;
        }

        // Convert the number as integer.
        xc = toBaseOut( str, baseIn, baseOut );
        e = j = xc.length;

        // Remove trailing zeros.
        for ( ; xc[--j] == 0; xc.pop() );
        if ( !xc[0] ) return '0';

        if ( i < 0 ) {
            --e;
        } else {
            x['c'] = xc;
            x['e'] = e;
            // sign is needed for correct rounding.
            x['s'] = sign;
            x = div( x, y, DECIMAL_PLACES, rm, baseOut );
            xc = x['c'];
            r = x['r'];
            e = x['e'];
        }
        d = e + DECIMAL_PLACES + 1;

        // The rounding digit, i.e. the digit after the digit that may be rounded up.
        i = xc[d];
        j = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4
          ? ( i != null || r ) && ( rm == 0 || rm == ( x['s'] < 0 ? 3 : 2 ) )
          : i > j || i == j &&
            ( rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == ( x['s'] < 0 ? 8 : 7 ) );

        if ( d < 1 || !xc[0] ) {
            xc.length = 1;
            j = 0;

            if (r) {

                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                xc[0] = 1;
                e = -DECIMAL_PLACES;
            } else {

                // Zero.
                e = xc[0] = 0;
            }
        } else {
            xc.length = d;

            if (r) {

                // Rounding up may mean the previous digit has to be rounded up and so on.
                for ( --baseOut; ++xc[--d] > baseOut; ) {
                    xc[d] = 0;

                    if ( !d ) {
                        ++e;
                        xc.unshift(1);
                    }
                }
            }

            // Determine trailing zeros.
            for ( j = xc.length; !xc[--j]; );
        }

        // E.g. [4, 11, 15] becomes 4bf.
        for ( i = 0, str = ''; i <= j; str += DIGITS.charAt( xc[i++] ) );

        // Negative exponent?
        if ( e < 0 ) {

            // Prepend zeros.
            for ( ; ++e; str = '0' + str );
            str = '0.' + str;

        // Positive exponent?
        } else {
            i = str.length;

            // Append zeros.
            if ( ++e > i ) {
                for ( e -= i; e-- ; str += '0' );
            } else if ( e < i ) {
                str = str.slice( 0, e ) + '.' + str.slice(e);
            }
        }

        // No negative numbers: the caller will add the sign.
        return str;
    }


    /*
     * Perform division in the specified base. Called by div and convertBase.
     */
    var div = ( function () {

        // Assumes non-zero x and k.
        function multiply( x, k, base ) {
            var m, temp, xlo, xhi,
                carry = 0,
                i = x.length,
                klo = k % SQRT_BASE,
                khi = k / SQRT_BASE | 0;

            for ( x = x.slice(); i--; ) {
                xlo = x[i] % SQRT_BASE;
                xhi = x[i] / SQRT_BASE | 0;
                m = khi * xlo + xhi * klo;
                temp = klo * xlo + ( ( m % SQRT_BASE ) * SQRT_BASE ) + carry;
                carry = ( temp / base | 0 ) + ( m / SQRT_BASE | 0 ) + khi * xhi;
                x[i] = temp % base;
            }
            if (carry) x.unshift(carry);

            return x;
        }

        function compare( a, b, aL, bL ) {
            var i, cmp;

            if ( aL != bL ) {
                cmp = aL > bL ? 1 : -1;
            } else {

                for ( i = cmp = 0; i < aL; i++ ) {

                    if ( a[i] != b[i] ) {
                        cmp = a[i] > b[i] ? 1 : -1;
                        break;
                    }
                }
            }
            return cmp;
        }

        function subtract( a, b, aL, base ) {
            var i = 0;

            // Subtract b from a.
            for ( ; aL--; ) {
                a[aL] -= i;
                i = a[aL] < b[aL] ? 1 : 0;
                a[aL] = i * base + a[aL] - b[aL];
            }

            // Remove leading zeros.
            for ( ; !a[0] && a.length > 1; a.shift() );
        }

        // x: dividend, y: divisor.
        return function ( x, y, dp, rm, base ) {
            var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
                yL, yz,
                s = x['s'] == y['s'] ? 1 : -1,
                xc = x['c'],
                yc = y['c'];

            // Either NaN, Infinity or 0?
            if ( !xc || !xc[0] || !yc || !yc[0] ) {

                return new BigNumber(

                  // Return NaN if either NaN, or both Infinity or 0.
                  !x['s'] || !y['s'] || ( xc ? yc && xc[0] == yc[0] : !yc ) ? NaN :

                    // Return +-0 if x is 0 or y is +-Infinity, or return +-Infinity as y is 0.
                    xc && xc[0] == 0 || !yc ? s * 0 : s / 0
                );
            }

            q = new BigNumber(s);
            qc = q['c'] = [];
            e = x['e'] - y['e'];
            s = dp + e + 1;

            if ( !base ) {
                base = BASE;

                //e = mathfloor( x['e'] / LOG_BASE ) - mathfloor( y['e'] / LOG_BASE );
                e = ( xL = x['e'] / LOG_BASE, i = xL | 0, xL > 0 || xL === i ? i : i - 1 ) -
                    ( yL = y['e'] / LOG_BASE, i = yL | 0, yL > 0 || yL === i ? i : i - 1 );

                s = s / LOG_BASE | 0;
            }

            // Result exponent may be one less then the current value of e.
            // The coefficients of the BigNumbers from convertBase may have trailing zeros.
            for ( i = 0; yc[i] == ( xc[i] || 0 ); i++ );
            if ( yc[i] > ( xc[i] || 0 ) ) e--;

            if ( s < 0 ) {
                qc.push(1);
                more = true;
            } else {
                xL = xc.length;
                yL = yc.length;
                i = 0;
                s += 2;

                /*
                // TODO: fast path division when divisor < base
                if ( yL == 1 ) {
                    n = 0;
                    yc = yc[0];
                    s++;
                    // n is the carry.
                    for ( ; ( i < xL || n ) && s--; i++ ) {
                        // Can't use this, it will overflow 2^53.
                        var t = n * base + ( xc[i] || 0 );
                        qc[i] = mathfloor( t / yc );
                        n = t % yc;
                    }
                    more = n || i < xL;

                // divisor >= base
                } else {
                */
                    // Normalise xc and yc so highest order digit of yc is >= base/2

                    n = mathfloor( base / ( yc[0] + 1 ) );

                    if ( n > 1 ) {
                        yc = multiply( yc, n, base );
                        xc = multiply( xc, n, base );
                        yL = yc.length;
                        xL = xc.length;
                    }

                    xi = yL;
                    rem = xc.slice( 0, yL );
                    remL = rem.length;

                    // Add zeros to make remainder as long as divisor.
                    for ( ; remL < yL; rem[remL++] = 0 );
                    yz = yc.slice();
                    yz.unshift(0);
                    yc0 = yc[0];
                    if ( yc[1] >= base / 2 ) yc0++;

                    do {
                        n = 0;

                        // Compare divisor and remainder.
                        cmp = compare( yc, rem, yL, remL );

                        // If divisor < remainder.
                        if ( cmp < 0 ) {

                            // Calculate trial digit, n.

                            rem0 = rem[0];
                            if ( yL != remL ) rem0 = rem0 * base + ( rem[1] || 0 );

                            // n is how many times the divisor goes into the current remainder.
                            n = mathfloor( rem0 / yc0 );


                            //  Algorithm:
                            //  1. product = divisor * trial digit (n)
                            //  2. if product > remainder: product -= divisor, n--
                            //  3. remainder -= product
                            //  4. if product was < remainder at 2:
                            //    5. compare new remainder and divisor
                            //    6. If remainder > divisor: remainder -= divisor, n++

                            if ( n > 1 ) {
                                if ( n >= base ) n = base - 1;

                                // product = divisor * trial digit.
                                prod = multiply( yc, n, base );
                                prodL = prod.length;
                                remL = rem.length;

                                // Compare product and remainder.
                                cmp = compare( prod, rem, prodL, remL );

                                // product > remainder.
                                if ( cmp == 1 ) {
                                    n--;

                                    // Subtract divisor from product.
                                    subtract( prod, yL < prodL ? yz : yc, prodL, base );
                                }
                            } else {

                                // cmp is -1.
                                // If n is 0, there is no need to compare yc and rem again below,
                                // so change cmp to 1 to avoid it.
                                // If n is 1, compare yc and rem again below.
                                if ( n == 0 ) cmp = n = 1;
                                prod = yc.slice();
                            }

                            prodL = prod.length;
                            if ( prodL < remL ) prod.unshift(0);

                            // Subtract product from remainder.
                            subtract( rem, prod, remL, base );

                            // If product was < previous remainder.
                            if ( cmp == -1 ) {
                                remL = rem.length;

                                // Compare divisor and new remainder.
                                cmp = compare( yc, rem, yL, remL );

                                // If divisor < new remainder, subtract divisor from remainder.
                                if ( cmp < 1 ) {
                                    n++;

                                    // Subtract divisor from remainder.
                                    subtract( rem, yL < remL ? yz : yc, remL, base );
                                }
                            }
                            remL = rem.length;
                        } else if ( cmp === 0 ) {
                            n++;
                            rem = [0];
                        }    // if cmp === 1, n will be 0

                        // Add the next digit, n, to the result array.
                        qc[i++] = n;

                        // Update the remainder.
                        if ( cmp && rem[0] ) {
                            rem[remL++] = xc[xi] || 0;
                        } else {
                            rem = [ xc[xi] ];
                            remL = 1;
                        }
                    } while ( ( xi++ < xL || rem[0] != null ) && s-- );

                    more = rem[0] != null;
                //}

                // Leading zero?
                if ( !qc[0] ) qc.shift();
            }

            if ( base == BASE ) {

                // To calculate q.e, first get the number of digits of qc[0].
                for ( i = 1, s = qc[0]; s >= 10; s /= 10, i++ );
                rnd( q, dp + ( q['e'] = i + e * LOG_BASE - 1 ) + 1, rm, more );

            // div is being used for base conversion.
            } else {
                q['e'] = e;
                q['r'] = +more;
            }
            return q;
        };
    })();


    /*
     * Return a string representing the value of BigNumber n in normal or exponential notation
     * rounded to the specified decimal places or significant digits.
     *
     * Called by toString (k: 1), toExponential (k: 1), toFixed (k: undefined), toPrecision (k: 2).
     * i is the index (with the value in normal notation) of the digit that may be rounded up.
     * d is the number of digits required including fraction-part trailing zeros.
     * z is the number of zeros to be appended.
     */
    function format( n, i, k ) {
        var d, str, z,
            e = ( n = new BigNumber(n) )['e'];

        // i == null when toExponential(no arg), or toString() when x >= toExpPos etc.
        if ( i == null ) {
            d = 0;
        } else {
            rnd( n, ++i, ROUNDING_MODE );

            // n['e'] may have changed if the value was rounded up.
            d = k ? i : i + n['e'] - e;
            e = n['e'];
        }
        str = coefficientToString( n['c'] );

        // toPrecision returns exponential notation if the number of significant digits specified
        // is less than the number of digits necessary to represent the integer part of the value
        // in normal notation.

        // Exponential notation.
        if ( k == 1 || k == 2 && ( i <= e || e <= TO_EXP_NEG ) ) {

            // Append zeros?
            for ( ; str.length < d; str += '0' );
            if ( str.length > 1 ) str = str.charAt(0) + '.' + str.slice(1);
            str += ( e < 0 ? 'e' : 'e+' ) + e;

        // Fixed point notation.
        } else {
            k = str.length;

            // Negative exponent?
            if ( e < 0 ) {
                z = d - k;

                // Prepend zeros.
                for ( ; ++e; str = '0' + str );
                str = '0.' + str;

            // Positive exponent?
            } else {

                if ( ++e > k ) {
                    z = d - e;

                    // Append zeros.
                    for ( e -= k; e-- ; str += '0' );
                    if ( z > 0 ) str += '.';
                } else {
                    z = d - k;

                    if ( e < k ) {
                        str = str.slice( 0, e ) + '.' + str.slice(e);
                    } else if ( z > 0 ) {
                        str += '.';
                    }
                }
            }

            // Append more zeros?
            if ( z > 0 ) for ( ; z--; str += '0' );
        }
        return n['s'] < 0 && n['c'][0] ? '-' + str : str;
    }


    // Assemble error messages. Throw BigNumber Errors.
    function ifExceptionsThrow( arg, i, j, isArray, isRange, isErrors) {

        if (ERRORS) {
            var error,
                method = ['new BigNumber', 'cmp', 'div', 'eq', 'gt', 'gte', 'lt',
                     'lte', 'minus', 'mod', 'plus', 'times', 'toFraction', 'divToInt'
                    ][ id ? id < 0 ? -id : id : 1 / id < 0 ? 1 : 0 ] + '()',
                message = outOfRange ? ' out of range' : ' not a' +
                  ( isRange ? ' non-zero' : 'n' ) + ' integer';

            message = ( [
                method + ' number type has more than 15 significant digits',
                method + ' not a base ' + j + ' number',
                method + ' base' + message,
                method + ' not a number' ][i] ||
                  j + '() ' + i + ( isErrors
                    ? ' not a boolean or binary digit'
                    : message + ( isArray
                      ? ' or not [' + ( outOfRange
                        ? ' negative, positive'
                        : ' integer, integer' ) + ' ]'
                      : '' ) ) ) + ': ' + arg;

            outOfRange = id = 0;
            error = new Error(message);
            error['name'] = 'BigNumber Error';
            throw error;
        }
    }


    /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     */
    function rnd( x, sd, rm, r ) {
        var d, i, j, k, n, ni, rd, xc,
            pows10 = POWS_TEN;

        // if x is not Infinity or NaN...
        if ( xc = x['c'] ) {

            // rd: the rounding digit, i.e. the digit after the digit that may be rounded up
            // n: a base 1e14 number, the value of the element of array x.c containing rd
            // ni: the index of n within x.c
            // d: the number of digits of n
            // i: what would be the index of rd within n if all the numbers were 14 digits long
            // (i.e. they had leading zeros)
            // j: if > 0, the actual index of rd within n (if < 0, rd is a leading zero)
            out: {

                // Get the number of digits of the first element of xc.
                for ( d = 1, k = xc[0]; k >= 10; k /= 10, d++ );
                i = sd - d;

                // If the rounding digit is in the first element of xc...
                if ( i < 0 ) {
                    i += LOG_BASE;
                    j = sd;
                    n = xc[ ni = 0 ];

                    // Get the rounding digit at index j of n.
                    rd = n / pows10[ d - j - 1 ] % 10 | 0;
                } else {
                    ni = Math.ceil( ( i + 1 ) / LOG_BASE );

                    if ( ni >= xc.length ) {

                        if (r) {

                            // Needed by sqrt.
                            for ( ; xc.length <= ni; xc.push(0) );
                            n = rd = 0;
                            d = 1;
                            i %= LOG_BASE;
                            j = i - LOG_BASE + 1;
                        } else {
                            break out;
                        }
                    } else {
                        n = k = xc[ni];

                        // Get the number of digits of n.
                        for ( d = 1; k >= 10; k /= 10, d++ );

                        // Get the index of rd within n.
                        i %= LOG_BASE;

                        // Get the index of rd within n, adjusted for leading zeros.
                        // The number of leading zeros of n is given by LOG_BASE - d.
                        j = i - LOG_BASE + d;

                        // Get the rounding digit at index j of n.
                        rd = j < 0 ? 0 : n / pows10[ d - j - 1 ] % 10 | 0;
                    }
                }

                r = r || sd < 0 ||

                // Are there any non-zero digits after the rounding digit?
                // The expression  n % pows10[ d - j - 1 ]  returns all the digits of n to the right
                // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
                  xc[ni + 1] != null || ( j < 0 ? n : n % pows10[ d - j - 1 ] );

                r = rm < 4
                  ? ( rd || r ) && ( rm == 0 || rm == ( x['s'] < 0 ? 3 : 2 ) )
                  : rd > 5 || rd == 5 && ( rm == 4 || r || rm == 6 &&

                    // Check whether the digit to the left of the rounding digit is odd.
                    ( ( i > 0 ? j > 0 ? n / pows10[ d - j ] : 0 : xc[ni - 1] ) % 10 ) & 1 ||
                      rm == ( x['s'] < 0 ? 8 : 7 ) );

                if ( sd < 1 || !xc[0] ) {
                    xc.length = 0;

                    if (r) {

                        // Convert sd to decimal places.
                        sd -= x['e'] + 1;

                        // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                        xc[0] = pows10[ sd % LOG_BASE ];
                        x['e'] = -sd || 0;
                    } else {

                        // Zero.
                        xc[0] = x['e'] = 0;
                    }

                    return x;
                }

                // Remove excess digits.
                if ( i == 0 ) {
                    xc.length = ni;
                    k = 1;
                    ni--;
                } else {
                    xc.length = ni + 1;
                    k = pows10[ LOG_BASE - i ];

                    // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                    // j > 0 means i > number of leading zeros of n.
                    xc[ni] = j > 0 ? mathfloor( n / pows10[ d - j ] % pows10[j] ) * k : 0;
                }

                // Round up?
                if (r) {

                    for ( ; ; ) {

                        // If the digit to be rounded up is in the first element of xc...
                        if ( ni == 0 ) {

                            // i will be the length of xc[0] before k is added.
                            for ( i = 1, j = xc[0]; j >= 10; j /= 10, i++ );
                            j = xc[0] += k;
                            for ( k = 1; j >= 10; j /= 10, k++ );

                            // if i != k the length has increased.
                            if ( i != k ) {
                                x['e']++;
                                if ( xc[0] == BASE ) xc[0] = 1;
                            }
                            break;
                        } else {
                            xc[ni] += k;
                            if ( xc[ni] != BASE ) break;
                            xc[ni--] = 0;
                            k = 1;
                        }
                    }
                }

                // Remove trailing zeros.
                for ( i = xc.length; xc[--i] === 0; xc.pop() );
            }

            // Overflow? Infinity.
            if ( x['e'] > MAX_EXP ) {
                x['c'] = x['e'] = null;

            // Underflow? Zero.
            } else if ( x['e'] < MIN_EXP ) {
                x['c'] = [ x['e'] = 0 ];
            }
        }

        return x;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P['absoluteValue'] = P['abs'] = function () {
        var x = new BigNumber(this);
        if ( x['s'] < 0 ) x['s'] = 1;
        return x;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole number
     * in the direction of Infinity.
     */
    P['ceil'] = function () {
        return rnd( new BigNumber(this), this['e'] + 1, 2 );
    };


    /*
     * Return
     * 1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     * 0 if they have the same value,
     * or null if the value of either is NaN.
     */
    P['comparedTo'] = P['cmp'] = function ( y, b ) {
        var a,
            x = this,
            xc = x['c'],
            yc = ( id = -id, y = new BigNumber( y, b ) )['c'],
            i = x['s'],
            j = y['s'],
            k = x['e'],
            l = y['e'];

        // Either NaN?
        if ( !i || !j ) return null;

        a = xc && !xc[0];
        b = yc && !yc[0];

        // Either zero?
        if ( a || b ) return a ? b ? 0 : -j : i;

        // Signs differ?
        if ( i != j ) return i;

        a = i < 0;
        b = k == l;

        // Either Infinity?
        if ( !xc || !yc ) return b ? 0 : !xc ^ a ? 1 : -1;

        // Compare exponents.
        if ( !b ) return k > l ^ a ? 1 : -1;
        i = -1;
        j = ( k = xc.length ) < ( l = yc.length ) ? k : l;

        // Compare digit by digit.
        for ( ; ++i < j; ) if ( xc[i] != yc[i] ) return xc[i] > yc[i] ^ a ? 1 : -1;

        // Compare lengths.
        return k == l ? 0 : k > l ^ a ? 1 : -1;
    };


    /*
     * Return the number of decimal places of the value of this BigNumber, or null if the value of
     * this BigNumber is +-Infinity or NaN.
     */
    P['decimalPlaces'] = P['dp'] = function () {
        var n, v,
            c = this['c'];

        if ( !c ) return null;
        n = ( ( v = c.length - 1 ) - mathfloor( this['e'] / LOG_BASE ) ) * LOG_BASE;

        // Subtract the number of trailing zeros of the last number.
        if ( v = c[v] ) for ( ; v % 10 == 0; v /= 10, n-- );
        if ( n < 0 ) n = 0;

        return n;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P['dividedBy'] = P['div'] = function ( y, b ) {
        id = 2;
        return div( this, new BigNumber( y, b ), DECIMAL_PLACES, ROUNDING_MODE );
    };


    /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */
    P['dividedToIntegerBy'] = P['divToInt'] = function ( y, b ) {
        id = 13;
        return div( this, new BigNumber( y, b ), 0, 1 );
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(n, b),
     * otherwise returns false.
     */
    P['equals'] = P['eq'] = function ( n, b ) {
        id = 3;
        return this['cmp']( n, b ) === 0;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole number
     * in the direction of -Infinity.
     */
    P['floor'] = function () {
        return rnd( new BigNumber(this), this['e'] + 1, 3 );
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(n, b),
     * otherwise returns false.
     */
    P['greaterThan'] = P['gt'] = function ( n, b ) {
        id = 4;
        return this['cmp']( n, b ) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(n, b), otherwise returns false.
     */
    P['greaterThanOrEqualTo'] = P['gte'] = function ( n, b ) {
        id = 5;
        return ( b = this['cmp']( n, b ) ) == 1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise returns false.
     */
    P['isFinite'] = function () {
        return !!this['c'];
    };


    /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */
    P['isInteger'] = P['isInt'] = function () {
        return !!this['c'] && mathfloor( this['e'] / LOG_BASE ) > this['c'].length - 2;
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise returns false.
     */
    P['isNaN'] = function () {
        return !this['s'];
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise returns false.
     */
    P['isNegative'] = P['isNeg'] = function () {
        return this['s'] < 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise returns false.
     */
    P['isZero'] = function () {
        return !!this['c'] && this['c'][0] == 0;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(n, b),
     * otherwise returns false.
     */
    P['lessThan'] = P['lt'] = function ( n, b ) {
        id = 6;
        return this['cmp']( n, b ) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(n, b), otherwise returns false.
     */
    P['lessThanOrEqualTo'] = P['lte'] = function ( n, b ) {
        id = 7;
        return ( b = this['cmp']( n, b ) ) == -1 || b === 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */
    P['minus'] = function ( y, b ) {
        var i, j, t, xLTy,
            x = this,
            a = x['s'];

        id = 8;
        y = new BigNumber( y, b );
        b = y['s'];

        // Either NaN?
        if ( !a || !b ) return new BigNumber(NaN);

        // Signs differ?
        if ( a != b ) {
            y['s'] = -b;
            return x['plus'](y);
        }

        var xe = x['e'] / LOG_BASE,
            ye = y['e'] / LOG_BASE,
            xc = x['c'],
            yc = y['c'];

        if ( !xe || !ye ) {

            // Either Infinity?
            if ( !xc || !yc ) return xc ? ( y['s'] = -b, y ) : new BigNumber( yc ? x : NaN );

            // Either zero?
            if ( !xc[0] || !yc[0] ) {

                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                return yc[0] ? ( y['s'] = -b, y ) : new BigNumber( xc[0] ? x :

                  // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                  ROUNDING_MODE == 3 ? -0 : 0 );
            }
        }

        // Floor xe and ye
        i = xe | 0;
        xe = xe > 0 || xe === i ? i : i - 1;
        i = ye | 0;
        ye = ye > 0 || ye === i ? i : i - 1;
        xc = xc.slice();

        // Determine which is the bigger number.
        if ( a = xe - ye ) {

            if ( xLTy = a < 0 ) {
                a = -a, t = xc;
            } else {
                ye = xe, t = yc;
            }

            // Prepend zeros to equalise exponents.
            for ( t.reverse(), b = a; b--; t.push(0) );
            t.reverse();
        } else {

            // Exponents equal. Check digit by digit.
            j = ( xLTy = ( a = xc.length ) < ( b = yc.length ) ) ? a : b;

            for ( a = b = 0; b < j; b++ ) {

                if ( xc[b] != yc[b] ) {
                    xLTy = xc[b] < yc[b];
                    break;
                }
            }
        }

        // x < y? Point xc to the array of the bigger number.
        if (xLTy) t = xc, xc = yc, yc = t, y['s'] = -y['s'];

        b = ( j = yc.length ) - ( i = xc.length );

        // Append zeros to xc if shorter.
        // No need to add zeros to yc if shorter as subtraction only needs to start at yc.length.
        if ( b > 0 ) for ( ; b--; xc[i++] = 0 );
        b = BASE - 1;

        // Subtract yc from xc.
        for ( ; j > a; ) {

            if ( xc[--j] < yc[j] ) {
                for ( i = j; i && !xc[--i]; xc[i] = b );
                --xc[i];
                xc[j] += BASE;
            }
            xc[j] -= yc[j];
        }

        // Remove leading zeros and adjust exponent accordingly.
        for ( ; xc[0] == 0; xc.shift(), --ye );

        // Zero?
        if ( !xc[0] ) {

            // Following IEEE 754 (2008) 6.3,
            // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
            y['s'] = ROUNDING_MODE == 3 ? -1 : 1;
            y['c'] = [ y['e'] = 0 ];
            return y;
        }

        // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity when neither
        // x or y are Infinity.
        return normalise( y, xc, ye );
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b).
     */
    P['modulo'] = P['mod'] = function ( y, b ) {
        id = 9;
        var x = this,
            xc = x['c'],
            yc = ( y = new BigNumber( y, b ) )['c'],
            xs = x['s'],
            ys = y['s'];

        // x or y NaN? y zero? x zero?
        b = !xs || !ys || yc && !yc[0];
        if ( b || xc && !xc[0] ) return new BigNumber( b ? NaN : x );

        x['s'] = y['s'] = 1;
        b = y['cmp'](x) == 1;
        x['s'] = xs;
        y['s'] = ys;

        return b ? new BigNumber(x) : x['minus']( div( x, y, 0, 1 )['times'](y) );
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber negated, i.e. multiplied
     * by -1.
     */
    P['negated'] = P['neg'] = function () {
        var x = new BigNumber(this);
        x['s'] = -x['s'] || null;
        return x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */
    P['plus'] = function ( y, b ) {
        var t,
            x = this,
            a = x['s'];

        id = 10;
        y = new BigNumber( y, b );
        b = y['s'];

        // Either NaN?
        if ( !a || !b ) return new BigNumber(NaN);

        // Signs differ?
         if ( a != b ) {
            y['s'] = -b;
            return x['minus'](y);
        }

        var xe = x['e'] / LOG_BASE,
            ye = y['e'] / LOG_BASE,
            xc = x['c'],
            yc = y['c'];

        if ( !xe || !ye ) {

            // Return +-Infinity if either Infinity.
            if ( !xc || !yc ) return new BigNumber( a / 0 );

            // Either zero? Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
            if ( !xc[0] || !yc[0] ) return yc[0] ? y : new BigNumber( xc[0] ? x : a * 0 );
        }

         // Floor xe and ye
        a = xe | 0;
        xe = xe > 0 || xe === a ? a : a - 1;
        a = ye | 0;
        ye = ye > 0 || ye === a ? a : a - 1;
        xc = xc.slice();

        // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
        if ( a = xe - ye ) {
            if ( a > 0 ) {
                ye = xe, t = yc;
            } else {
                a = -a, t = xc;
            }

            for ( t.reverse(); a--; t.push(0) );
            t.reverse();
        }
        a = xc.length;
        b = yc.length;

        // Point xc to the longer array, and b to the shorter length.
        if ( a - b < 0 ) t = yc, yc = xc, xc = t, b = a;

        // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
        for ( a = 0; b; ) {
            a = ( xc[--b] = xc[b] + yc[b] + a ) / BASE | 0;
            xc[b] %= BASE;
        }


        if (a) {
            xc.unshift(a);
            ++ye;
        }

        // No need to check for zero, as +x + +y != 0 && -x + -y != 0
        // ye = MAX_EXP + 1 possible
        return normalise( y, xc, ye );
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of dp
     * decimal places using rounding mode rm, or to 0 and ROUNDING_MODE respectively if omitted.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     * [rm] {number} Integer, 0 to 8 inclusive.
     */
    P['round'] = function ( dp, rm ) {

        dp = dp == null || ( ( ( outOfRange = dp < 0 || dp > MAX ) || parse(dp) != dp ) &&

          // 'round() decimal places out of range: {dp}'
          // 'round() decimal places not an integer: {dp}'
          !ifExceptionsThrow( dp, 'decimal places', 'round' ) ) ? 0 : dp | 0;

        // Include '&& rm !== 0' because with Opera -0 == parseFloat(-0) is false.
        rm = rm == null || ( ( ( outOfRange = rm < 0 || rm > 8 ) || parse(rm) != rm && rm !== 0 ) &&

          // 'round() mode not an integer: {rm}'
          // 'round() mode out of range: {rm}'
          !ifExceptionsThrow( rm, 'mode', 'round' ) ) ? ROUNDING_MODE : rm | 0;

        return rnd( new BigNumber(this), dp + this['e'] + 1, rm );
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt( N) =  N
     *  sqrt(-I) =  N
     *  sqrt( I) =  I
     *  sqrt( 0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P['squareRoot'] = P['sqrt'] = function () {
        var m, n, r, rep, t,
            x = this,
            c = x['c'],
            s = x['s'],
            e = x['e'],
            dp = DECIMAL_PLACES + 4,
            half = new BigNumber('0.5');

        // Negative/NaN/Infinity/zero?
        if ( s !== 1 || !c || !c[0] ) {
            return new BigNumber( !s || s < 0 && ( !c || c[0] ) ? NaN : c ? x : 1 / 0 );
        }

        // Initial estimate.
        s = Math.sqrt( +x );

        // Math.sqrt underflow/overflow?
        // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
        if ( s == 0 || s == 1 / 0 ) {
            n = coefficientToString(c);
            if ( ( n.length + e ) % 2 == 0 ) n += '0';
            s = Math.sqrt(n);
            e = mathfloor( ( e + 1 ) / 2 ) - ( e < 0 || e % 2 );

            if ( s == 1 / 0 ) {
                n = '1e' + e;
            } else {
                n = s.toExponential();
                n = n.slice( 0, n.indexOf('e') + 1 ) + e;
            }
            r = new BigNumber(n);
        } else {
            r = new BigNumber( s.toString() );
        }

        // Check for zero. r could be zero if MIN_EXP is changed after the this value was created.
        // This would cause a division by zero (x/t) and hence Infinity below, which would cause
        // coefficientToString to throw.
        if ( r['c'][0] ) {
            e = r['e'];
            s = e + dp;
            if ( s < 3 ) s = 0;

            // Newton-Raphson iteration.
            for ( ; ; ) {
                t = r;
                r = half['times']( t['plus']( div( x, t, dp, 1 ) ) );

                if ( coefficientToString( t['c']   ).slice( 0, s ) === ( n =
                     coefficientToString( r['c'] ) ).slice( 0, s ) ) {

                    // The exponent of r may here be one less than the final result exponent,
                    // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits are
                    // indexed correctly.
                    if ( r['e'] < e ) --s;
                    n = n.slice( s - 3, s + 1 );

                    // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are
                    // 9999 or 4999 (i.e. approaching a rounding boundary) continue the iteration.
                    if ( n == '9999' || !rep && n == '4999' ) {

                        // On the first iteration only, check to see if rounding up gives the exact
                        // result as the nines may infinitely repeat.
                        if ( !rep ) {
                            rnd( t, t['e'] + DECIMAL_PLACES + 2, 0 );

                            if ( t['times'](t)['eq'](x) ) {
                                r = t;
                                break;
                            }
                        }
                        dp += 4;
                        s += 4;
                        rep = 1;
                    } else {

                        // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact result.
                        // If not, then there are further digits and m will be truthy.
                        if ( !+n || !+n.slice(1) && n.charAt(0) == '5' ) {

                            // Truncate to the first rounding digit.
                            rnd( r, r['e'] + DECIMAL_PLACES + 2, 1 );
                            m = !r['times'](r)['eq'](x);
                        }
                        break;
                    }
                }
            }
        }

        return rnd( r, r['e'] + DECIMAL_PLACES + 1, ROUNDING_MODE, m );
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber times the value of
     * BigNumber(y, b).
     */
    P['times'] = function ( y, b ) {
        var c, e, k, m, r, xlo, xhi, ylo, yhi,
            x = this,
            xc = x['c'],
            yc = ( id = 11, y = new BigNumber( y, b ) )['c'],
            i = x['e'] / LOG_BASE,
            j = y['e'] / LOG_BASE,
            a = x['s'];

        y['s'] = a == ( b = y['s'] ) ? 1 : -1;

        // Either NaN/Infinity/0?
        if ( !i && ( !xc || !xc[0] ) || !j && ( !yc || !yc[0] ) ) {

            // Return NaN if either NaN, or x is 0 and y is Infinity, or y is 0 and x is Infinity.
            return new BigNumber( !a || !b || xc && !xc[0] && !yc || yc && !yc[0] && !xc ? NaN

              // Return +-Infinity if either is Infinity. Return +-0 if x or y is 0.
              : !xc || !yc ? y['s'] / 0 : y['s'] * 0 );
        }

        // e = mathfloor(i) + mathfloor(j);
        e = ( e = i | 0, i > 0 || i === e ? e : e - 1) +
            ( e = j | 0, j > 0 || j === e ? e : e - 1);

        a = xc.length;
        b = yc.length;

        // Ensure xc points to longer array and b to longer length.
        if ( a < b ) r = xc, xc = yc, yc = r, j = a, a = b, b = j;

        // Initialise the result array with zeros.
        for ( j = a + b, r = []; j--; r.push(0) );

        // Multiply!
        for ( i = b; --i >= 0; ) {
            c = 0;
            j = a + i;
            k = a;
            ylo = yc[i] % SQRT_BASE;
            yhi = yc[i] / SQRT_BASE | 0;

            for ( ; j > i; ) {
                xlo = xc[--k] % SQRT_BASE;
                xhi = xc[k] / SQRT_BASE | 0;
                m = yhi * xlo + xhi * ylo;
                xlo = ylo * xlo + ( ( m % SQRT_BASE ) * SQRT_BASE ) + r[j] + c;
                c = ( xlo / BASE | 0 ) + ( m / SQRT_BASE | 0 ) + yhi * xhi;
                r[j--] = xlo % BASE;
            }
            r[j] = c;
        }

        if (c) {
            ++e;
        } else {
            r.shift();
        }

        return normalise( y, r, e );
    };


    /*
     * Return a string representing the value of this BigNumber in exponential notation to dp fixed
     * decimal places and rounded using ROUNDING_MODE if necessary.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     */
    P['toExponential'] = function (dp) {
        var x = this;

        return x['c'] ? format( x, dp == null || ( ( outOfRange = dp < 0 || dp > MAX ) ||

          // Include '&& dp !== 0' because with Opera -0 == parseFloat(-0) is false,
          // despite -0 == parseFloat('-0') && 0 == -0 being true.
          parse(dp) != dp && dp !== 0 ) &&

            // 'toExponential() decimal places not an integer: {dp}'
            // 'toExponential() decimal places out of range: {dp}'
            !ifExceptionsThrow( dp, 'decimal places', 'toExponential' )
              ? null : dp | 0, 1 ) : x.toString();
    };


    /*
     * Return a string representing the value of this BigNumber in normal notation to dp fixed
     * decimal places and rounded using ROUNDING_MODE if necessary.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     */
    P['toFixed'] = function (dp) {
        var str,
            x = this,
            neg = TO_EXP_NEG,
            pos = TO_EXP_POS;

        dp = dp == null || ( ( outOfRange = dp < 0 || dp > MAX ) ||

          // 'toFixed() decimal places not an integer: {dp}'
          // 'toFixed() decimal places out of range: {dp}'
          parse(dp) != dp && dp !== 0 ) && !ifExceptionsThrow( dp, 'decimal places', 'toFixed' )
            ? null : x['e'] + ( dp | 0 );

        TO_EXP_NEG = -( TO_EXP_POS = 1 / 0 );

        if ( dp == null || !x['c'] ) {
            str = x.toString();
        } else {
            str = format( x, dp );

            // (-0).toFixed() is '0', but (-0.1).toFixed() is '-0'.
            // (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
            if ( x['s'] < 0 && x['c'] ) {

                // As e.g. (-0).toFixed(3), will wrongly be returned as -0.000 from toString.
                if ( !x['c'][0] ) {
                    str = str.replace( '-', '' );

                // As e.g. -0.5 if rounded to -0 will cause toString to omit the minus sign.
                } else if ( str.indexOf('-') < 0 ) {
                    str = '-' + str;
                }
            }
        }

        TO_EXP_NEG = neg;
        TO_EXP_POS = pos;

        return str;
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using ROUNDING_MODE to dp decimal places, and formatted according to the properties of the
     * FORMAT object (see BigNumber.config).
     *
     * FORMAT = {
     *      decimalSeparator : '.',
     *      groupSeparator : ',',
     *      groupSize : 3,
     *      secondaryGroupSize : 0,
     *      fractionGroupSeparator : '\xA0',    // non-breaking space
     *      fractionGroupSize : 0
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * (TODO: If dp is invalid the error message will give toFixed as the offending method.)
     */
    P['toFormat'] = function (dp) {
        var x = this;

        if ( !x['c'] ) return x.toString();

        var i,
            isNeg = x['s'] < 0,
            groupSeparator = FORMAT['groupSeparator'],
            g1 = +FORMAT['groupSize'],
            g2 = +FORMAT['secondaryGroupSize'],
            arr = x.toFixed(dp).split('.'),
            intPart = arr[0],
            fractionPart = arr[1],
            intDigits = isNeg ? intPart.slice(1) : intPart,
            len = intDigits.length;

        if (g2) i = g1, g1 = g2, g2 = i, len -= i;

        if ( g1 > 0 && len > 0 ) {
            i = len % g1 || g1;
            intPart = intDigits.substr( 0, i );
            for ( ; i < len; i += g1 ) intPart += groupSeparator + intDigits.substr( i, g1 );
            if ( g2 > 0 ) intPart += groupSeparator + intDigits.slice(i);
            if (isNeg) intPart = '-' + intPart;
        }

        return fractionPart
          ? intPart + FORMAT['decimalSeparator'] + ( ( g2 = +FORMAT['fractionGroupSize'] )
            ? fractionPart.replace( new RegExp( '\\d{' + g2 + '}\\B', 'g' ),
              '$&' + FORMAT['fractionGroupSeparator'] )
            : fractionPart )
          : intPart;
    };


    /*
     * Return a string array representing the value of this BigNumber as a simple fraction with an
     * integer numerator and an integer denominator. The denominator will be a positive non-zero
     * value less than or equal to the specified maximum denominator. If a maximum denominator is
     * not specified, the denominator will be the lowest value necessary to represent the number
     * exactly.
     *
     * [maxD] {number|string|BigNumber} Integer >= 1 and < Infinity.
     */
    P['toFraction'] = function (maxD) {
        var arr, d0, d2, e, exp, n, n0, q, s,
            n1 = d0 = new BigNumber(ONE),
            d1 = n0 = new BigNumber(ONE),
            x = this,
            xc = x['c'],
            d = new BigNumber(ONE);

        // NaN, Infinity.
        if ( !xc ) return x.toString();
        s = coefficientToString(xc);

        // Initial denominator.
        e = d['e'] = s.length - x['e'] - 1;
        d['c'][0] = POWS_TEN[ ( exp = e % LOG_BASE ) < 0 ? LOG_BASE + exp : exp ];

        // If max denominator is undefined or null, or NaN...
        if ( maxD == null || ( !( id = 12, n = new BigNumber(maxD) )['s'] ||

               // or less than 1, or Infinity...
               ( outOfRange = n['cmp'](n1) < 0 || !n['c'] ) ||

                 // or not an integer...
                 ( ERRORS && mathfloor( n['e'] / LOG_BASE ) < n['c'].length - 1 ) ) &&

                   // 'toFraction() max denominator not an integer: {maxD}'
                   // 'toFraction() max denominator out of range: {maxD}'
                   !ifExceptionsThrow( maxD, 'max denominator', 'toFraction' ) ||

                     // or greater than the max denominator needed to specify the value exactly...
                     ( maxD = n )['cmp'](d) > 0 ) {

            // d is e.g. 10, 100, 1000, 10000... , n1 is 1.
            maxD = e > 0 ? d : n1;
        }

        exp = MAX_EXP;
        MAX_EXP = 1 / 0;
        n = new BigNumber(s);

        // n0 = d1 = 0
        n0['c'][0] = 0;

        for ( ; ; )  {
            q = div( n, d, 0, 1 );
            d2 = d0['plus']( q['times'](d1) );
            if ( d2['cmp'](maxD) == 1 ) break;
            d0 = d1;
            d1 = d2;
            n1 = n0['plus']( q['times']( d2 = n1 ) );
            n0 = d2;
            d = n['minus']( q['times']( d2 = d ) );
            n = d2;
        }

        d2 = div( maxD['minus'](d0), d1, 0, 1 );
        n0 = n0['plus']( d2['times'](n1) );
        d0 = d0['plus']( d2['times'](d1) );
        n0['s'] = n1['s'] = x['s'];
        e *= 2;

        // Determine which fraction is closer to x, n0/d0 or n1/d1
        arr = div( n1, d1, e, ROUNDING_MODE )['minus'](x)['abs']()['cmp'](
              div( n0, d0, e, ROUNDING_MODE )['minus'](x)['abs']() ) < 1
                ? [ n1.toString(), d1.toString() ]
                : [ n0.toString(), d0.toString() ];

        MAX_EXP = exp;

        return arr;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     */
    P['toNumber'] = function () {
        var x = this;

        // Ensure zero has correct sign.
        return +x || ( x['s'] ? 0 * x['s'] : NaN );
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber raised to the power e.
     * If e is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     *
     * e {number} Integer, -MAX_POWER to MAX_POWER inclusive.
     */
    P['toPower'] = P['pow'] = function (e) {

        // e to integer, avoiding NaN or Infinity becoming 0.
        var i = e * 0 == 0 ? ~~e : e,
            x = new BigNumber(this),
            y = new BigNumber(ONE);

        // Pass +-Infinity for out of range exponents.
        if ( ( ( ( outOfRange = e < -MAX_POWER || e > MAX_POWER ) && (i = e * 1 / 0) ) ||

            // Any exponent that fails the parse becomes NaN.
            // Include 'e !== 0' because on Opera  -0 == parseFloat(-0)  is false, despite
            // -0 === parseFloat(-0) && -0 == parseFloat('-0')  evaluating true.
            parse(e) != e && e !== 0 && !(i = NaN) ) &&

              // 'pow() exponent not an integer: {e}'
              // 'pow() exponent out of range: {e}'
              // Pass zero to Math.pow, as any value to the power zero is 1.
              !ifExceptionsThrow( e, 'exponent', 'pow' ) || !i ) {

            // i is +-Infinity, NaN or 0.
            return new BigNumber( Math.pow( +x, i ) );
        }
        i = i < 0 ? -i : i;

        for ( ; ; ) {
            if ( i & 1 ) y = y['times'](x);
            i >>= 1;
            if ( !i ) break;
            x = x['times'](x);
        }

        return e < 0 ? ONE['div'](y) : y;
    };


    /*
     * Return a string representing the value of this BigNumber to sd significant digits and rounded
     * using ROUNDING_MODE if necessary. If sd is less than the number of digits necessary to
     * represent the integer part of the value in normal notation, then use exponential notation.
     *
     * sd {number} Integer, 1 to MAX inclusive.
     */
    P['toPrecision'] = function (sd) {
        var x = this;

         // ERRORS true: Throw if sd not undefined, null or an integer in range.
         // ERRORS false: Ignore sd if not a number or not in range.
         // Truncate non-integers.
        return sd == null || ( ( ( outOfRange = sd < 1 || sd > MAX ) || parse(sd) != sd ) &&

          // 'toPrecision() precision not an integer: {sd}'
          // 'toPrecision() precision out of range: {sd}'
          !ifExceptionsThrow( sd, 'precision', 'toPrecision' ) ) || !x['c']
            ? x.toString() : format( x, --sd | 0, 2 );
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent that is
     * equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than TO_EXP_NEG,
     * return exponential notation.
     *
     * [b] {number} Integer, 2 to 64 inclusive.
     */
    P['toString'] = function (b) {
        var u, str, strL,
            x = this,
            xe = x['e'];

        // Infinity or NaN?
        if ( xe === null ) {
            str = x['s'] ? 'Infinity' : 'NaN';

        // Exponential format?
        } else if ( b == u && ( xe <= TO_EXP_NEG || xe >= TO_EXP_POS ) ) {
            return format( x, u, 1 );
        } else {
            str = coefficientToString( x['c'] );

            // Negative exponent?
            if ( xe < 0 ) {

                // Prepend zeros.
                for ( ; ++xe; str = '0' + str );
                str = '0.' + str;

            // Positive exponent?
            } else if ( strL = str.length, xe > 0 ) {

                // Append zeros.
                if ( ++xe > strL ) {
                    for ( xe -= strL; xe-- ; str += '0' );
                } else if ( xe < strL ) {
                    str = str.slice( 0, xe ) + '.' + str.slice(xe);
                }

            // Exponent zero.
            } else {
                u = str.charAt(0);

                if ( strL > 1 ) {
                    str = u + '.' + str.slice(1);

                // Avoid '-0'
                } else if ( u == '0' ) {
                    return u;
                }
            }

            if ( b != null ) {

                if ( !( outOfRange = !( b >= 2 && b < 65 ) ) && ( b == ~~b || !ERRORS ) ) {
                    str = convertBase( str, b | 0, 10, x['s'] );

                    // Avoid '-0'
                    if ( str == '0' ) return str;
                } else {

                    // 'toString() base not an integer: {b}'
                    // 'toString() base out of range: {b}'
                    ifExceptionsThrow( b, 'base', 'toS' );
                }
            }

        }

        return x['s'] < 0 ? '-' + str : str;
    };


    /*
     * Return as toString, but do not accept a base argument.
     */
    P['valueOf'] = P['toJSON'] = function () {
        return this.toString();
    };


    // Add aliases for BigDecimal methods.
    //P['add'] = P['plus'];
    //P['subtract'] = P['minus'];
    //P['multiply'] = P['times'];
    //P['divide'] = P['div'];
    //P['remainder'] = P['mod'];
    //P['compareTo'] = P['cmp'];
    //P['negate'] = P['neg'];


    // EXPORT


    // Node and other CommonJS-like environments that support module.exports.
    if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = BigNumber;
    //AMD.
    } else if ( typeof define == 'function' && define.amd ) {
        define( function () {return BigNumber} );
    //Browser.
    } else {
        global['BigNumber'] = BigNumber;
    }
})(this);
