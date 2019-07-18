const { Request, Response, fetch, Headers, freezeHeaders } = require('./fetch')
const { URL } = require('./url')
const { ReadableStream, WritableStream, TransformStream } = require('./stream')
const { FetchEvent } = require('./fetch-event')
const { crypto } = require('./crypto')
const { TextDecoder, TextEncoder } = require('./text-encoder')
const { atob, btoa } = require('./base64')
const CacheFactory = require('./cache')

// Register context functions corresponding to cloudflares environment
function apply(context) {
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
    context.crypto = crypto;
    context.TextDecoder = TextDecoder;
    context.TextEncoder = TextEncoder;
    context.atob = atob;
    context.btoa = btoa;
    context.INSTALL_OPTIONS = {};
}

module.exports = {
    apply,
};
