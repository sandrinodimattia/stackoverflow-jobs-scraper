const fs = require('fs');
const path = require('path');
const CSV = require('comma-separated-values');

module.exports = (filePath, data) => {
  const output = new CSV(data, { header: true, cellDelimiter: '\t' }).encode();
  fs.writeFileSync(path.join(__dirname, '..', filePath), output);
};
