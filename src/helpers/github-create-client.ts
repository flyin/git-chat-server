import * as Github from 'github';
import settings from 'settings';

export default (token: string) => {
  const client: Github = new Github({ debug: !settings.isProduction, headers: { 'user-agent': '@flyin/git-chat-server' } });
  client.authenticate({ token, type: 'oauth' });
  return client;
};
