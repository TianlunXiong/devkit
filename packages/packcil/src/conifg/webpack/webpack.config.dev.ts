import base from './webpack.config.base';
import WebpackBar from 'webpackbar';
import webpackMerge from 'webpack-merge';
// import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

// 增加 react-refresh/babel 热替换插件
if (base.module?.rules?.[0]) {
  // @ts-ignore
  // base.module.rules[0]?.use[0]?.options.plugins.push([require.resolve('react-refresh/babel')])
}

const dev = webpackMerge(base, {
  mode: 'development',
  devtool: 'cheap-source-map',
  optimization: {
    minimize: false,
  },
  plugins: [
    // new ReactRefreshPlugin(),
    new WebpackBar(),
  ]
})

export default dev;
