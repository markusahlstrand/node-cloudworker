const fs = require('fs');
const path = require('path');

module.exports = class KvFsShim {
  constructor({ namespace }) {
    this.namespace = namespace;
  }

  async get(key) {
    try {
      const value = fs.readFileSync(path.join(this.namespace, key));
      return value;
    } catch (err) {
      return null;
    }
  }
};
