const verify = require('./linter/index').verify;

test('Expect linter to show errors', () => {
  expect(verify()).toBe(2);
});
