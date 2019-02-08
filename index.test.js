require('./index');

test('duped module', () => {
  expect(global.COUNT).toBe(1);
});