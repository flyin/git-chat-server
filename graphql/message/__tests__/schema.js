const _ = require('lodash');
const mongoose = require('mongoose');
const { graphql } = require('graphql');

const Channel = require('../../channel');
const Message = require('../../message');
const { clearDatabase } = require('../../../commands/clear-database');
const schema = require('../../schema');

describe('Channel schema test case', () => {
  beforeEach(async () => await clearDatabase());
  afterAll(async () => await mongoose.disconnect());

  it('Should create message', async () => {
    const query = `
      mutation createMessage($text: String!, $channelId: String!) {
        createMessage(text: $text, channelId: $channelId) {
          text
          channel {
            name
          }
        }
      }
    `;

    const channel = await Channel.handlers.createChannel({ name: 'some-channel' });
    const result = await graphql(schema, query, {}, {}, { channelId: channel._id, text: 'Some message' });
    expect(result.data).toMatchSnapshot();
  });

  it('Should return channel messages', async () => {
    const query = `
      query messages($channelId: ID!) {
        messages(channelId: $channelId) {
          channel {
            name
          }
          text
        }
      }
    `;

    const channel = await Channel.handlers.createChannel({ name: 'some-channel' });
    const anotherChannel = await Channel.handlers.createChannel({ name: 'some-another-channel' });

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

    await Promise.all([...messages, ...anotherMessages].map(({ channelId, text }) => Message.handlers.createMessage({ channelId, text })));
    const result = await graphql(schema, query, {}, {}, { channelId: channel._id });
    expect(result.data.messages.length).toBe(messages.length);

    result.data.messages.forEach(message => {
      expect(_.findIndex(messages, {text: message.text})).toBeGreaterThanOrEqual(0);
      expect(message).toMatchSnapshot(`message-${message.text}`);
    });
  });
});
