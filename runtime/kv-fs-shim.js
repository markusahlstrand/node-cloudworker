const fs = require('fs');
const path = require('path');
const mime = require('mime');

module.exports = class KvFsShim {
  constructor({ namespace }) {
    this.namespace = namespace;
  }

  async get(key) {
    try {
      const value = fs.readFileSync(path.join(this.namespace, key)).toString();
      return value;
    } catch (err) {
      return null;
    }
  }

  async getWithMetadata(key) {
    try {
      const value = fs.readFileSync(path.join(this.namespace, key)).toString();
      const metadata = {
        headers: {
          'Content-Type': mime.getType(path.extname(key)),
        },
      };

      return {
        status: 200,
        value,
        metadata,
      };
    } catch (err) {
      return null;
    }
  }
};
