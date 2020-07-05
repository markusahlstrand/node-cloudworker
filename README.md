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

## Cloudflare API's

Cloudflare exposes some cloudflare-specific API's inside the workers. Parts of these are supported with shims.

### Cache

The cache api is borrowed from the [Cloudworker](https://github.com/dollarshaveclub/cloudworker) repo.

### KV-Storage (Beta)

The kv-storage api is using the Cloudflare rest-api to access the KV-Storage. It requires some configuration when applying the shims so that it can access the cloudflare api's:
```
ncw.applyShims({
  kv: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    authEmail: process.env.CLOUDFLARE_AUTH_EMAIL,
    authKey: process.env.CLOUDFLARE_AUTH_KEY,
    bindings: [
      {
        variable: 'TEST',
        namespace: process.env.KV_STORAGE_NAMESPACE,
      },
    ],
  },
});
```

So far it only supports CRUD-operations and it does not include the metadata-functionality as this is not yet available through the rest-api.