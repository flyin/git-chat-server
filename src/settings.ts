type Environment = 'test' | 'production' | 'development';

interface GithubConfig {
  callbackURL?: string;
  clientId?: string;
  clientSecret?: string;
}

interface RedisConfig {
  host: string;
  port: number;
}

interface Config {
  apiPort: number;
  env: Environment;
  github: GithubConfig;
  isProduction: boolean;
  mongoURL: string;
  redis: RedisConfig;
  secret: string;
}

const env: Environment = (process.env.NODE_ENV || 'production') as Environment;

const config: Config = {
  apiPort: Number(process.env.LISTEN_PORT || 8000),
  env,

  github: {
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  },

  isProduction: env === 'production',
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost/git-chat',

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379)
  },

  secret: process.env.SECRET || 'some-super-secret',

  ...({
    production: {},
    development: {},

    test: {
      mongoURL: process.env.TEST_MONGO_URL || 'mongodb://localhost/git-chat-test'
    }
  }[env])
};

export default config;
