const connect = require('connect');
const http = require('http');
const toBuffer = require('typedarray-to-buffer');

const runtime = require('./runtime');

// The content-encoding will typically be gzip which doesn't match when serving locally
const headerBlackList = ['content-encoding'];

// Set a flag that can be used to handle local execution differntly
process.env.LOCAL = true;

function streamToBuffer(stream) {
  return new Promise((resolve) => {
    const segments = [];

    stream.on('data', (chunk) => {
      segments.push(chunk.toString());
    });

    stream.on('end', () => {
      resolve(segments.join(''));
    });
  });
}

async function stream(res, readable) {
  const reader = readable.getReader();
  let done = false;

  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    const { value } = await reader.read();

    if (!value || value.length === 0) {
      done = true;
    } else {
      const buffer = toBuffer(value);
      res.write(buffer);
    }
  }

  res.end();
}

function sendResponse(method, res, { status = 404, body = 'Not found', headers = new Headers() }) {
  res.statusCode = status;

  headers.forEach((value, key) => {
    if (headerBlackList.indexOf(key) === -1) {
      res.setHeader(key, value);
    }
  });

  if (method === 'HEAD' || body === null) {
    res.end();
  } else if (body.readable || body.getReader) {
    stream(res, body);
  } else {
    res.end(body);
  }
}

function applyShims(config) {
  runtime.apply(global, config);
}

function start(handler, port = 3000) {
  const app = connect();

  // Hook up the cloudflare worker handler
  app.use(async (req, res) => {
    const options = {
      headers: {
        ...req.headers,
        // Add cloudflare headers with placeholderss
        'x-forwarded-proto': 'http',
        'x-real-ip': '127.0.0.1',
        'cf-visitor': '{"scheme":"http"}',
        'cf-ray': '50ab35020a50cde3',
        'cf-ipcountry': 'XX',
        'cf-connecting-ip': '127.0.0.1',
      },
      method: req.method,
    };

    if (['POST', 'PUT', 'PATCH'].indexOf(options.method) !== -1) {
      options.body = await streamToBuffer(req);
    }

    const request = new Request(`http://localhost:${port}${req.url}`, options);

    const event = {
      request,
      waitUntil: () => {},
    };

    const response = await handler(event);
    sendResponse(req.method, res, response);
  });

  http.createServer(app).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on port ${port}`);
  });
}

module.exports = {
  applyShims,
  start,
};
