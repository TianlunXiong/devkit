
module.exports = {
  boot: 'pages/index/boot',
  src: {
    'home': 'pages/index/index.tsx',
    'user': 'pages/index/index.tsx',
    'user2': 'pages/index/index.tsx',
  },
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
