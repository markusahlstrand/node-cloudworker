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