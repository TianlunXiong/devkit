export function babelBaseConfig() {
  return {
    presets: [
      [require.resolve('@babel/preset-env'), {
        useBuiltIns: "usage", // 按需引入 polyfill
        // modules: false,
        corejs: 3,
      }],
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          "corejs": 3 // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
        }
      ],
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
    ],
  }
}

export default babelBaseConfig();
