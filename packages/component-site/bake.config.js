module.exports = {
  app: 'mpa',
  pages: [
    {
      pathname: '/',
      src: 'pages/web/index.tsx',
      html: 'pages/web/index.html',
      boot: 'pages/web/bootstrap.tsx',
    },
    {
      pathname: '/demo',
      src: 'pages/demo/index.tsx',
      html: 'pages/demo/index.html',
      boot: 'pages/demo/bootstrap.tsx',
    },
  ],
  css: 'style',
};
