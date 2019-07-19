const fetch = require('@dollarshaveclub/node-fetch');
const _ = require('lodash');

const Request = fetch.Request;
const Response = fetch.Response;
const Headers = fetch.Headers;

async function fetchShim(url, options = {}) {
  let updatedUrl = url;

  const resolveOverride = _.get(options, 'cf.resolveOverride');
  if (!resolveOverride) {
    // In Cloudflare Workers, host header
    // is ignored
    const headers = _.get(options, 'headers', {});
    delete headers.host;
  } else {
    // But.... you can override the host header using the resolveOverride.
    const fetchUrl = new URL(url);
    _.set(options, 'headers.host', fetchUrl.host);

    updatedUrl = url.replace(fetchUrl.host, resolveOverride);
  }

  let req = new Request(updatedUrl, options)

  // In Cloudflare, no upstream requests
  // get streamed so read the entire body in and
  // create a new request with that body.
  // Techinically, this can be disabled by Cloudflare support
  // but it's enabled by default so we will use that as
  // our behavior.
  if (req.body) {
    const body = await req.arrayBuffer()
    req = new Request(req, { body: body })
  }

  const resp = await fetch(req)
  const shim = new ShimResponse(resp.body, resp)
  freezeHeaders(shim.headers)
  return shim
}

function freezeHeaders(headers) {
  Object.defineProperty(headers, 'set', {
    value: (url, status) => {
      throw new TypeError("Can't modify immutable headers")
    },
    writable: false,
  })
  headers.frozen = true
}

class ShimResponse extends Response {
  static redirect(url, status) {
    return new ShimResponse('', { status: status || 302, headers: { Location: url } })
  }

  clone() {
    const cloned = super.clone()
    const res = new ShimResponse(cloned.body, {
      url: cloned.url,
      status: cloned.status,
      statusText: cloned.statusText,
      headers: cloned.headers,
      ok: cloned.ok,
    })

    if (this.headers.frozen) {
      freezeHeaders(res.headers)
    }

    return res
  }
}

class ShimRequest extends Request {
  clone() {
    const cloned = super.clone();
    const req = new ShimRequest(cloned);
    if (this.headers.frozen) {
      freezeHeaders(req.headers);
    }

    return req;
  }
}

module.exports.fetch = fetchShim;
module.exports.Request = ShimRequest;
module.exports.Response = ShimResponse;
module.exports.Headers = Headers;
module.exports.freezeHeaders = freezeHeaders;
