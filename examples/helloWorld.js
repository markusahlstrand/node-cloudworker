const ncw = require('../');

ncw.applyShims();

const handler = event => {
    return new Response('hello', { status: 200 });
};

ncw.start(handler);