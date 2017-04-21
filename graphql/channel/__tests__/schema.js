const mongoose = require('mongoose');
const { graphql } = require('graphql');
const Channel = require('../');
const schema = require('../../schema');

describe('Channel schema test case', () => {
  beforeEach(async () => await Channel.model.remove({}));
  afterAll(async () => await mongoose.disconnect());

  it('Should create channel', async () => {
    const channelName = 'test-foo';

    const query = `
      mutation createChannel($name: String!) {
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
    const channel = await Channel.handlers.createChannel({ name: channelName });

    const query = `
      query getChannel($channelId: ID!) {
        channel(channelId: $channelId) {
          name
        }
      }
    `;

    const result = await graphql(schema, query, {}, {}, { channelId: channel._id });
    expect(result.data).toMatchSnapshot();
    expect(result.data.channel.name).toBe(channelName);
  });

  it('Should return all channels', async () => {
    const channels = [
      { name: 'test-foo' },
      { name: 'test-foo1' },
      { name: 'asasd' }
    ];

    await Promise.all(channels.map(({ name }) => Channel.handlers.createChannel({ name })));

    const query = `
      {
        channels {
          name
        }
      }
    `;

    const result = await graphql(schema, query);
    expect(result.data).toMatchSnapshot();
    expect(result.data.channels.length).toBe(channels.length);
  });
});
