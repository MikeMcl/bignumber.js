In CJS mode (i.e. when the pkg.json does not have type: module) the following does not import the namespace correctly
import { BigNumber } from "bignumber.js";
so users will have to use import BigNumber from "bignumber.js";
or change the mode to ESM mode using type: module in pkg.json

If type: module is used in pkg.json then tsc emits ESM code when tsconfig.json has module: nodenext
If type: module is not used in pkg.json then tsc emits CJS code when tsconfig.json has module: nodenext