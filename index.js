const connect = require('connect');
const http = require('http');
const toBuffer = require('typedarray-to-buffer');

const runtime = require('./runtime');

// The content-encoding will typically be gzip which doesn't match when serving locally
const headerBlackList = ['content-encoding'];

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

function sendResponse(method, res, {
    status = 404,
    body = 'Not found',
    headers = new Headers(),
}) {
    res.statusCode = status;

    headers.forEach((value, key) => {
        if (headerBlackList.indexOf(key) === -1) {
            res.setHeader(key, value);
        }
    })

    if (method === 'HEAD') {
        res.end();
    } else if (body.readable || body.getReader) {
        stream(res, body);
    } else {
        res.end(body);
    }
}

function start(handler) {
    runtime.apply(global);

    const app = connect();

    // Hook up the cloudflare worker handler
    app.use(async (req, res) => {
        if (['POST', 'PUT', 'PATCH'].indexOf(req.method) !== -1) {
            req.body = await streamToBuffer(req);
        }

        const event = {
            request: req,
            waitUntil: () => { },
        };

        const response = await handler(event);
        sendResponse(req.method, res, response);
    });

    http.createServer(app)
        .listen(3000, () => {
            // eslint-disable-next-line no-console
            console.log('Server started on port 3000');
        });

}

module.exports = {
    start,
}