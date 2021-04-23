
module.exports = {
  src: {
    'home': './pages/index/index.tsx',
    'user': './pages/index/index.tsx',
    'user2': './pages/index/index.tsx',
    'mpa':'pages/index/boot',
    'h1': './index.html'
  },
  boot: 'mpa',
  html: 'h1',
  pages: {
    '/': 'home',
    '/user': 'user',
    '/user1': 'user',
    '/main/user': 'user'
  },
  cloud: {
    export: ['home']
  }
};
