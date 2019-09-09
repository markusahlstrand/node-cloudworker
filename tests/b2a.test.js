const atob = require('../runtime/atob')

test('test for URI Malformed in atob', () => {
    const base64 = 'ycRRFbQ5cb7+g9HI44Yvcc+HtCwI+ZeENsXSrFB2N8/d75j6brGvjiIIhl7CLKX9RAKZOCGuF3CtiJB6xr8a0bjlh6cowpv4y+470Qri0u9eqvGQCkZ3/hDMohHsNWiDZj/6+cYxGW1tDySV839q4cKktmcZkUkzbGRotu0ALHn5VMBDbbeJup+lDTjP5YGV2JPgY2GyzWjaV/voaKA5QSGBSbKAqAnZJjyGaqG9a91zOmoxiJbempoTh3sDirDwHBTi4aOwRG4d6+LYJPW6SOAiFjq1/1VhEmMQPCWbwMAFtUW05sjSqvzaba3FvqQ4qE7DJ++Efdo/Un1Owdg7qw==';
    // This should not throw a URI Malformed exception which is what the b2a package does
    atob(base64);
});

test('test for url-escaped strings in atob', () => {
    const base64 = 'xHjx54XPG_2-Um9geOuIWfmfzeelYBbnsmkh4lray_CRzx-LmWcMUyIgY0JnOUemCydCQV11armVWJBs6M0bND0zxGVwUN9U0c0_soGJ1GblU1K_Jg1eqHiHtgX4zGCYq0zLUsMR018I6V5aM49E3CertOgDF5_ILcovS9IIIs6RAlgg8ZHsVShBAVO2lORIQfdEzOiwC3bmZ0lLxwPiICcjDyfqOpRt3x0sHfudsf4oqDwzFlMKpwCTgGSIdxE5sh8l7-Y7a7tWZhYTQWAC6uwvMG-OOADBpnmrB3Bqa4Eo96fMaa8Wg2K83GfjfZMiqF0wGcWmS2kEQsSNYLlzwA';

    expect(() => {        
        atob(base64);
    }).toThrow();
})