// Requires Node ≥ 14.14.0 for `fs.rmSync({ recursive: true })`.
const {
  existsSync: exists,
  rmSync: rm,
  mkdirSync: mkdir,
  readFileSync: readFile,
  writeFileSync: writeFile
} = require('fs');

const { join } = require('path');

// Define paths
const srcJs = 'bignumber.js';
const srcDts = 'bignumber.d.ts';
const distDir = 'dist';

// Clear dist folder
if (exists(distDir)) {
  rm(distDir, { recursive: true, force: true });
}
mkdir(distDir, { recursive: true });

// Read source files
const jsContent = readFile(srcJs, 'utf8');
const dtsContent = readFile(srcDts, 'utf8');

// ESM version
const esmJs = `${jsContent}\nexport { BigNumber };\n\nexport default BigNumber;\n`;
writeFile(join(distDir, 'bignumber.mjs'), esmJs, 'utf8');

const esmDts = `${dtsContent}\nexport { BigNumber };\n\nexport default BigNumber;\n`;
writeFile(join(distDir, 'bignumber.d.mts'), esmDts, 'utf8');

// CommonJS version
const namedExportHelper = "\nBigNumber['default'] = BigNumber.BigNumber = BigNumber;\n";
const cjsJs = `${jsContent}${namedExportHelper}\nmodule.exports = BigNumber;\n`;
writeFile(join(distDir, 'bignumber.cjs'), cjsJs, 'utf8');

const cjsDts = `${dtsContent}\nexport = BigNumber;\n`;
writeFile(join(distDir, 'bignumber.d.cts'), cjsDts, 'utf8');

// Global version
const globalJs = `(function() {\n${jsContent}
(typeof globalThis !== 'undefined' ? globalThis :
  typeof window !== 'undefined' ? window : self).BigNumber = BigNumber;
})();\n`;

writeFile(join(distDir, 'bignumber.js'), globalJs, 'utf8');
//const globalDts = dtsContent.replace(
//  /(declare\s+class\s+BigNumber\b.*)/,
//  `$1\ndeclare global {\n  var BigNumber: typeof BigNumber;\n}`
//);
const globalDts = dtsContent;
writeFile(join(distDir, 'bignumber.d.ts'), globalDts, 'utf8');

console.log('Build completed successfully.');

``
