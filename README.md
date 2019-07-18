The node-cloudworker is a cloudflare worker shim for node combined with a small webserver, enabling debugging locally. It should not be used in production.

It's most likely not as close to the production environment as https://github.com/dollarshaveclub/cloudworker, which most of the runtime has been borrowed from, but it makes debugging and testing possible.

## Installing

Installing via NPM:
```
npm install node-cloudworker --save
```

## Package Usage

````
const ncw = require('node-cloudworker');

// Some handlers may depend on the shims
ncw.applyShims();

const handler = event => {
    return new Response('hello', { status: 200 });
};

ncw.start(handler);

```
