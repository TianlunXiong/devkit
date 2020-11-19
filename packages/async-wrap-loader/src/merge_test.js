const path = require('path')
const fs = require('fs');

const { parse } = require('@babel/parser');
const bootCodeRequest = path.resolve('./test.tsx');

const fd = fs.openSync(bootCodeRequest);
const src = Buffer.from('');
fs.readSync(fd, src)
// const src = require('fs').readFileSync(bootRequest, { encoding: 'utf8' });


const external_ast = parse(src, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript', 'dynamicImport'],
});

console.log(external_ast);