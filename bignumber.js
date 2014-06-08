/*! bignumber.js v1.4.1 https://github.com/MikeMcl/bignumber.js/LICENCE */

;(function ( global ) {
    'use strict';

    /*
      bignumber.js v1.4.1
      A JavaScript library for arbitrary-precision arithmetic.
      https://github.com/MikeMcl/bignumber.js
      Copyright (c) 2012 Michael Mclaughlin <M8ch88l@gmail.com>
      MIT Expat Licence
    */

    /*********************************** DEFAULTS ************************************/

    /*
     * The default values below must be integers within the stated ranges (inclusive).
     * Most of these values can be changed during run-time using BigNumber.config().
     */

    /*
     * The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP,
     * MAX_EXP, and the argument to toFixed, toPrecision and toExponential, beyond
     * which an exception is thrown (if ERRORS is true).
     */
    var MAX = 1E9,                                   // 0 to 1e+9

        // Limit of magnitude of exponent argument to toPower.
        MAX_POWER = 1E6,                             // 1 to 1e+6

        // The maximum number of decimal places for operations involving division.
        DECIMAL_PLACES = 20,                         // 0 to MAX

        /*
         * The rounding mode used when rounding to the above decimal places, and when
         * using toFixed, toPrecision and toExponential, and round (default value).
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

    /***********************************************************************************/

        P = BigNumber.prototype,
        DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',
        outOfRange,
        id = 0,
        isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        trim = String.prototype.trim || function () {return this.replace(/^\s+|\s+$/g, '')},
        ONE = BigNumber(1);


    // CONSTRUCTOR


    /*
     * The exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * n {number|string|BigNumber} A numeric value.
     * [b] {number} The base of n. Integer, 2 to 64 inclusive.
     */
    function BigNumber( n, b ) {
        var e, i, isNum, digits, valid, orig,
            x = this;

        // Enable constructor usage without new.
        if ( !(x instanceof BigNumber) ) {
            return new BigNumber( n, b )
        }

        // Duplicate.
        if ( n instanceof BigNumber ) {
            id = 0;

            // e is undefined.
            if ( b !== e ) {
                n += ''
            } else {
                x['s'] = n['s'];
                x['e'] = n['e'];
                x['c'] = ( n = n['c'] ) ? n.slice() : n;
                return;
            }
        }

        // If number, check if minus zero.
        if ( typeof n != 'string' ) {
            n = ( isNum = typeof n == 'number' ||
                Object.prototype.toString.call(n) == '[object Number]' ) &&
                    n === 0 && 1 / n < 0 ? '-0' : n + '';
        }

        orig = n;

        if ( b === e && isValid.test(n) ) {

            // Determine sign.
            x['s'] = n.charAt(0) == '-' ? ( n = n.slice(1), -1 ) : 1;

        // Either n is not a valid BigNumber or a base has been specified.
        } else {

            // Enable exponential notation to be used with base 10 argument.
            // Ensure return value is rounded to DECIMAL_PLACES as with other bases.
            if ( b == 10 ) {

                return setMode( n, DECIMAL_PLACES, ROUNDING_MODE );
            }

            n = trim.call(n).replace( /^\+(?!-)/, '' );

            x['s'] = n.charAt(0) == '-' ? ( n = n.replace( /^-(?!-)/, '' ), -1 ) : 1;

            if ( b != null ) {

                if ( ( b == (b | 0) || !ERRORS ) &&
                  !( outOfRange = !( b >= 2 && b < 65 ) ) ) {

                    digits = '[' + DIGITS.slice( 0, b = b | 0 ) + ']+';

                    // Before non-decimal number validity test and base conversion
                    // remove the `.` from e.g. '1.', and replace e.g. '.1' with '0.1'.
                    n = n.replace( /\.$/, '' ).replace( /^\./, '0.' );

                    // Any number in exponential form will fail due to the e+/-.
                    if ( valid = new RegExp(
                      '^' + digits + '(?:\\.' + digits + ')?$', b < 37 ? 'i' : '' ).test(n) ) {

                        if ( isNum ) {

                            if ( n.replace( /^0\.0*|\./, '' ).length > 15 ) {

                                // 'new BigNumber() number type has more than 15 significant digits: {n}'
                                ifExceptionsThrow( orig, 0 );
                            }

                            // Prevent later check for length on converted number.
                            isNum = !isNum;
                        }
                        n = convert( n, 10, b, x['s'] );

                    } else if ( n != 'Infinity' && n != 'NaN' ) {

                        // 'new BigNumber() not a base {b} number: {n}'
                        ifExceptionsThrow( orig, 1, b );
                        n = 'NaN';
                    }
                } else {

                    // 'new BigNumber() base not an integer: {b}'
                    // 'new BigNumber() base out of range: {b}'
                    ifExceptionsThrow( b, 2 );

                    // Ignore base.
                    valid = isValid.test(n);
                }
            } else {
                valid = isValid.test(n);
            }

            if ( !valid ) {

                // Infinity/NaN
                x['c'] = x['e'] = null;

                // NaN
                if ( n != 'Infinity' ) {

                    // No exception on NaN.
                    if ( n != 'NaN' ) {

                        // 'new BigNumber() not a number: {n}'
                        ifExceptionsThrow( orig, 3 );
                    }
                    x['s'] = null;
                }
                id = 0;

                return;
            }
        }

        // Decimal point?
        if ( ( e = n.indexOf('.') ) > -1 ) {
            n = n.replace( '.', '' );
        }

        // Exponential form?
        if ( ( i = n.search( /e/i ) ) > 0 ) {

            // Determine exponent.
            if ( e < 0 ) {
                e = i;
            }
            e += +n.slice( i + 1 );
            n = n.substring( 0, i );

        } else if ( e < 0 ) {

            // Integer.
            e = n.length;
        }

        // Determine leading zeros.
        for ( i = 0; n.charAt(i) == '0'; i++ ) {
        }

        b = n.length;

        // Disallow numbers with over 15 significant digits if number type.
        if ( isNum && b > 15 && n.slice(i).length > 15 ) {

            // 'new BigNumber() number type has more than 15 significant digits: {n}'
            ifExceptionsThrow( orig, 0 );
        }
        id = 0;

        // Overflow?
        if ( ( e -= i + 1 ) > MAX_EXP ) {

            // Infinity.
            x['c'] = x['e'] = null;

        // Zero or underflow?
        } else if ( i == b || e < MIN_EXP ) {

            // Zero.
            x['c'] = [ x['e'] = 0 ];
        } else {

            // Determine trailing zeros.
            for ( ; n.charAt(--b) == '0'; ) {
            }

            x['e'] = e;
            x['c'] = [];

            // Convert string to array of digits (without leading and trailing zeros).
            for ( e = 0; i <= b; x['c'][e++] = +n.charAt(i++) ) {
            }
        }
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
     * Accept an object or an argument list, with one or many of the following
     * properties or parameters respectively:
     * [ DECIMAL_PLACES [, ROUNDING_MODE [, EXPONENTIAL_AT [, RANGE [, ERRORS ]]]]]
     *
     * E.g.
     * BigNumber.config(20, 4) is equivalent to
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     * Ignore properties/parameters set to null or undefined.
     *
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
              return !( ( outOfRange = n < lo || n > hi ) ||
                parse(n) != n && n !== 0 );
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

        /*
         * [EXPONENTIAL_AT] {number|number[]} Integer, -MAX to MAX inclusive or
         * [ integer -MAX to 0 inclusive, 0 to MAX inclusive ].
         */
        if ( has( p = 'EXPONENTIAL_AT' ) ) {

            if ( inRange( v, -MAX, MAX ) ) {
                TO_EXP_NEG = -( TO_EXP_POS = ~~( v < 0 ? -v : +v ) );
            } else if ( !outOfRange && v && inRange( v[0], -MAX, 0 ) &&
              inRange( v[1], 0, MAX ) ) {
                TO_EXP_NEG = ~~v[0];
                TO_EXP_POS = ~~v[1];
            } else {

                // 'config() EXPONENTIAL_AT not an integer or not [integer, integer]: {v}'
                // 'config() EXPONENTIAL_AT out of range or not [negative, positive: {v}'
                ifExceptionsThrow( v, p, c, 1 );
            }
        }
        r[p] = [ TO_EXP_NEG, TO_EXP_POS ];

        /*
         * [RANGE][ {number|number[]} Non-zero integer, -MAX to MAX inclusive or
         * [ integer -MAX to -1 inclusive, integer 1 to MAX inclusive ].
         */
        if ( has( p = 'RANGE' ) ) {

            if ( inRange( v, -MAX, MAX ) && ~~v ) {
                MIN_EXP = -( MAX_EXP = ~~( v < 0 ? -v : +v ) );
            } else if ( !outOfRange && v && inRange( v[0], -MAX, -1 ) &&
              inRange( v[1], 1, MAX ) ) {
                MIN_EXP = ~~v[0], MAX_EXP = ~~v[1];
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
                parse = ( outOfRange = id = 0, ERRORS = !!v )
                  ? parseInt
                  : parseFloat;
            } else {

                // 'config() ERRORS not a boolean or binary digit: {v}'
                ifExceptionsThrow( v, p, c, 0, 0, 1 );
            }
        }
        r[p] = ERRORS;

        return r;
    };


    // PRIVATE FUNCTIONS


    // Assemble error messages. Throw BigNumber Errors.
    function ifExceptionsThrow( arg, i, j, isArray, isRange, isErrors) {

        if ( ERRORS ) {
            var error,
                method = ['new BigNumber', 'cmp', 'div', 'eq', 'gt', 'gte', 'lt',
                     'lte', 'minus', 'mod', 'plus', 'times', 'toFr'
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
     * Convert a numeric string of baseIn to a numeric string of baseOut.
     */
    function convert( nStr, baseOut, baseIn, sign ) {
        var e, dvs, dvd, nArr, fracArr, fracBN;

        // Convert string of base bIn to an array of numbers of baseOut.
        // Eg. strToArr('255', 10) where baseOut is 16, returns [15, 15].
        // Eg. strToArr('ff', 16)  where baseOut is 10, returns [2, 5, 5].
        function strToArr( str, bIn ) {
            var j,
                i = 0,
                strL = str.length,
                arrL,
                arr = [0];

            for ( bIn = bIn || baseIn; i < strL; i++ ) {

                for ( arrL = arr.length, j = 0; j < arrL; arr[j] *= bIn, j++ ) {
                }

                for ( arr[0] += DIGITS.indexOf( str.charAt(i) ), j = 0;
                      j < arr.length;
                      j++ ) {

                    if ( arr[j] > baseOut - 1 ) {

                        if ( arr[j + 1] == null ) {
                            arr[j + 1] = 0;
                        }
                        arr[j + 1] += arr[j] / baseOut ^ 0;
                        arr[j] %= baseOut;
                    }
                }
            }

            return arr.reverse();
        }

        // Convert array to string.
        // E.g. arrToStr( [9, 10, 11] ) becomes '9ab' (in bases above 11).
        function arrToStr( arr ) {
            var i = 0,
                arrL = arr.length,
                str = '';

            for ( ; i < arrL; str += DIGITS.charAt( arr[i++] ) ) {
            }

            return str;
        }

        if ( baseIn < 37 ) {
            nStr = nStr.toLowerCase();
        }

        /*
         * If non-integer convert integer part and fraction part separately.
         * Convert the fraction part as if it is an integer than use division to
         * reduce it down again to a value less than one.
         */
        if ( ( e = nStr.indexOf( '.' ) ) > -1 ) {

            /*
             * Calculate the power to which to raise the base to get the number
             * to divide the fraction part by after it has been converted as an
             * integer to the required base.
             */
            e = nStr.length - e - 1;

            // Use toFixed to avoid possible exponential notation.
            dvs = strToArr( new BigNumber(baseIn)['pow'](e)['toF'](), 10 );

            nArr = nStr.split('.');

            // Convert the base of the fraction part (as integer).
            dvd = strToArr( nArr[1] );

            // Convert the base of the integer part.
            nArr = strToArr( nArr[0] );

            // Result will be a BigNumber with a value less than 1.
            fracBN = divide( dvd, dvs, dvd.length - dvs.length, sign, baseOut,
              // Is least significant digit of integer part an odd number?
              nArr[nArr.length - 1] & 1 );

            fracArr = fracBN['c'];

            // e can be <= 0  ( if e == 0, fracArr is [0] or [1] ).
            if ( e = fracBN['e'] ) {

                // Append zeros according to the exponent of the result.
                for ( ; ++e; fracArr.unshift(0) ) {
                }

                // Append the fraction part to the converted integer part.
                nStr = arrToStr(nArr) + '.' + arrToStr(fracArr);

            // fracArr is [1].
            // Fraction digits rounded up, so increment last digit of integer part.
            } else if ( fracArr[0] ) {

                if ( nArr[ e = nArr.length - 1 ] < baseOut - 1 ) {
                    ++nArr[e];
                    nStr = arrToStr(nArr);
                } else {
                    nStr = new BigNumber( arrToStr(nArr),
                      baseOut )['plus'](ONE)['toS'](baseOut);
                }

            // fracArr is [0]. No fraction digits.
            } else {
                nStr = arrToStr(nArr);
            }
        } else {

            // Simple integer. Convert base.
            nStr = arrToStr( strToArr(nStr) );
        }

        return nStr;
    }


    // Perform division in the specified base. Called by div and convert.
    function divide( dvd, dvs, exp, s, base, isOdd ) {
        var dvsL, dvsT, next, cmp, remI,
            dvsZ = dvs.slice(),
            dvdI = dvsL = dvs.length,
            dvdL = dvd.length,
            rem = dvd.slice( 0, dvsL ),
            remL = rem.length,
            quo = new BigNumber(ONE),
            qc = quo['c'] = [],
            qi = 0,
            dig = DECIMAL_PLACES + ( quo['e'] = exp ) + 1;

        quo['s'] = s;
        s = dig < 0 ? 0 : dig;

        // Add zeros to make remainder as long as divisor.
        for ( ; remL++ < dvsL; rem.push(0) ) {
        }

        // Create version of divisor with leading zero.
        dvsZ.unshift(0);

        do {

            // 'next' is how many times the divisor goes into the current remainder.
            for ( next = 0; next < base; next++ ) {

                // Compare divisor and remainder.
                if ( dvsL != ( remL = rem.length ) ) {
                    cmp = dvsL > remL ? 1 : -1;
                } else {
                    for ( remI = -1, cmp = 0; ++remI < dvsL; ) {

                        if ( dvs[remI] != rem[remI] ) {
                            cmp = dvs[remI] > rem[remI] ? 1 : -1;
                            break;
                        }
                    }
                }

                // Subtract divisor from remainder (if divisor < remainder).
                if ( cmp < 0 ) {

                    // Remainder cannot be more than one digit longer than divisor.
                    // Equalise lengths using divisor with extra leading zero?
                    for ( dvsT = remL == dvsL ? dvs : dvsZ; remL; ) {

                        if ( rem[--remL] < dvsT[remL] ) {

                            for ( remI = remL;
                              remI && !rem[--remI];
                                rem[remI] = base - 1 ) {
                            }
                            --rem[remI];
                            rem[remL] += base;
                        }
                        rem[remL] -= dvsT[remL];
                    }
                    for ( ; !rem[0]; rem.shift() ) {
                    }
                } else {
                    break;
                }
            }

            // Add the 'next' digit to the result array.
            qc[qi++] = cmp ? next : ++next;

            // Update the remainder.
            rem[0] && cmp
              ? ( rem[remL] = dvd[dvdI] || 0 )
              : ( rem = [ dvd[dvdI] ] );

        } while ( ( dvdI++ < dvdL || rem[0] != null ) && s-- );

        // Leading zero? Do not remove if result is simply zero (qi == 1).
        if ( !qc[0] && qi != 1 ) {

            // There can't be more than one zero.
            --quo['e'];
            qc.shift();
        }

        // Round?
        if ( qi > dig ) {
            rnd( quo, DECIMAL_PLACES, base, isOdd, rem[0] != null );
        }

        // Overflow?
        if ( quo['e'] > MAX_EXP ) {

            // Infinity.
            quo['c'] = quo['e'] = null;

        // Underflow?
        } else if ( quo['e'] < MIN_EXP ) {

            // Zero.
            quo['c'] = [quo['e'] = 0];
        }

        return quo;
    }


    /*
     * Return a string representing the value of BigNumber n in normal or
     * exponential notation rounded to the specified decimal places or
     * significant digits.
     * Called by toString, toExponential (exp 1), toFixed, and toPrecision (exp 2).
     * d is the index (with the value in normal notation) of the digit that may be
     * rounded up.
     */
    function format( n, d, exp ) {

        // Initially, i is the number of decimal places required.
        var i = d - (n = new BigNumber(n))['e'],
            c = n['c'];

        // +-Infinity or NaN?
        if ( !c ) {
            return n['toS']();
        }

        // Round?
        if ( c.length > ++d ) {
            rnd( n, i, 10 );
        }

        // Recalculate d if toFixed as n['e'] may have changed if value rounded up.
        i = c[0] == 0 ? i + 1 : exp ? d : n['e'] + i + 1;

        // Append zeros?
        for ( ; c.length < i; c.push(0) ) {
        }
        i = n['e'];

        /*
         * toPrecision returns exponential notation if the number of significant
         * digits specified is less than the number of digits necessary to
         * represent the integer part of the value in normal notation.
         */
        return exp == 1 || exp == 2 && ( --d < i || i <= TO_EXP_NEG )

          // Exponential notation.
          ? ( n['s'] < 0 && c[0] ? '-' : '' ) + ( c.length > 1
            ? ( c.splice( 1, 0, '.' ), c.join('') )
            : c[0] ) + ( i < 0 ? 'e' : 'e+' ) + i

          // Normal notation.
          : n['toS']();
    }


    // Round if necessary.
    // Called by divide, format, setMode and sqrt.
    function rnd( x, dp, base, isOdd, r ) {
        var xc = x['c'],
            isNeg = x['s'] < 0,
            half = base / 2,
            i = x['e'] + dp + 1,

            // 'next' is the digit after the digit that may be rounded up.
            next = xc[i],

            /*
             * 'more' is whether there are digits after 'next'.
             * E.g.
             * 0.005 (e = -3) to be rounded to 0 decimal places (dp = 0) gives i = -2
             * The 'next' digit is zero, and there ARE 'more' digits after it.
             * 0.5 (e = -1) dp = 0 gives i = 0
             * The 'next' digit is 5 and there are no 'more' digits after it.
             */
            more = r || i < 0 || xc[i + 1] != null;

        r = ROUNDING_MODE < 4
          ? ( next != null || more ) &&
            ( ROUNDING_MODE == 0 ||
               ROUNDING_MODE == 2 && !isNeg ||
                 ROUNDING_MODE == 3 && isNeg )
          : next > half || next == half &&
            ( ROUNDING_MODE == 4 || more ||

              /*
               * isOdd is used in base conversion and refers to the least significant
               * digit of the integer part of the value to be converted. The fraction
               * part is rounded by this method separately from the integer part.
               */
              ROUNDING_MODE == 6 && ( xc[i - 1] & 1 || !dp && isOdd ) ||
                ROUNDING_MODE == 7 && !isNeg ||
                  ROUNDING_MODE == 8 && isNeg );

        if ( i < 1 || !xc[0] ) {
            xc.length = 0;
            xc.push(0);

            if ( r ) {

                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                xc[0] = 1;
                x['e'] = -dp;
            } else {

                // Zero.
                x['e'] = 0;
            }

            return x;
        }

        // Remove any digits after the required decimal places.
        xc.length = i--;

        // Round up?
        if ( r ) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for ( --base; ++xc[i] > base; ) {
                xc[i] = 0;

                if ( !i-- ) {
                    ++x['e'];
                    xc.unshift(1);
                }
            }
        }

        // Remove trailing zeros.
        for ( i = xc.length; !xc[--i]; xc.pop() ) {
        }

        return x;
    }


    // Round after setting the appropriate rounding mode.
    // Handles ceil, floor and round.
    function setMode( x, dp, rm ) {
        var r = ROUNDING_MODE;

        ROUNDING_MODE = rm;
        x = new BigNumber(x);
        x['c'] && rnd( x, dp, 10 );
        ROUNDING_MODE = r;

        return x;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P['abs'] = P['absoluteValue'] = function () {
        var x = new BigNumber(this);

        if ( x['s'] < 0 ) {
            x['s'] = 1;
        }

        return x;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber
     * rounded to a whole number in the direction of Infinity.
     */
    P['ceil'] = function () {
        return setMode( this, 0, 2 );
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
        if ( !i || !j ) {
            return null;
        }

        a = xc && !xc[0], b = yc && !yc[0];

        // Either zero?
        if ( a || b ) {
            return a ? b ? 0 : -j : i;
        }

        // Signs differ?
        if ( i != j ) {
            return i;
        }

        // Either Infinity?
        if ( a = i < 0, b = k == l, !xc || !yc ) {
            return b ? 0 : !xc ^ a ? 1 : -1;
        }

        // Compare exponents.
        if ( !b ) {
            return k > l ^ a ? 1 : -1;
        }

        // Compare digit by digit.
        for ( i = -1,
              j = ( k = xc.length ) < ( l = yc.length ) ? k : l;
              ++i < j; ) {

            if ( xc[i] != yc[i] ) {
                return xc[i] > yc[i] ^ a ? 1 : -1;
            }
        }
        // Compare lengths.
        return k == l ? 0 : k > l ^ a ? 1 : -1;
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
     * Return a new BigNumber whose value is the value of this BigNumber
     * divided by the value of BigNumber(y, b), rounded according to
     * DECIMAL_PLACES and ROUNDING_MODE.
     */
    P['dividedBy'] = P['div'] = function ( y, b ) {
        var xc = this['c'],
            xe = this['e'],
            xs = this['s'],
            yc = ( id = 2, y = new BigNumber( y, b ) )['c'],
            ye = y['e'],
            ys = y['s'],
            s = xs == ys ? 1 : -1;

        // Either NaN/Infinity/0?
        return !xe && ( !xc || !xc[0] ) || !ye && ( !yc || !yc[0] )

          // Either NaN?
          ? new BigNumber( !xs || !ys ||

            // Both 0 or both Infinity?
            ( xc ? yc && xc[0] == yc[0] : !yc )

              // Return NaN.
              ? NaN

              // x is 0 or y is Infinity?
              : xc && xc[0] == 0 || !yc

                // Return +-0.
                ? s * 0

                // y is 0. Return +-Infinity.
                : s / 0 )

          : divide( xc, yc, xe - ye, s, 10 );
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of
     * BigNumber(n, b), otherwise returns false.
     */
    P['equals'] = P['eq'] = function ( n, b ) {
        id = 3;
        return this['cmp']( n, b ) === 0;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber
     * rounded to a whole number in the direction of -Infinity.
     */
    P['floor'] = function () {
        return setMode( this, 0, 3 );
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of
     * BigNumber(n, b), otherwise returns false.
     */
    P['greaterThan'] = P['gt'] = function ( n, b ) {
        id = 4;
        return this['cmp']( n, b ) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to
     * the value of BigNumber(n, b), otherwise returns false.
     */
    P['greaterThanOrEqualTo'] = P['gte'] = function ( n, b ) {
        id = 5;
        return ( b = this['cmp']( n, b ) ) == 1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise
     * returns false.
     */
    P['isFinite'] = P['isF'] = function () {
        return !!this['c'];
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise returns
     * false.
     */
    P['isNaN'] = function () {
        return !this['s'];
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise
     * returns false.
     */
    P['isNegative'] = P['isNeg'] = function () {
        return this['s'] < 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise returns
     * false.
     */
    P['isZero'] = P['isZ'] = function () {
        return !!this['c'] && this['c'][0] == 0;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of
     * BigNumber(n, b), otherwise returns false.
     */
    P['lessThan'] = P['lt'] = function ( n, b ) {
        id = 6;
        return this['cmp']( n, b ) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the
     * value of BigNumber(n, b), otherwise returns false.
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
     * Return a new BigNumber whose value is the value of this BigNumber minus
     * the value of BigNumber(y, b).
     */
    P['minus'] = function ( y, b ) {
        var d, i, j, xLTy,
            x = this,
            a = x['s'];

        b = ( id = 8, y = new BigNumber( y, b ) )['s'];

        // Either NaN?
        if ( !a || !b ) {
            return new BigNumber(NaN);
        }

        // Signs differ?
        if ( a != b ) {
            return y['s'] = -b, x['plus'](y);
        }

        var xc = x['c'],
            xe = x['e'],
            yc = y['c'],
            ye = y['e'];

        if ( !xe || !ye ) {

            // Either Infinity?
            if ( !xc || !yc ) {
                return xc ? ( y['s'] = -b, y ) : new BigNumber( yc ? x : NaN );
            }

            // Either zero?
            if ( !xc[0] || !yc[0] ) {

                // y is non-zero?
                return yc[0]
                  ? ( y['s'] = -b, y )

                  // x is non-zero?
                  : new BigNumber( xc[0]
                    ? x

                    // Both are zero.
                    // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                    : ROUNDING_MODE == 3 ? -0 : 0 );
            }
        }

        // Determine which is the bigger number.
        // Prepend zeros to equalise exponents.
        if ( xc = xc.slice(), a = xe - ye ) {
            d = ( xLTy = a < 0 ) ? ( a = -a, xc ) : ( ye = xe, yc );

            for ( d.reverse(), b = a; b--; d.push(0) ) {
            }
            d.reverse();
        } else {

            // Exponents equal. Check digit by digit.
            j = ( ( xLTy = xc.length < yc.length ) ? xc : yc ).length;

            for ( a = b = 0; b < j; b++ ) {

                if ( xc[b] != yc[b] ) {
                    xLTy = xc[b] < yc[b];
                    break;
                }
            }
        }

        // x < y? Point xc to the array of the bigger number.
        if ( xLTy ) {
            d = xc, xc = yc, yc = d;
            y['s'] = -y['s'];
        }

        /*
         * Append zeros to xc if shorter. No need to add zeros to yc if shorter
         * as subtraction only needs to start at yc.length.
         */
        if ( ( b = -( ( j = xc.length ) - yc.length ) ) > 0 ) {

            for ( ; b--; xc[j++] = 0 ) {
            }
        }

        // Subtract yc from xc.
        for ( b = yc.length; b > a; ){

            if ( xc[--b] < yc[b] ) {

                for ( i = b; i && !xc[--i]; xc[i] = 9 ) {
                }
                --xc[i];
                xc[b] += 10;
            }
            xc[b] -= yc[b];
        }

        // Remove trailing zeros.
        for ( ; xc[--j] == 0; xc.pop() ) {
        }

        // Remove leading zeros and adjust exponent accordingly.
        for ( ; xc[0] == 0; xc.shift(), --ye ) {
        }

        /*
         * No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
         * when neither x or y are Infinity.
         */

        // Underflow?
        if ( ye < MIN_EXP || !xc[0] ) {

            /*
             * Following IEEE 754 (2008) 6.3,
             * n - n = +0  but  n - n = -0 when rounding towards -Infinity.
             */
            if ( !xc[0] ) {
                y['s'] = ROUNDING_MODE == 3 ? -1 : 1;
            }

            // Result is zero.
            xc = [ye = 0];
        }

        return y['c'] = xc, y['e'] = ye, y;
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
     * Return a new BigNumber whose value is the value of this BigNumber modulo
     * the value of BigNumber(y, b).
     */
    P['modulo'] = P['mod'] = function ( y, b ) {
        var x = this,
            xc = x['c'],
            yc = ( id = 9, y = new BigNumber( y, b ) )['c'],
            i = x['s'],
            j = y['s'];

        // Is x or y NaN, or y zero?
        b = !i || !j || yc && !yc[0];

        if ( b || xc && !xc[0] ) {
            return new BigNumber( b ? NaN : x );
        }

        x['s'] = y['s'] = 1;
        b = y['cmp'](x) == 1;
        x['s'] = i, y['s'] = j;

        return b
          ? new BigNumber(x)
          : ( i = DECIMAL_PLACES, j = ROUNDING_MODE,
            DECIMAL_PLACES = 0, ROUNDING_MODE = 1,
              x = x['div'](y),
                DECIMAL_PLACES = i, ROUNDING_MODE = j,
                  this['minus']( x['times'](y) ) );
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber
     * negated, i.e. multiplied by -1.
     */
    P['negated'] = P['neg'] = function () {
        var x = new BigNumber(this);

        return x['s'] = -x['s'] || null, x;
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
     * Return a new BigNumber whose value is the value of this BigNumber plus
     * the value of BigNumber(y, b).
     */
    P['plus'] = function ( y, b ) {
        var d,
            x = this,
            a = x['s'];

        b = ( id = 10, y = new BigNumber( y, b ) )['s'];

        // Either NaN?
        if ( !a || !b ) {
            return new BigNumber(NaN);
        }

        // Signs differ?
        if ( a != b ) {
            return y['s'] = -b, x['minus'](y);
        }

        var xe = x['e'],
            xc = x['c'],
            ye = y['e'],
            yc = y['c'];

        if ( !xe || !ye ) {

            // Either Infinity?
            if ( !xc || !yc ) {

                // Return +-Infinity.
                return new BigNumber( a / 0 );
            }

            // Either zero?
            if ( !xc[0] || !yc[0] ) {

                // y is non-zero?
                return yc[0]
                  ? y

                  // x is non-zero?
                  : new BigNumber( xc[0]
                    ? x

                    // Both are zero. Return zero.
                    : a * 0 );
            }
        }

        // Prepend zeros to equalise exponents.
        // Note: Faster to use reverse then do unshifts.
        if ( xc = xc.slice(), a = xe - ye ) {
            d = a > 0 ? ( ye = xe, yc ) : ( a = -a, xc );

            for ( d.reverse(); a--; d.push(0) ) {
            }
            d.reverse();
        }

        // Point xc to the longer array.
        if ( xc.length - yc.length < 0 ) {
            d = yc, yc = xc, xc = d;
        }

        /*
         * Only start adding at yc.length - 1 as the
         * further digits of xc can be left as they are.
         */
        for ( a = yc.length, b = 0; a;
             b = ( xc[--a] = xc[a] + yc[a] + b ) / 10 ^ 0, xc[a] %= 10 ) {
        }

        // No need to check for zero, as +x + +y != 0 && -x + -y != 0

        if ( b ) {
            xc.unshift(b);

            // Overflow? (MAX_EXP + 1 possible)
            if ( ++ye > MAX_EXP ) {

                // Infinity.
                xc = ye = null;
            }
        }

         // Remove trailing zeros.
        for ( a = xc.length; xc[--a] == 0; xc.pop() ) {
        }

        return y['c'] = xc, y['e'] = ye, y;
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber raised to
     * the power e. If e is negative round according to DECIMAL_PLACES and
     * ROUNDING_MODE.
     *
     * e {number} Integer, -MAX_POWER to MAX_POWER inclusive.
     */
    P['toPower'] = P['pow'] = function ( e ) {

        // e to integer, avoiding NaN or Infinity becoming 0.
        var i = e * 0 == 0 ? e | 0 : e,
            x = new BigNumber(this),
            y = new BigNumber(ONE);

        // Use Math.pow?
        // Pass +-Infinity for out of range exponents.
        if ( ( ( ( outOfRange = e < -MAX_POWER || e > MAX_POWER ) &&
          (i = e * 1 / 0) ) ||

             /*
              * Any exponent that fails the parse becomes NaN.
              *
              * Include 'e !== 0' because on Opera -0 == parseFloat(-0) is false,
              * despite -0 === parseFloat(-0) && -0 == parseFloat('-0') is true.
              */
             parse(e) != e && e !== 0 && !(i = NaN) ) &&

              // 'pow() exponent not an integer: {e}'
              // 'pow() exponent out of range: {e}'
              !ifExceptionsThrow( e, 'exponent', 'pow' ) ||

                // Pass zero to Math.pow, as any value to the power zero is 1.
                !i ) {

            // i is +-Infinity, NaN or 0.
            return new BigNumber( Math.pow( x['toS'](), i ) );
        }

        for ( i = i < 0 ? -i : i; ; ) {

            if ( i & 1 ) {
                y = y['times'](x);
            }
            i >>= 1;

            if ( !i ) {
                break;
            }
            x = x['times'](x);
        }

        return e < 0 ? ONE['div'](y) : y;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber
     * rounded to a maximum of dp decimal places using rounding mode rm, or to
     * 0 and ROUNDING_MODE respectively if omitted.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     * [rm] {number} Integer, 0 to 8 inclusive.
     */
    P['round'] = function ( dp, rm ) {

        dp = dp == null || ( ( ( outOfRange = dp < 0 || dp > MAX ) ||
          parse(dp) != dp ) &&

            // 'round() decimal places out of range: {dp}'
            // 'round() decimal places not an integer: {dp}'
            !ifExceptionsThrow( dp, 'decimal places', 'round' ) )
              ? 0
              : dp | 0;

        rm = rm == null || ( ( ( outOfRange = rm < 0 || rm > 8 ) ||

          // Include '&& rm !== 0' because with Opera -0 == parseFloat(-0) is false.
          parse(rm) != rm && rm !== 0 ) &&

            // 'round() mode not an integer: {rm}'
            // 'round() mode out of range: {rm}'
            !ifExceptionsThrow( rm, 'mode', 'round' ) )
              ? ROUNDING_MODE
              : rm | 0;

        return setMode( this, dp, rm );
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt( N) =  N
     *  sqrt(-I) =  N
     *  sqrt( I) =  I
     *  sqrt( 0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of
     * this BigNumber, rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P['squareRoot'] = P['sqrt'] = function () {
        var n, r, re, t,
            x = this,
            c = x['c'],
            s = x['s'],
            e = x['e'],
            dp = DECIMAL_PLACES,
            rm = ROUNDING_MODE,
            half = new BigNumber('0.5');

        // Negative/NaN/Infinity/zero?
        if ( s !== 1 || !c || !c[0] ) {

            return new BigNumber( !s || s < 0 && ( !c || c[0] )
              ? NaN
              : c ? x : 1 / 0 );
        }

        // Initial estimate.
        s = Math.sqrt( x['toS']() );
        ROUNDING_MODE = 1;

        /*
          Math.sqrt underflow/overflow?
          Pass x to Math.sqrt as integer, then adjust the exponent of the result.
         */
        if ( s == 0 || s == 1 / 0 ) {
            n = c.join('');

            if ( !( n.length + e & 1 ) ) {
                n += '0';
            }
            r = new BigNumber( Math.sqrt(n) + '' );

            // r may still not be finite.
            if ( !r['c'] ) {
                r['c'] = [1];
            }
            r['e'] = ( ( ( e + 1 ) / 2 ) | 0 ) - ( e < 0 || e & 1 );
        } else {
            r = new BigNumber( n = s.toString() );
        }
        re = r['e'];
        s = re + ( DECIMAL_PLACES += 4 );

        if ( s < 3 ) {
            s = 0;
        }
        e = s;

        // Newton-Raphson iteration.
        for ( ; ; ) {
            t = r;
            r = half['times']( t['plus']( x['div'](t) ) );

            if ( t['c'].slice( 0, s ).join('') === r['c'].slice( 0, s ).join('') ) {
                c = r['c'];

                /*
                  The exponent of r may here be one less than the final result
                  exponent (re), e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust
                  s so the rounding digits are indexed correctly.
                 */
                s = s - ( n && r['e'] < re );

                /*
                  The 4th rounding digit may be in error by -1 so if the 4 rounding
                  digits are 9999 or 4999 (i.e. approaching a rounding boundary)
                  continue the iteration.
                 */
                if ( c[s] == 9 && c[s - 1] == 9 && c[s - 2] == 9 &&
                        ( c[s - 3] == 9 || n && c[s - 3] == 4 ) ) {

                    /*
                      If 9999 on first run through, check to see if rounding up
                      gives the exact result as the nines may infinitely repeat.
                     */
                    if ( n && c[s - 3] == 9 ) {
                        t = r['round']( dp, 0 );

                        if ( t['times'](t)['eq'](x) ) {
                            ROUNDING_MODE = rm;
                            DECIMAL_PLACES = dp;

                            return t;
                        }
                    }
                    DECIMAL_PLACES += 4;
                    s += 4;
                    n = '';
                } else {

                    /*
                      If the rounding digits are null, 0000 or 5000, check for an
                      exact result. If not, then there are further digits so
                      increment the 1st rounding digit to ensure correct rounding.
                     */
                    if ( !c[e] && !c[e - 1] && !c[e - 2] &&
                            ( !c[e - 3] || c[e - 3] == 5 ) ) {

                        // Truncate to the first rounding digit.
                        if ( c.length > e - 2 ) {
                            c.length = e - 2;
                        }

                        if ( !r['times'](r)['eq'](x) ) {

                            while ( c.length < e - 3 ) {
                                c.push(0);
                            }
                            c[e - 3]++;
                        }
                    }
                    ROUNDING_MODE = rm;
                    rnd( r, DECIMAL_PLACES = dp, 10 );

                    return r;
                }
            }
        }
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
     * Return a new BigNumber whose value is the value of this BigNumber times
     * the value of BigNumber(y, b).
     */
    P['times'] = function ( y, b ) {
        var c,
            x = this,
            xc = x['c'],
            yc = ( id = 11, y = new BigNumber( y, b ) )['c'],
            i = x['e'],
            j = y['e'],
            a = x['s'];

        y['s'] = a == ( b = y['s'] ) ? 1 : -1;

        // Either NaN/Infinity/0?
        if ( !i && ( !xc || !xc[0] ) || !j && ( !yc || !yc[0] ) ) {

            // Either NaN?
            return new BigNumber( !a || !b ||

              // x is 0 and y is Infinity  or  y is 0 and x is Infinity?
              xc && !xc[0] && !yc || yc && !yc[0] && !xc

                // Return NaN.
                ? NaN

                // Either Infinity?
                : !xc || !yc

                  // Return +-Infinity.
                  ? y['s'] / 0

                  // x or y is 0. Return +-0.
                  : y['s'] * 0 );
        }
        y['e'] = i + j;

        if ( ( a = xc.length ) < ( b = yc.length ) ) {
            c = xc, xc = yc, yc = c, j = a, a = b, b = j;
        }

        for ( j = a + b, c = []; j--; c.push(0) ) {
        }

        // Multiply!
        for ( i = b - 1; i > -1; i-- ) {

            for ( b = 0, j = a + i;
                  j > i;
                  b = c[j] + yc[i] * xc[j - i - 1] + b,
                  c[j--] = b % 10 | 0,
                  b = b / 10 | 0 ) {
            }

            if ( b ) {
                c[j] = ( c[j] + b ) % 10;
            }
        }

        b && ++y['e'];

        // Remove any leading zero.
        !c[0] && c.shift();

        // Remove trailing zeros.
        for ( j = c.length; !c[--j]; c.pop() ) {
        }

        // No zero check needed as only x * 0 == 0 etc.

        // Overflow?
        y['c'] = y['e'] > MAX_EXP

          // Infinity.
          ? ( y['e'] = null )

          // Underflow?
          : y['e'] < MIN_EXP

            // Zero.
            ? [ y['e'] = 0 ]

            // Neither.
            : c;

        return y;
    };


    /*
     * Return a string representing the value of this BigNumber in exponential
     * notation to dp fixed decimal places and rounded using ROUNDING_MODE if
     * necessary.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     */
    P['toExponential'] = P['toE'] = function ( dp ) {

        return format( this,
          ( dp == null || ( ( outOfRange = dp < 0 || dp > MAX ) ||

            /*
             * Include '&& dp !== 0' because with Opera -0 == parseFloat(-0) is
             * false, despite -0 == parseFloat('-0') && 0 == -0 being true.
             */
            parse(dp) != dp && dp !== 0 ) &&

              // 'toE() decimal places not an integer: {dp}'
              // 'toE() decimal places out of range: {dp}'
              !ifExceptionsThrow( dp, 'decimal places', 'toE' ) ) && this['c']
                ? this['c'].length - 1
                : dp | 0, 1 );
    };


    /*
     * Return a string representing the value of this BigNumber in normal
     * notation to dp fixed decimal places and rounded using ROUNDING_MODE if
     * necessary.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Integer, 0 to MAX inclusive.
     */
    P['toFixed'] = P['toF'] = function ( dp ) {
        var n, str, d,
            x = this;

        if ( !( dp == null || ( ( outOfRange = dp < 0 || dp > MAX ) ||
            parse(dp) != dp && dp !== 0 ) &&

            // 'toF() decimal places not an integer: {dp}'
            // 'toF() decimal places out of range: {dp}'
            !ifExceptionsThrow( dp, 'decimal places', 'toF' ) ) ) {
              d = x['e'] + ( dp | 0 );
        }

        n = TO_EXP_NEG, dp = TO_EXP_POS;
        TO_EXP_NEG = -( TO_EXP_POS = 1 / 0 );

        // Note: str is initially undefined.
        if ( d == str ) {
            str = x['toS']();
        } else {
            str = format( x, d );

            // (-0).toFixed() is '0', but (-0.1).toFixed() is '-0'.
            // (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
            if ( x['s'] < 0 && x['c'] ) {

                // As e.g. -0 toFixed(3), will wrongly be returned as -0.000 from toString.
                if ( !x['c'][0] ) {
                    str = str.replace(/^-/, '');

                // As e.g. -0.5 if rounded to -0 will cause toString to omit the minus sign.
                } else if ( str.indexOf('-') < 0 ) {
                    str = '-' + str;
                }
            }
        }
        TO_EXP_NEG = n, TO_EXP_POS = dp;

        return str;
    };


    /*
     * Return a string array representing the value of this BigNumber as a
     * simple fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to
     * the specified maximum denominator. If a maximum denominator is not
     * specified, the denominator will be the lowest value necessary to
     * represent the number exactly.
     *
     * [maxD] {number|string|BigNumber} Integer >= 1 and < Infinity.
     */
    P['toFraction'] = P['toFr'] = function ( maxD ) {
        var q, frac, n0, d0, d2, n, e,
            n1 = d0 = new BigNumber(ONE),
            d1 = n0 = new BigNumber('0'),
            x = this,
            xc = x['c'],
            exp = MAX_EXP,
            dp = DECIMAL_PLACES,
            rm = ROUNDING_MODE,
            d = new BigNumber(ONE);

        // NaN, Infinity.
        if ( !xc ) {
            return x['toS']();
        }

        e = d['e'] = xc.length - x['e'] - 1;

        // If max denominator is undefined or null...
        if ( maxD == null ||

             // or NaN...
             ( !( id = 12, n = new BigNumber(maxD) )['s'] ||

               // or less than 1, or Infinity...
               ( outOfRange = n['cmp'](n1) < 0 || !n['c'] ) ||

                 // or not an integer...
                 ( ERRORS && n['e'] < n['c'].length - 1 ) ) &&

                   // 'toFr() max denominator not an integer: {maxD}'
                   // 'toFr() max denominator out of range: {maxD}'
                   !ifExceptionsThrow( maxD, 'max denominator', 'toFr' ) ||

                     // or greater than the maxD needed to specify the value exactly...
                     ( maxD = n )['cmp'](d) > 0 ) {

            // d is e.g. 10, 100, 1000, 10000... , n1 is 1.
            maxD = e > 0 ? d : n1;
        }

        MAX_EXP = 1 / 0;
        n = new BigNumber( xc.join('') );

        for ( DECIMAL_PLACES = 0, ROUNDING_MODE = 1; ; )  {
            q = n['div'](d);
            d2 = d0['plus']( q['times'](d1) );

            if ( d2['cmp'](maxD) == 1 ) {
                break;
            }

            d0 = d1, d1 = d2;

            n1 = n0['plus']( q['times']( d2 = n1 ) );
            n0 = d2;

            d = n['minus']( q['times']( d2 = d ) );
            n = d2;
        }

        d2 = maxD['minus'](d0)['div'](d1);
        n0 = n0['plus']( d2['times'](n1) );
        d0 = d0['plus']( d2['times'](d1) );

        n0['s'] = n1['s'] = x['s'];

        DECIMAL_PLACES = e * 2;
        ROUNDING_MODE = rm;

        // Determine which fraction is closer to x, n0 / d0 or n1 / d1?
        frac = n1['div'](d1)['minus'](x)['abs']()['cmp'](
          n0['div'](d0)['minus'](x)['abs']() ) < 1
          ? [ n1['toS'](), d1['toS']() ]
          : [ n0['toS'](), d0['toS']() ];

        return MAX_EXP = exp, DECIMAL_PLACES = dp, frac;
    };


    /*
     * Return a string representing the value of this BigNumber to sd significant
     * digits and rounded using ROUNDING_MODE if necessary.
     * If sd is less than the number of digits necessary to represent the integer
     * part of the value in normal notation, then use exponential notation.
     *
     * sd {number} Integer, 1 to MAX inclusive.
     */
    P['toPrecision'] = P['toP'] = function ( sd ) {

        /*
         * ERRORS true: Throw if sd not undefined, null or an integer in range.
         * ERRORS false: Ignore sd if not a number or not in range.
         * Truncate non-integers.
         */
        return sd == null || ( ( ( outOfRange = sd < 1 || sd > MAX ) ||
          parse(sd) != sd ) &&

            // 'toP() precision not an integer: {sd}'
            // 'toP() precision out of range: {sd}'
            !ifExceptionsThrow( sd, 'precision', 'toP' ) )
              ? this['toS']()
              : format( this, --sd | 0, 2 );
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or
     * base 10 if b is omitted. If a base is specified, including base 10,
     * round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal
     * to or less than TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to 64 inclusive.
     */
    P['toString'] = P['toS'] = function ( b ) {
        var u, str, strL,
            x = this,
            xe = x['e'];

        // Infinity or NaN?
        if ( xe === null ) {
            str = x['s'] ? 'Infinity' : 'NaN';

        // Exponential format?
        } else if ( b === u && ( xe <= TO_EXP_NEG || xe >= TO_EXP_POS ) ) {
            return format( x, x['c'].length - 1, 1 );
        } else {
            str = x['c'].join('');

            // Negative exponent?
            if ( xe < 0 ) {

                // Prepend zeros.
                for ( ; ++xe; str = '0' + str ) {
                }
                str = '0.' + str;

            // Positive exponent?
            } else if ( strL = str.length, xe > 0 ) {

                if ( ++xe > strL ) {

                    // Append zeros.
                    for ( xe -= strL; xe-- ; str += '0' ) {
                    }
                } else if ( xe < strL ) {
                    str = str.slice( 0, xe ) + '.' + str.slice(xe);
                }

            // Exponent zero.
            } else {
                if ( u = str.charAt(0), strL > 1 ) {
                    str = u + '.' + str.slice(1);

                // Avoid '-0'
                } else if ( u == '0' ) {
                    return u;
                }
            }

            if ( b != null ) {

                if ( !( outOfRange = !( b >= 2 && b < 65 ) ) &&
                  ( b == (b | 0) || !ERRORS ) ) {
                    str = convert( str, b | 0, 10, x['s'] );

                    // Avoid '-0'
                    if ( str == '0' ) {
                        return str;
                    }
                } else {

                    // 'toS() base not an integer: {b}'
                    // 'toS() base out of range: {b}'
                    ifExceptionsThrow( b, 'base', 'toS' );
                }
            }

        }

        return x['s'] < 0 ? '-' + str : str;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     *
     */
    P['toNumber'] = P['toN'] = function () {
        var x = this;

        // Ensure zero has correct sign.
        return +x || ( x['s'] ? 0 * x['s'] : NaN );
    };


    /*
     * Return as toString, but do not accept a base argument.
     */
    P['valueOf'] = function () {
        return this['toS']();
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
        define( function () {
            return BigNumber;
        });

    //Browser.
    } else {
        global['BigNumber'] = BigNumber;
    }

})( this );
