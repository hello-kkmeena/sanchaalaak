const environments = {
  development: {
    API_URL: 'http://localhost:8080',
  },
  staging: {
    API_URL: 'https://staging-api.yourdomain.com',
  },
  production: {
    API_URL: 'https://api.yourdomain.com',
  },
};

const config = {
  ...environments[process.env.NODE_ENV || 'development'],
  ENV: process.env.NODE_ENV,
  VERSION: process.env.REACT_APP_VERSION,
  // Add other configuration variables
};

// Ensure API_URL doesn't end with a slash
if (config.API_URL.endsWith('/')) {
  config.API_URL = config.API_URL.slice(0, -1);
}

export default config; 