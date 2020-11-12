import base from './webpack.config.base';
import WebpackBar from 'webpackbar';
import webpackMerge from 'webpack-merge';


const dev = webpackMerge(base, {
  mode: 'development',
  devtool: 'cheap-source-map',
  optimization: {
    minimize: false,
  },
  plugins: [
    new WebpackBar(),
  ]
})

export default dev;
