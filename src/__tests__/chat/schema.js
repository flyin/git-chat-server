const _ = require('lodash');
const { graphql } = require('graphql');

const { connection, mongoose } = require('../../services/mongoose');
const { Mutation } = require('../../resolvers/chat');
const { clearDatabase } = require('../../commands/clear-database');
const schema = require('../../schema');

describe('Chat schema test case', () => {
  beforeAll(() => connection);
  afterAll(() => mongoose.disconnect());
  beforeEach(() => clearDatabase());

  it('Should create message', async () => {
    const query = `
      mutation message($text: String!, $channelId: String!) {
        createMessage(text: $text, channelId: $channelId) {
          text
          channel {
            name
          }
        }
      }
    `;

    const channel = await Mutation.createChannel(null, { name: 'some-channel' });
    const result = await graphql(schema, query, {}, {}, { channelId: channel._id, text: 'Some message' });
    expect(result.data).toMatchSnapshot();
  });

  it('Should return channel messages', async () => {
    const query = `
      query messages($channelId: ID!) {
        getMessages(channelId: $channelId) {
          channel {
            name
          }
          text
        }
      }
    `;

    const channel = await Mutation.createChannel(null, { name: 'some-channel' });
    const anotherChannel = await Mutation.createChannel(null, { name: 'some-another-channel' });

    const messages = [
      { channelId: channel._id, text: 'message-1' },
      { channelId: channel._id, text: 'message-2' },
      { channelId: channel._id, text: 'message-3' },
      { channelId: channel._id, text: 'message-4' }
    ];

    const anotherMessages = [
      { channelId: anotherChannel._id, text: 'message-10' },
      { channelId: anotherChannel._id, text: 'message-11' },
      { channelId: anotherChannel._id, text: 'message-12' }
    ];

    await Promise.all([
      ...messages,
      ...anotherMessages
    ].map(({ channelId, text }) => Mutation.createMessage(null, { channelId, text })));

    const result = await graphql(schema, query, {}, {}, { channelId: channel._id });
    expect(result.data.getMessages.length).toBe(messages.length);

    result.data.getMessages.forEach(message => {
      expect(_.findIndex(messages, { text: message.text })).toBeGreaterThanOrEqual(0);
      expect(message).toMatchSnapshot(`message-${message.text}`);
    });
  });

  it('Should create channel', async () => {
    const channelName = 'test-foo';

    const query = `
      mutation channel($name: String!) {
        createChannel(name: $name){
          name
        }
      }
    `;

    const result = await graphql(schema, query, {}, {}, { name: channelName });
    expect(result.data).toMatchSnapshot();
    expect(result.data.createChannel.name).toBe(channelName);
  });

  it('Should return channel by id', async () => {
    const channelName = 'test-foo';
    const channel = await Mutation.createChannel(null, { name: channelName });

    const query = `
      query getChannel($channelId: ID!) {
        getChannel(channelId: $channelId) {
          name
        }
      }
    `;

    const result = await graphql(schema, query, {}, {}, { channelId: channel._id });
    expect(result.data).toMatchSnapshot();
    expect(result.data.getChannel.name).toBe(channelName);
  });

  it('Should return all channels', async () => {
    const channels = [
      { name: 'test-foo' },
      { name: 'test-foo1' },
      { name: 'asasd' }
    ];

    await Promise.all(channels.map(({ name }) => Mutation.createChannel(null, { name })));

    const query = `
      {
        getChannels {
          name
        }
      }
    `;

    const result = await graphql(schema, query);
    expect(result.data).toMatchSnapshot();
    expect(result.data.getChannels.length).toBe(channels.length);
  });
});
