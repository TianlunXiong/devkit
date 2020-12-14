module.exports = {
  app: 'spa',
  html: 'page/index.html',
  boot: 'page/bootstrap.tsx',
  pages: [
    {
      src: 'page/index/index.tsx',
      pathname: '/',
      exact: true,
    },
    {
      src: 'page/overview/index.tsx',
      pathname: '/overview'
    },
  ],
  css: 'style',
};
