const atob = require('atob');

module.exports = function atobWrapper(data) {
    // The atob shim handles this, but the browser does not..
    if (data.indexOf('_') !== -1 || data.indexOf('-') !== -1) {
        throw new Error('The string to be decoded is not correctly encoded.');
    }

    return atob(data);
};
