const config = {
  development: {
    isProduction: false
  },

  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({}, {
  apiPort: process.env.LISTEN_PORT || 3000,

  github: {
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  },

  mongoURL: process.env.MONGO_URL,

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  },

  secret: process.env.SECRET
}, config);
