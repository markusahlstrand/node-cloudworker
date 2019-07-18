The node-cloudworker is a cloudflare worker shim for node combined with a small webserver, enabling debugging locally. It's most likely not as close to the production environment as https://github.com/dollarshaveclub/cloudworker.


## Installing

Installing via NPM:
```
npm install node-cloudworker --save
```

## Package Usage

````
const ncm = require('node-cloudworker');

// Some handlers may depend on the shims
ncm.applyShims();

const handler = event => {
    return new Response('hello', { status: 200 });
};

ncm.start(handler);

```
