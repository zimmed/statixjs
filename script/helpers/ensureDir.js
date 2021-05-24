const fs = require('fs');

module.exports = function ensureDir(path) {
  try {
    fs.mkdirSync(path, { recursive: true });
    return true;
  } catch (e) {
    return false;
  }
};
