import { findIndex, get } from 'lodash';
import { graphql } from 'graphql';
import schema from 'schema';
import chatResolvers from 'resolvers/chat';
import { initTestCase } from 'utils/tests-utils';

const { createChannel, createMessage } = chatResolvers.Mutation;

initTestCase();

describe('chat resolvers', () => {
  describe('mutations', () => {
    it('should validate channel', async () => {
      const query = `
        mutation channel($name: String!) {
          createChannel(name: $name){
            name
          }
        }
      `;

      const result = await graphql(schema, query, {}, {}, { name: null });
      expect(result.data).toBeUndefined();
      expect(result.errors).toMatchSnapshot();
    });

    it('should validate message', async () => {
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

      const result = await graphql(schema, query, {}, {}, { channelId: null, text: null });
      expect(result.data).toBeUndefined();
      expect(result.errors).toMatchSnapshot();
    });

    it('should create channel', async () => {
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
      expect(get(result.data, 'createChannel.name')).toBe(channelName);
    });

    it('should create message', async () => {
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

      const channel = await createChannel(null, { name: 'some-channel' });
      const result = await graphql(schema, query, {}, {}, { channelId: channel._id, text: 'Some message' });

      expect(result.errors).toBeUndefined();
      expect(result.data).toMatchSnapshot();
    });
  });

  describe('queries', () => {
    it('should return channel messages', async () => {
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

      const channel = await createChannel(null, { name: 'some-channel' });
      const anotherChannel = await createChannel(null, { name: 'some-another-channel' });

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
      ].map(({ channelId, text }) => createMessage(null, { channelId, text })));

      const result = await graphql(schema, query, {}, {}, { channelId: channel._id });
      expect(get(result.data, 'getMessages', []).length).toBe(messages.length);

      const resultAnother = await graphql(schema, query, {}, {}, { channelId: anotherChannel._id });
      expect(get(resultAnother.data, 'getMessages', []).length).toBe(anotherMessages.length);

      get(result.data, 'getMessages', []).forEach((message: { text: string }) => {
        expect(findIndex(messages, { text: message.text })).toBeGreaterThanOrEqual(0);
        expect(message).toMatchSnapshot(`message-${message.text}`);
      });
    });

    it('should return channel by id', async () => {
      const channelName = 'test-foo';
      const channel = await createChannel(null, { name: channelName });

      const query = `
        query getChannel($channelId: ID!) {
          getChannel(channelId: $channelId) {
            name
          }
        }
      `;

      const result = await graphql(schema, query, {}, {}, { channelId: channel._id });
      expect(result.data).toMatchSnapshot();
      expect(get(result.data, 'getChannel.name')).toBe(channelName);
    });

    it('should return all channels', async () => {
      const channels = [
        { name: 'test-foo' },
        { name: 'test-foo1' },
        { name: 'asasd' }
      ];

      await Promise.all(channels.map(({ name }) => createChannel(null, { name })));

      const query = `
        {
          getChannels {
            name
          }
        }
      `;

      const result = await graphql(schema, query);
      expect(result.data).toMatchSnapshot();
      expect(get(result.data, 'getChannels', []).length).toBe(channels.length);
    });
  });
});
