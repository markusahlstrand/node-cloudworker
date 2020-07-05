require('dotenv').config();
const ncw = require('../');

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

const handler = async (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Sloppy regex to fetch the key of kv-object
  const kvMatch = url.pathname.match(/kv\/(.*)/);

  if (kvMatch) {
    const key = kvMatch[1];

    if (request.method === 'GET') {
      const value = await TEST.get(key);
      if (value) {
        return new Response(value, { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    } else if (request.method === 'PUT') {
      await TEST.put(key, request.body);
      return new Response('Created', { status: 201 });
    }
    return new Response('Method not supported', { status: 405 });
  }

  if (url.pathname === '/pipeTo') {
    const response = await fetch('https://www.google.com/');

    // This is not the fastest way to do it, but want to validate that it works
    const { readable, writable } = new TransformStream();
    response.body.pipeTo(writable);

    return new Response(readable, { status: 200 });
  }

  return new Response(
    JSON.stringify({
      headers: [...request.headers],
      url: request.url,
    }),
    { status: 200 },
  );
};

ncw.start(handler);
