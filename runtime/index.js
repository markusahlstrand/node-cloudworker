const atob = require('./atob');
const btoa = require('btoa');
const FormData = require('formdata-node');
const { Request, Response, fetch, Headers } = require('./fetch');
const { URL } = require('./url');
const { ReadableStream, WritableStream, TransformStream } = require('./stream');
const { FetchEvent } = require('./fetch-event');
const { crypto } = require('./crypto');
const { TextDecoder, TextEncoder } = require('./text-encoder');
const CacheFactory = require('./cache');
const KvStorage = require('cloudflare-kv-storage-rest');

// Register context functions corresponding to cloudflares environment
function apply(context, config = {}) {
  context.caches = new CacheFactory();
  context.fetch = fetch;
  context.Request = Request;
  context.Response = Response;
  context.Headers = Headers;
  context.URL = URL;
  context.ReadableStream = ReadableStream;
  context.WritableStream = WritableStream;
  context.TransformStream = TransformStream;
  context.FetchEvent = FetchEvent;
  context.FormData = FormData;
  context.crypto = crypto;
  context.TextDecoder = TextDecoder;
  context.TextEncoder = TextEncoder;
  context.atob = atob;
  context.btoa = btoa;
  context.INSTALL_OPTIONS = {};

  if (config.kv) {
    const bindings = config.kv.bindings || [];

    bindings.forEach((binding) => {
      context[binding.variable] = new KvStorage({
        namespace: binding.namespace,
        authEmail: config.kv.authEmail,
        authKey: config.kv.authKey,
        accountId: config.kv.accountId,
      });
    });
  }
}

module.exports = {
  apply,
};
