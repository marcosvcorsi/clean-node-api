import paths from './paths';
import schemas from './schemas';
import components from './components';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do para realizar enquente entre programadores',
    version: '1.0.0',
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
    {
      name: 'Enquetes',
    },
  ],
  paths,
  schemas,
  components,
};
