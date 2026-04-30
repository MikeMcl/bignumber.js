import BigNumber from "bignumber.js";

function takeBigNumber(value: BigNumber): void { void value; }
function takeBoolean(value: boolean): void { void value; }
function takeComparison(value: 1 | -1 | 0 | null): void { void value; }
function takeConstructor(value: BigNumber.Constructor): void { void value; }
function takeConfig(value: BigNumber.Config): void { void value; }
function takeFormat(value: BigNumber.Format): void { void value; }
function takeFraction(value: [BigNumber, BigNumber]): void { void value; }
function takeInstance(value: BigNumber.Instance): void { void value; }
function takeModuloMode(value: BigNumber.ModuloMode): void { void value; }
function takeNumber(value: number): void { void value; }
function takeNumberOrNull(value: number | null): void { void value; }
function takeObject(value: { c: number[] | null; e: number | null; s: number | null }): void {
  void value;
}
function takeRoundingMode(value: BigNumber.RoundingMode): void { void value; }
function takeString(value: string): void { void value; }
function takeValue(value: BigNumber.Value): void { void value; }
function takeBigIntOrNull(value: bigint | null): void { void value; }

const roundingModes: BigNumber.RoundingMode[] = [
  BigNumber.ROUND_UP,
  BigNumber.ROUND_DOWN,
  BigNumber.ROUND_CEIL,
  BigNumber.ROUND_FLOOR,
  BigNumber.ROUND_HALF_UP,
  BigNumber.ROUND_HALF_DOWN,
  BigNumber.ROUND_HALF_EVEN,
  BigNumber.ROUND_HALF_CEIL,
  BigNumber.ROUND_HALF_FLOOR
];

const moduloModes: BigNumber.ModuloMode[] = [
  BigNumber.ROUND_UP,
  BigNumber.ROUND_DOWN,
  BigNumber.ROUND_FLOOR,
  BigNumber.ROUND_HALF_EVEN,
  BigNumber.EUCLID
];

takeRoundingMode(roundingModes[0]);
takeModuloMode(moduloModes[0]);

const format: BigNumber.Format = {
  prefix: "£",
  negativeSign: "-",
  positiveSign: "+",
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
  secondaryGroupSize: 2,
  fractionGroupSeparator: " ",
  fractionGroupSize: 2,
  suffix: " GBP"
};

const config: BigNumber.Config = {
  DECIMAL_PLACES: 20,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  EXPONENTIAL_AT: [-7, 21],
  RANGE: [-1000, 1000],
  CRYPTO: false,
  STRICT: true,
  MODULO_MODE: BigNumber.EUCLID,
  POW_PRECISION: 10,
  FORMAT: format,
  ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz"
};

takeFormat(format);
takeConfig(config);

const instanceLike: BigNumber.Instance = {
  c: [123450000000000],
  e: 2,
  s: 1,
  _isBigNumber: true
};

const values: BigNumber.Value[] = [123.45, "678.9", 123n, instanceLike];
takeInstance(instanceLike);
takeValue(values[0]);

const sample: BigNumber = new BigNumber(values[0]);
const sampleBase: BigNumber = new BigNumber("ff", 16);
const sampleCall: BigNumber = BigNumber(sample);
const sampleCallBase: BigNumber = BigNumber("ff", 16);

takeBigNumber(sample);
takeBigNumber(sampleBase);
takeBigNumber(sampleCall);
takeBigNumber(sampleCallBase);
takeInstance(sample);

const cloned: BigNumber.Constructor = BigNumber.clone(config);
takeConstructor(cloned);
takeBigNumber(new cloned("10", 16));
takeBigNumber(cloned(5));
takeConfig(cloned.config(config));
takeConfig(cloned.set(config));

takeConfig(BigNumber.config(config));
takeConfig(BigNumber.config());
takeConfig(BigNumber.set(config));
takeConfig(BigNumber.set());
takeBigNumber(BigNumber.fromFormat("£1,234.50 GBP", format));
takeBigNumber(BigNumber.maximum(1, sample, "2"));
takeBigNumber(BigNumber.max(1, sample, "2"));
takeBigNumber(BigNumber.minimum(1, sample, "2"));
takeBigNumber(BigNumber.min(1, sample, "2"));
takeBigNumber(BigNumber.random(5));
takeBigNumber(BigNumber.sum(1, sample, "2"));

const maybeBigNumber: unknown = sample;
if (BigNumber.isBigNumber(maybeBigNumber)) {
  takeBigNumber(maybeBigNumber);
}

