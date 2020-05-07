import scaffold from './scaffolder';

suite('scaffolder', () => {
  test('that the ci config is generated for a node project', async () => {
    await scaffold();
  });
});
