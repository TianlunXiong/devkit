#!/usr/bin/env node

const importLocal = require('import-local');

if (importLocal(__filename)) {
  try {
    require('../lib/cli');
  } catch (e) {
    
  }
} else {
  try {
    require('../lib/cli');
  } catch (e) {

  }
}
