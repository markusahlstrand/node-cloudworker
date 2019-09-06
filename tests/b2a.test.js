const atob = require('atob')

test('test for URI Malformed in atob', () => {
    const base64 = "ycRRFbQ5cb7+g9HI44Yvcc+HtCwI+ZeENsXSrFB2N8/d75j6brGvjiIIhl7CLKX9RAKZOCGuF3CtiJB6xr8a0bjlh6cowpv4y+470Qri0u9eqvGQCkZ3/hDMohHsNWiDZj/6+cYxGW1tDySV839q4cKktmcZkUkzbGRotu0ALHn5VMBDbbeJup+lDTjP5YGV2JPgY2GyzWjaV/voaKA5QSGBSbKAqAnZJjyGaqG9a91zOmoxiJbempoTh3sDirDwHBTi4aOwRG4d6+LYJPW6SOAiFjq1/1VhEmMQPCWbwMAFtUW05sjSqvzaba3FvqQ4qE7DJ++Efdo/Un1Owdg7qw==";
    // This should not throw a URI Malformed exception which is what the b2a package does
    atob(base64);
});