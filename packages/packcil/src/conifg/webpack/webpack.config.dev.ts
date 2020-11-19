import base from './webpack.config.base';
import WebpackBar from 'webpackbar';
import webpackMerge from 'webpack-merge';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const dev = webpackMerge(base(), {
  mode: 'development',
  devtool: 'cheap-source-map',
  optimization: {
    minimize: false,
  },
  plugins: [
    new ReactRefreshPlugin(),
    new WebpackBar(),
  ]
})

export default dev;
