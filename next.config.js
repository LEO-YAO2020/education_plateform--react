// const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
// const withCss = require('@zeit/next-css');

// if (typeof require !== 'undefined') {
//   require.extensions['.css'] = file => {};
// }

// module.exports = withCss({
//   webpack: config => {
//     config.plugins.push(
//       new FilterWarningsPlugin({
//         exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
//       }),
//     );
//     return config;
//   },
// });
const withLess = require('@zeit/next-less');

module.exports = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      });
    }
    return config;
  },
});
