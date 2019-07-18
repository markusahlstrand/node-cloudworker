const runtime = require('../runtime')

test('apply the runtime', () => {
  runtime.apply(this);
});

test('patch atob and btoa', () => {
  const context = {};
  runtime.apply(context);

  expect(context.atob).toBeDefined();
  expect(context.btoa).toBeDefined();
  
  expect(atob(btoa('test'))).toBe('test');
});

test('patch textencoder and decoder', () => {
  const context = {};
  runtime.apply(context);

  expect(context.TextEncoder).toBeDefined();
  expect(context.TextDecoder).toBeDefined();
  
  const textEncoder = new context.TextEncoder();
  const textDecoder = new context.TextDecoder();

  expect(textDecoder.decode(textEncoder.encode('test'))).toBe('test');
})