takeBigNumber(sample.absoluteValue());
takeBigNumber(sample.abs());
takeComparison(sample.comparedTo(sampleBase));
takeComparison(sample.comparedTo("ff", 16));
takeNumberOrNull(sample.decimalPlaces());
takeBigNumber(sample.decimalPlaces(2, BigNumber.ROUND_DOWN));
takeNumberOrNull(sample.dp());
takeBigNumber(sample.dp(2, BigNumber.ROUND_DOWN));
takeBigNumber(sample.dividedBy(sampleBase));
takeBigNumber(sample.dividedBy("10", 16));
takeBigNumber(sample.div(sampleBase));
takeBigNumber(sample.div("10", 16));
takeBigNumber(sample.dividedToIntegerBy(sampleBase));
takeBigNumber(sample.dividedToIntegerBy("10", 16));
takeBigNumber(sample.idiv(sampleBase));
takeBigNumber(sample.idiv("10", 16));
takeBigNumber(sample.exponentiatedBy(2));
takeBigNumber(sample.exponentiatedBy(sampleBase, 7));
takeBigNumber(sample.pow(2));
takeBigNumber(sample.pow(sampleBase, 7));
takeBigNumber(sample.integerValue(BigNumber.ROUND_HALF_EVEN));
takeBoolean(sample.isEqualTo(sampleBase));
takeBoolean(sample.isEqualTo("ff", 16));
takeBoolean(sample.eq(sampleBase));
takeBoolean(sample.eq("ff", 16));
takeBoolean(sample.isFinite());
takeBoolean(sample.isGreaterThan(sampleBase));
takeBoolean(sample.isGreaterThan("ff", 16));
takeBoolean(sample.gt(sampleBase));
takeBoolean(sample.gt("ff", 16));
takeBoolean(sample.isGreaterThanOrEqualTo(sampleBase));
takeBoolean(sample.isGreaterThanOrEqualTo("ff", 16));
takeBoolean(sample.gte(sampleBase));
takeBoolean(sample.gte("ff", 16));
takeBoolean(sample.isInteger());
takeBoolean(sample.isLessThan(sampleBase));
takeBoolean(sample.isLessThan("ff", 16));
takeBoolean(sample.lt(sampleBase));
takeBoolean(sample.lt("ff", 16));
takeBoolean(sample.isLessThanOrEqualTo(sampleBase));
takeBoolean(sample.isLessThanOrEqualTo("ff", 16));
takeBoolean(sample.lte(sampleBase));
takeBoolean(sample.lte("ff", 16));
takeBoolean(sample.isNaN());
takeBoolean(sample.isNegative());
takeBoolean(sample.isPositive());
takeBoolean(sample.isZero());
takeBigNumber(sample.minus(sampleBase));
takeBigNumber(sample.minus("10", 16));
takeBigNumber(sample.modulo(sampleBase));
takeBigNumber(sample.modulo("10", 16));
takeBigNumber(sample.mod(sampleBase));
takeBigNumber(sample.mod("10", 16));
takeBigNumber(sample.multipliedBy(sampleBase));
takeBigNumber(sample.multipliedBy("10", 16));
takeBigNumber(sample.times(sampleBase));
takeBigNumber(sample.times("10", 16));
takeBigNumber(sample.negated());
takeBigNumber(sample.plus(sampleBase));
takeBigNumber(sample.plus("10", 16));
takeNumber(sample.precision());
takeBigNumber(sample.precision(4, BigNumber.ROUND_HALF_UP));
takeNumber(sample.sd());
takeBigNumber(sample.sd(4, BigNumber.ROUND_HALF_UP));
takeBigNumber(sample.shiftedBy(2));
takeBigNumber(sample.squareRoot());
takeBigNumber(sample.sqrt());
takeBigIntOrNull(sample.toBigInt(BigNumber.ROUND_DOWN));
takeString(sample.toExponential());
takeString(sample.toExponential(2, BigNumber.ROUND_DOWN));
takeString(sample.toFixed());
takeString(sample.toFixed(-1, BigNumber.ROUND_DOWN));
takeString(sample.toFormat(format));
takeString(sample.toFormat(2, format));
takeString(sample.toFormat([2, 5], BigNumber.ROUND_DOWN, format));
takeFraction(sample.toFraction(100));
takeString(sample.toJSON());
takeNumber(sample.toNumber());
takeObject(sample.toObject());
takeString(sample.toPrecision());
takeString(sample.toPrecision(4, BigNumber.ROUND_DOWN));
takeString(sample.toString());
takeString(sample.toString(16));
takeString(sample.valueOf());