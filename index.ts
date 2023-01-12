module.exports = {
  rules: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    'data-test-id': require('./data-test-id').default,
    'data-test-id-possible': require('./data-test-id-possible').default
  },
  configs: {
    recommended: {
      plugins: ['eslint-plugin-test-id-custom'],
      rules: {
        'test-id-custom/data-test-id': ['error'],
        'test-id-custom/data-test-id-possible': ['warn']
      },
    }
  }
};
