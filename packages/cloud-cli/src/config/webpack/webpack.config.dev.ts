import base from './webpack.config.base';
import webpackMerge from 'webpack-merge';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const dev = webpackMerge(base(), {
  mode: 'development',
  devtool: 'cheap-source-map',
  optimization: {
    minimize: false,
  },
});

export default dev;
