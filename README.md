The node-cloudworker is a cloudflare worker shim for node combined with a small webserver, enabling debugging locally. It's most likely not as close to the production environment as https://github.com/dollarshaveclub/cloudworker.


## Installing

Installing via NPM:
```
npm install https://github.com/markusahlstrand/node-cloudworker
```

## Package Usage

````
const node-cloudworker = require('https://github.com/markusahlstrand/node-cloudworker');

const handler = event => {
    return new Response('hello', { status: 200 });
};

node-cloudworker.start(handler);

```
