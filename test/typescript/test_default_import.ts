import BigNumber from "bignumber.js";

const v: BigNumber.Value = 42;
const x: BigNumber.Instance = new BigNumber(v);

console.log(x.toString());
