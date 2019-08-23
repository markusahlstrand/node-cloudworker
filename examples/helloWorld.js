const ncw = require('../');

ncw.applyShims();

const handler = event => {
    const request = event.request;

    return new Response(JSON.stringify({        
        headers: [...request.headers],
        url: request.url,        
    }), { status: 200 });
};

ncw.start(handler);